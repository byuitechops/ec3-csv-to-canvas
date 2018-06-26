/*eslint no-console:0 */

const Prompt = require('prompt-checkbox');
const makeQuizzes = require('./refact.js');

var prompt = new Prompt({
    name: 'Courses',
    message: 'Which courses would you like to run on?',
    choices: [
        '10957',
        '10956',
        '10952',
        '10955'
    ]
});

prompt.run()
    .then((res) => {
        makeQuizzes(res);
    })
    .catch(err => console.log(err));

// prompt.ask(answers => console.log(answers));