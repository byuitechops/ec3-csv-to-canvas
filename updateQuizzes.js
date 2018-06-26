// // Listening
// const quizIds = [149714, 149717, 149718, 149719, 149720, 149721, 149722, 149723, 149724, 149725, 149726, 149727, 149728, 149729, 149730, 149731, 149732,
//     149733, 149734, 149735, 149736, 149737, 149738, 149739, 149740, 149741, 149742, 149743, 149744, 149745, 149746, 149747, 149748, 149749, 149750, 149751,
//     149752, 149753, 149754, 149755, 149756, 149757, 149758, 149759, 149760, 149761, 149762, 149763, 149764, 149765, 149766, 149767, 149768, 149769, 149770,
//     149771, 149772, 149773, 149774, 149775, 149776, 149777, 149778, 149779, 149780, 149781, 149782, 149783, 149784, 149785, 149786, 149787, 149788, 149789,
//     149790, 149791, 149792, 149793, 149794, 150678, 150679, 150680, 150681, 150682
// ];
// Reading
// const quizIds = [149795, 149796, 149797, 149798, 149799, 149800, 149801, 149802, 149803, 149804, 149805, 149806, 149807, 149808, 149809, 149810, 149811, 149812, 149813,
//     149814, 149815, 149816, 149817, 149818, 149819, 149820, 149821, 149822, 149823, 149824, 149825, 149826, 149827, 149828, 149829, 149830, 149831, 149832, 149833, 149834,
//     149835, 149836, 149837, 149838, 149839, 149840, 149841, 149842, 149843, 149844, 149845, 149846, 149847, 149848, 149849, 149850, 149851, 149852, 149853, 149854, 149855,
//     149856, 149857, 149858, 149859, 149860, 149861, 149862, 149863, 149864, 149865, 149866, 149867, 149868, 149869, 149894, 149895, 149896, 149897, 149898, 149899, 149900,
//     149901, 149902, 149903, 149904, 149905, 149906, 149907, 149908, 149909, 149910, 149911, 149912, 149913, 149914, 149915, 149916, 149917, 149918, 149919, 149920, 149921,
//     149922, 149923, 149924, 149925, 149926, 149927, 149928, 149929, 149930, 149955, 149956, 149957, 149958, 149959, 149970, 149985, 149986, 149987, 149988, 149989, 149990,
//     149997, 150016, 150038, 150042, 150043, 150044, 150045, 150046, 150047, 150048, 150073, 150074, 150075, 150082, 150101, 150102, 150103, 150104, 150105, 150130, 150131,
//     150147, 150157, 150158, 150159, 150184, 150185, 150186, 150187, 150189, 150213, 150214, 150215, 150216, 150217, 150242, 150243, 150244, 150245, 150246, 150247, 150248,
//     150249, 150274, 150275, 150276, 150277, 150278, 150279, 150280, 150281, 150282, 150283, 150284, 150285, 150683, 150684, 150685, 150686, 150687, 150689, 150690, 150691,
//     150692, 150693, 150694, 150695, 150696, 150697, 150698, 150699, 150700, 150701, 150703, 150704, 150705, 150706
// ];
// // Speaking
// const quizIds = [150286, 150288, 150302, 150313, 150314, 150315, 150316, 150317, 150318, 150319, 150320, 150321, 150322, 150325, 150337, 150349, 150350, 150351, 150352,
//     150353, 150355, 150356, 150358, 150381, 150383, 150384, 150385, 150386, 150387, 150388, 150389, 150390, 150391, 150392, 150393, 150406, 150418, 150420, 150421, 150422,
//     150423, 150424, 150425, 150426, 150427, 150428, 150429, 150430, 150431, 150432, 150433, 150434, 150435, 150436, 150437, 150438, 150439, 150440, 150441, 150442, 150443, 150444,
//     150445, 150446, 150447, 150461, 150473, 150474, 150475, 150476, 150477, 150707, 150708, 150709, 150710, 150711, 150712, 150713, 150714, 150715, 150716, 150717, 150718, 150719,
//     150720
// ];
// // Writing
const quizIds = [150478, 150479, 150480, 150481, 150482, 150483, 150484, 150485, 150487, 150488, 150489, 150490, 150491, 150492, 150493, 150494, 150495, 150496, 150497,
    150498, 150499, 150500, 150501, 150502, 150503, 150504, 150505, 150506, 150507, 150508, 150509, 150526, 150535, 150536, 150537, 150538, 150539, 150540, 150541, 150542,
    150543, 150544, 150545, 150546, 150547, 150548, 150549, 150550, 150551, 150552, 150553, 150554, 150555, 150556, 150557, 150558, 150560, 150561, 150562, 150563, 150564, 150565,
    150566, 150567, 150568, 150569, 150570, 150571, 150572, 150573, 150574, 150575, 150576, 150577, 150578, 150579, 150580, 150581, 150582, 150583, 150584, 150585, 150586, 150587,
    150588, 150589, 150590, 150591, 150592, 150593, 150594, 150595, 150596, 150597, 150598, 150599, 150600, 150601, 150602, 150603, 150604, 150605, 150606, 150607, 150608,
    150609, 150610, 150611, 150612, 150613, 150614, 150615, 150616, 150617, 150618, 150619, 150620, 150621, 150622, 150623, 150624, 150625, 150626, 150627, 150628, 150629,
    150630, 150631, 150632, 150633, 150634, 150635, 150636, 150637, 150638, 150639, 150640, 150641, 150642, 150643, 150644, 150645, 150646, 150647, 150648, 150649, 150650, 150651,
    150652, 150653, 150654, 150655, 150656, 150657, 150658, 150659, 150660, 150661, 150662, 150663, 150664, 150665, 150666, 150667, 150668, 150669, 150670, 150671, 150672,
    150673, 150674, 150675, 150676, 150677, 150721, 150722, 150723, 150724, 150725, 150726, 150727, 150728, 150729, 150730, 150731, 150732, 150733, 150734, 150735, 150736,
    150737, 150738, 150739, 150740, 150741
];

