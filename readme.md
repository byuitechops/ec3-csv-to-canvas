
## Object Definitions

### Quiz Object

| Key                | Type       | Value                                           |
|--------------------|------------|-------------------------------------------------|
| name               | string     | The csv file no ".csv"                          |
| questions          | [Question] | array of Questions see below                    |
| courseId           | integer    | the canvas course to make the quizzes in        |
| canvasSettings     | string     | see below                                       |
| Eventually: quizId | string     | this is set after the quiz is make with the api |



### Quiz.canvasSettings Object

| Key                               | Type     | Value                     |
|-----------------------------------|----------|---------------------------|
| title                             | string   | The csv file no ".csv"    |
| quiz_type                         | string   | set to: "assignment"      |
| allowed_attempts                  | integer  | set to: -1                |
| scoring_policy                    | string   | set to: "keep_latest"     |
| hide_results                      | string   | if FP:null if PC:"always" |
| published                         | boolean  | set to: true              |
| **Defauts that are used**         |          |                           |
| description                       | string   | Default: not set          |
| assignment_group_id               | integer  | Default: not set          |
| shuffle_answers                   | boolean  | Default: false            |
| show_correct_answers              | boolean  | Default: true             |
| show_correct_answers_last_attempt | boolean  | Default: false            |
| show_correct_answers_at           | DateTime | Default: not set          |
| hide_correct_answers_at           | DateTime | Default: not set          |
| one_question_at_a_time            | boolean  | Default: false            |
| cant_go_back                      | boolean  | Default: false            |
| access_code                       | string   | Default: null             |
| ip_filter                         | string   | Default: null             |
| hide_results                      | string   | Default: null             |
| due_at                            | DateTime | Default: not set          |
| lock_at                           | DateTime | Default: not set          |
| unlock_at                         | DateTime | Default: not set          |
| one_time_results                  | boolean  | Default: false            |
| only_visible_to_overrides         | boolean  | Default: false            |

### Question Objects
| Key             | Type     | Value                                                                                       |
|---------------- |----------|---------------------------------------------------------------------------------------------|
| question_name   | string   | passage#question#                                                                           |
| question_text   | string   | joined with the passage if it’s the first q or just the question, also remove the link tags |
| question_type   | string   | essay_question,  multiple_choice_question                                                   |
| position        | integer  | not sure if it's 0 based or not                                                             |
| points_possible | integer  | hard coded to 1                                                                             |
| answers         | [Answer] | for MC questions, an array of answer objects, see below                                     |
| Eventually: id    | integer  | this is set after the api call is made to make it in canvas                               |

### Answer Objects
| Key           | Type     | Value                     |
|---------------|----------|---------------------------|
| answer_text   | string   | html string of answer, remove the stars at the start |
| answer_weight | string   | 100 if correct 0 if wrong, the correct ones have stars at the start |
