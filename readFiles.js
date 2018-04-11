/*eslint no-console:0 */

const d3 = require('d3-dsv');
const fs = require('fs');
const path = require('path');
const async = require('async');
const cheerio = require('cheerio');

// Path to the files on my computer
var folderPath = path.resolve('./CSV');


/* Reads the file contents and sets the name to the filename */
function readfile(pathName, cb) {
    fs.readFile(path.join(folderPath, pathName), 'utf8', (err, data) => {
        if (err) {
            cb(err);
            return;
        }
        // Send data back to map
        cb(null, {
            name: path.parse(pathName).name,
            questions: data
        });
    });
}

/* Reads all file names in folder and sends to readFile */
fs.readdir(folderPath, (err, items) => {
    items = items
        // Filter to CSV files
        .filter(item => path.extname(item) === '.csv')
        //remove the v1 files if there is a v2 file
        .filter((fileName, i, fileNames) => {
            //get the number after the V for version
            var version = fileName.match(/_V(\d)/);
            //if there was not a number keep it
            if (version === null) {
                console.log('we got a null:', fileName);
                return true;
            }

            //keep the number that was captured with the parentheses 
            version = version[1];



            if (version === '1') {
                //make a name that has V2 in it not V1

                var v2Name = fileName.replace('_V1', '_V2');
                //console.log(v2Name);
                //if there is a v2name in the filenames list don't keep v1
                return !fileNames.includes(v2Name);
            }

            //keep everything else
            return true;
        });

    // Send each file to readFile
    async.map(items, readfile, (err, files) => {
        if (err) {
            console.log(err);
            return;
        }
        formatQuizzes(files);

    });
});

/* Parses the data then sets the Course Id and Canvas settings for each quiz */
function formatQuizzes(quizzes) {
    var addCourseIds = (quiz) => {
        quiz.questions = d3.csvParse(quiz.questions);

        var skillToCourseIdMap = {
            R: 10952,
            W: 10955,
            S: 10957,
            L: 10956
        };

        // Grabs the skill letter which is the first letter after the first underscore
        var skill = quiz.name.split('_')[1][0];
        // Sets the course Id using skillToCourseIdMap
        quiz.courseId = skillToCourseIdMap[skill];

        return quiz;
    };

    var addCanvasSettings = quiz => {
        var hideResults,
        quizType = quiz.name.slice(0,2);
        if(quizType === "FP"){
            hideResults = null
        } else if( quizType === "PC"){
            hideResults = "always"
        } else {
            quiz.err = "this quiz does not have FP or PC";
        }
        

        // Canvas quiz settings
        quiz.canvasSettings = {
            'title': quiz.name,
            'quiz_type': 'assignment',
            'allowed_attempts': -1,
            'scoring_policy': "keep_latest",
            'hide_results': hideResults,
            'published': true
        };
        return quiz;
    };



    //add courseids and  add canvasSettings
    quizzes = quizzes
        .map(addCourseIds)
        .map(addCanvasSettings);


    //fix the questions
    fixQuestionData(quizzes);
    console.log(JSON.stringify(quizzes, null, 3));
}

function fixQuestionData(quizzes) {

    var splitQuestionName = question => {
        if (!question.passagenum) {
            var numbers = question.questionname.match(/\d/g);
            if (numbers !== null && numbers.length === 2) {
                question.passageNumber = parseInt(numbers[0], 10);
                question.questionNumber = parseInt(numbers[1], 10);
            }
        } else if (question.hasOwnProperty('passagenum') && question.hasOwnProperty('questionname')) {
            question.passageNumber = question.passagenum;
            question.questionNumber = question.questionname;
        } else {
            question.err = 'does not have questionname or passagenum & questionname';
        }
        return question;
    };

    var byPassageAndQuestion = (qA, qB) => {
        var getSortNum = q => q.passageNumber * 100 + q.questionNumber;
        var sortNumA = getSortNum(qA);
        var sortNumB = getSortNum(qB);

        return sortNumA - sortNumB;
    };

    var makeQuestionText = (question) => {
        //make the prop
        questionText = '';

        //add the passage if we need it
        if (question.questionNumber === 1) {
            //we need to remove the css link tags from the passage text
            var $ = cheerio.load(question.passagetext);
            $('link').remove();

            //now add it to the text
            questionText += $('body').html();
        }

        //add in the actual question
        questionText += question.questiontext;

        //make the real prop 
        question.question_text = questionText;

        return question;
    }

    var addQuestionType = (question) => {
        var skill = question.skill.trim();
        //check if its a productive skill or a receptive skill
        if (skill === "reading" || skill === "listening") {
            question.question_type = 'multiple_choice_question';
        } else if (skill === "writing" || skill === "speaking") {
            question.question_type = 'essay_question';
        } else {
            question.err = "this question has a weird skill type";
        }

        return question;
    }

    var makeAnswers = (question) => {
        var answers;
        var skill = question.skill.trim();

        if (skill === "reading" || skill === "listening") {
            answers = [question.answertext1, question.answertext2, question.answertext3, question.answertext4]
                .map(answer => {
                    var hasStars = /^\*+/,
                        //check if its a correct answer
                        isCorrect = hasStars.test(answer);

                    //remove the stars at the start    
                    answer = answer.replace(hasStars, '');

                    //send back the answer obj
                    return {
                        answer_text: answer,
                        answer_weight: isCorrect ? '100' : '0'
                    }
                });
        } else {
            answers = null;
        }

        //set it 
        question.answers = answers;

        return question;
    }

    var addQuestionNumber = (question, i) => {
        //add the question number/position because we sorted before we can just use the i
        question.position = i;

        return question;
    }

    var toFinalCanvasSettings = (question) => {
        return {
            question_name: `passage${question.passageNumber}question${question.questionNumber}`,
            question_text: question.question_text,
            question_type: question.question_type,
            position: question.position,
            points_possible: 1,
            answers: question.answers
        };
    }

    return quizzes.map(quiz => {

        quiz.questions = quiz.questions
            .map(splitQuestionName)
            .sort(byPassageAndQuestion)
            .map(makeQuestionText)
            .map(addQuestionType)
            .map(makeAnswers)
            .map(addQuestionNumber)
            .map(toFinalCanvasSettings);

        return quiz;
    });
}