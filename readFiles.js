/*eslint no-console:0 */

const d3 = require('d3-dsv');
const fs = require('fs');
const path = require('path');
const async = require('async');

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
            name: pathName,
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
            var split = fileName.split('_');
            var version = split[5].match(/\d/)[0];

            if (version === '1') {
                //make a name that has V2 in it not V1
                split[5] = 'V2';
                var v2Name = split.join('_');

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
        // Canvas quiz settings
        quiz.canvasSettings = {
            'title': quiz.name,
            'quiz_type': 'assignment',
            'allowed_attempts': -1,
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

    return quizzes.map(quiz => {

        quiz.questions = quiz.questions
            .map(splitQuestionName)
            .sort(byPassageAndQuestion);

        return quiz;
    });
}