const canvasApi = require('canvas-api-wrapper');

//const courses = [10956, 10951, 10952, 10957, 10955];
const courses = [10957];

courses.forEach(async course => {
    const canvasCourse = canvasApi.getCourse(course);
    await canvasCourse.quizzes.get();
    canvasCourse.quizzes.forEach(quiz => quiz.delete());
});