const others = [149710, 149711, 149713, 149712, 149708, 149709, 149715, 149716];

//const courseId = 10956; //listen
// const courseId = 10952; //read
// const courseId = 10957; //speak
// const courseId = 10955; //write


// const puppeteer = require('puppeteer');
// const auth = require('./auth')
// const USERNAME_FIELD = '#pseudonym_session_unique_id'
// const PASSWORD_FIELD = '#pseudonym_session_password'
// const LOGIN_BUTTON = '#login_form .Button--login'

// async function login(page) {
//     //let auth = await promptCreds()
//     await page.goto('https://byui.instructure.com/login/canvas')
//     await page.type(USERNAME_FIELD, auth.username)
//     await page.type(PASSWORD_FIELD, auth.password)
//     await Promise.all([
//         page.waitForNavigation(),
//         page.click(LOGIN_BUTTON, '#login_form .Button--login')
//     ])
//     var currentPath = await page.evaluate('window.location.pathname')
//     if (currentPath == '/login/canvas') {
//         await login(page)
//     }
// }

// (async () => {
//     const browser = await puppeteer.launch({
//         headless: false
//     });
//     const page = await browser.newPage();
//     await login(page);

//     for (var i = 0; i < quizIds.length; i++) {
//         await page.goto(`https://byui.instructure.com/courses/${courseId}/quizzes/${quizIds[i]}`);
//         await page.click('.edit_quizzes_quiz [type=submit]');
//     }
//     await browser.close();
// })();














/* Only used to get list of quiz ids */

//getIds();

function getIds() {
    const canvasApi = require('canvas-api-wrapper');
    //const courses = [10956, 10951, 10952, 10957, 10955];
    const courses = [10955];
    courses.forEach(async (course) => {
        const canvasCourse = canvasApi.getCourse(course);
        await canvasCourse.quizzes.get();
        //canvasCourse.quizzes.forEach(quiz => quiz.delete());
        canvasCourse.quizzes.forEach(quiz => {
            console.log(quiz.getId());
        });
    });
}