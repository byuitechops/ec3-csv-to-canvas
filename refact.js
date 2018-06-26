const d3 = require('d3-dsv');
const fs = require('fs');
const path = require('path');
const asyncLib = require('async');
const cheerio = require('cheerio');
const canvasApi = require('canvas-api-wrapper');
canvasApi.oncall = e => console.log(e.method, e.url)

const folderPath = path.resolve('../CSV');
let courses

function filterFiles(items) {
  return items
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
        //if there is a v2name in the filenames list don't keep v1
        return !fileNames.includes(v2Name);
      }
      //keep everything else
      return true;
    });
}

/* Reads the file contents and sets the name to the filename */
function readfile(pathName) {
  return new Promise((res, rej) => {
    fs.readFile(path.join(folderPath, pathName), 'utf8', (err, data) => {
      if (err) {
        rej(err);
        return;
      }
      // Send data back to map
      res({
        name: path.parse(pathName).name,
        questions: data
      });
    });
  });
}

function formatQuizzes(quizzes) {
  return quizzes
    /* Add course ids */
    .map(quiz => {
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
    })
    /* Add Canvas Settings */
    .map(quiz => {
      var hideResults, quizType = quiz.name.slice(0, 2);
      if (quizType === 'FP') {
        hideResults = null;
      } else if (quizType === 'PC') {
        hideResults = 'always';
      } else {
        quiz.err = 'this quiz does not have FP or PC';
      }
      // Canvas quiz settings
      quiz.canvasSettings = {
        'scoring_policy': 'keep_latest',
        quiz: {
          'title': quiz.name,
          'quiz_type': 'assignment',
          'allowed_attempts': -1,
          'scoring_policy': 'keep_latest',
          'hide_results': hideResults,
          'published': true
        }
      };
      return quiz;
    })
}

function splitQuestionName(question) {
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

function makeQuestionText(question) {
  //make the prop
  var questionText = '';

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
};

function makeAnswers(question) {
  var answers;
  var skill = question.skill.trim();

  if (skill === 'reading' || skill === 'listening') {
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
        };
      });
  } else {
    answers = null;
  }

  //set it 
  question.answers = answers;

  return question;
};

function fixQuestionData(quiz) {
  quiz.questions = quiz.questions
    .map(question => splitQuestionName(question))
    /* By Passage and Question */
    .sort((qA, qB) => {
      var getSortNum = q => q.passageNumber * 100 + q.questionNumber;
      var sortNumA = getSortNum(qA);
      var sortNumB = getSortNum(qB);

      return sortNumA - sortNumB;
    })
    .map((question, i) => {
      question = makeQuestionText(question)
      question = addQuestionType(question)
      question = makeAnswers(question)
      return {
        question: {
          question_name: `passage${question.passageNumber}question${question.questionNumber}`,
          question_text: question.question_text,
          question_type: question.question_type,
          position: i,
          points_possible: 1,
          answers: question.answers
        }
      }
    })
}

async function createQuiz(quiz) {
  try {
    let course = canvasApi.getCourse(quiz.courseId)
    let newQuiz = await course.quizzes.create(quiz.canvasSettings)
    quiz.id = newQuiz.getId()
    quiz.scoring_policyThing = newQuiz.scoring_policy;
    for (var i = 0; i < quiz.questions; i++) {
      let newQuestion = await newQuiz.questions.create(question[i]);
      console.log('created ', newQuestion.getTitle())
    }
  } catch (e) {
    console.log(quiz.name, 'failed')
  }
}

module.exports = async function main(res) {
  courses = res
  var fileNames = fs.readdirSync(folderPath, 'utf8')
  fileNames = filterFiles(fileNames)
  var quizzes = await Promise.all(fileNames.map(fileName => readfile(fileName)))
  quizzes = formatQuizzes(quizzes)
  quizzes = quizzes.map(quiz => fixQuestionData(quiz))
  await Promise.all(quizzes.map(quiz => createQuiz(quiz)))
}