
// main question card
exports.triviablocA = function(arrayy, fqid) {
    var id = arrayy['id'];
    var question = arrayy['question'];
    var answers = arrayy['panswers'];
    var result = arrayy['answer'];
    var exp = arrayy['explanation'];
    var formatPosAns = [];
    var formatchoises = [];

    // is multichoise?
    var multich = false;
    if (result.length > 1) {
        multich = true;
    };

    // multiple possible answers
    for (var i = 0; i < answers.length; i++) {
        formatPosAns.push(
            {
                'type': 'TextBlock',
                'horizontalAlignment': 'Left',
                'spacing': 'Small',
                'separator': true,
                'size': 'Medium',
                'text': i + 1 + ': ' + answers[i],
                'wrap': true,
                'id': (i + 1).toString()
            });
    };

    // multichoise template
    for (var j = 0; j < answers.length; j++) {
        formatchoises.push(
            {
                'title': (j + 1).toString(),
                'value': (j + 1).toString()
            });
    };

    // the adaptive card template
    var theCard =
    {
        '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
        'version': '1.0',
        'type': 'AdaptiveCard',
        'body': [
            {
                'type': 'TextBlock',
                'text': 'Question number: ' + id
            },
            {
                'type': 'TextBlock',
                'horizontalAlignment': 'Left',
                'spacing': 'Small',
                'separator': true,
                'height': 'stretch',
                'size': 'Medium',
                'weight': 'Bolder',
                'color': 'Accent',
                'text': question,
                'wrap': true
            },
            {
                'type': 'ColumnSet',
                'separator': true,
                'columns': [
                    {
                        'type': 'Column',
                        'id': 'leftc',
                        'horizontalAlignment': 'Left',
                        'spacing': 'Small',
                        'separator': true,
                        'height': 'stretch',
                        'style': 'emphasis',
                        'items': formatPosAns,
                        'width': 85
                    },
                    {
                        'type': 'Column',
                        'id': 'rightc',
                        'horizontalAlignment': 'Left',
                        'separator': true,
                        'height': 'stretch',
                        'style': 'emphasis',
                        'items': [
                            {
                                'type': 'Input.ChoiceSet',
                                'id': 'thechoise',
                                'spacing': 'Large',
                                'separator': true,
                                'placeholder': 'Placeholder text',
                                'choices': formatchoises,
                                'style': 'expanded',
                                'isMultiSelect': multich
                            }
                        ],
                        'width': 15
                    }
                ]
            }
        ],
        'actions': [
            {
                'type': 'Action.Submit',
                'title': 'Submit Answer',
                'data':
                {
                    'rightResponse': result,
                    'explanation': exp,
                    'questionnr': id,
                    'fromQuestion': fqid
                }
            }
        ]
    };
    return theCard;
};

// response card
exports.triviablocB = function(arrayy) {
    var slcted = arrayy['thechoise'].split(',');
    var answer = arrayy['rightResponse'];
    var qnumber = arrayy['questionnr'];
    var explanation = arrayy['explanation'];
    var origquestion = arrayy['fromQuestion'];

    // the adaptive card template
    var theCard =
    {
        '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
        'version': '1.0',
        'type': 'AdaptiveCard',
        'body': [
            {
                'type': 'TextBlock',
                'text': 'Question number: ' + qnumber
            },
            {
                'type': 'TextBlock',
                'text': 'Your answer was: ' + slcted.join(' and ')
            },
            {
                'type': 'TextBlock',
                'text': 'The right answer is:  ' + answer.join(' and ')
            },
            {
                'type': 'TextBlock',
                'text': explanation,
                'wrap': true
            }
        ],
        'actions': [
            {
                'type': 'Action.ShowCard',
                'title': 'Mark as wrong',
                'card': {
                    'type': 'AdaptiveCard',
                    'style': 'emphasis',
                    'body': [
                        {
                            'type': 'Input.Text',
                            'id': 'wrongQ',
                            'placeholder': 'Add a comment',
                            'isMultiline': true
                        }
                    ],
                    'actions': [
                        {
                            'type': 'Action.Submit',
                            'title': 'Submit',
                            'data': {
                                'qid': qnumber,
                                'fqid': origquestion
                            }
                        }
                    ],
                    '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json'
                }
            }
        ]
    };
    return theCard;
};
