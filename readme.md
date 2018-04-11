
## Object Definitions

### Question Objects
| Key             | Type     | Value                                                            |
|---------------- |----------|------------------------------------------------------------------|
| question_name   | string   | passage#question#                                                |
| question_text   | string   | joined with the passage if it’s the first q or just the question, also remove the link tags |
| question_type   | string   | essay_question,  multiple_choice_question                        |
| position        | integer  | not sure if it's 0 based or not                                  |
| points_possible | integer  | hard coded to 1                                                  |
| answers         | [Answer] | for MC questions, an array of answer objects, see below          |

### Answer Objects
| Key           | Type     | Value                     |
|---------------|----------|---------------------------|
| answer_text   | string   | html string of answer, remove the stars at the start |
| answer_weight | string   | 100 if correct 0 if wrong, the correct ones have stars at the start |
