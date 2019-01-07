
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
exports.triviablocB = function(x, cardDetails) {
    console.log(x);
    var slcted = x[0];
    var gir = x[1];
    var answer = cardDetails['answer'];
    var qnumber = cardDetails['questionnr'];
    var explanation = cardDetails['explanation'];
    var origquestion = cardDetails['question'];
    var answers = cardDetails['panswers'];
    var formatPosAns = [];
    var ratio = 0;
    if (x[2]['ansokcounter'] !== 0) {
        ratio = ((x[2]['ansokcounter'] * 100) / (x[2]['firedcounter'] - x[2]['anstoutcounter']));
        ratio = Number.parseFloat(ratio).toFixed(2);
    };

    // multiple possible answers
    for (var i = 0; i < answers.length; i++) {
        formatPosAns.push(
            {
                'type': 'TextBlock',
                'horizontalAlignment': 'Left',
                'spacing': 'Small',
                'separator': true,
                'size': 'Small',
                'color': 'Attention',
                'text': i + 1 + ': ' + answers[i],
                'wrap': true
            });
        if (answer.includes(i + 1)) {
            formatPosAns[i]['color'] = 'Good';
            formatPosAns[i]['size'] = 'Medium';
        };
    };

    if (explanation !== '') {
        formatPosAns.push(
            {
                'type': 'TextBlock',
                'horizontalAlignment': 'Left',
                'spacing': 'Small',
                'separator': true,
                'size': 'Small',
                'color': 'Default',
                'text': explanation,
                'wrap': true
            });
    }

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
                'horizontalAlignment': 'Left',
                'spacing': 'Small',
                'separator': true,
                'height': 'stretch',
                'size': 'Default',
                'weight': 'Bolder',
                'color': 'Accent',
                'text': origquestion,
                'wrap': true
            },
            {
                'type': 'ColumnSet',
                'separator': true,
                'columns': [
                    {
                        'type': 'Column',
                        'horizontalAlignment': 'Left',
                        'spacing': 'Small',
                        'separator': true,
                        'height': 'stretch',
                        'style': 'emphasis',
                        'items': formatPosAns,
                        'width': 82
                    },
                    {
                        'type': 'Column',
                        'horizontalAlignment': 'Left',
                        'spacing': 'Small',
                        'separator': true,
                        'height': 'stretch',
                        'style': 'emphasis',
                        'items': [
                            {
                                'type': 'TextBlock',
                                'horizontalAlignment': 'Center',
                                'spacing': 'Small',
                                'separator': true,
                                'size': 'Small',
                                'color': 'Accent',
                                'text': slcted.toString(),
                                'wrap': true
                            },
                            {
                                'type': 'TextBlock',
                                'horizontalAlignment': 'Center',
                                'spacing': 'Small',
                                'size': 'Small',
                                'color': 'Dark',
                                'text': 'Users answered',
                                'wrap': true
                            },
                            {
                                'type': 'TextBlock',
                                'horizontalAlignment': 'Center',
                                'spacing': 'Small',
                                'separator': true,
                                'size': 'Small',
                                'color': 'Accent',
                                'text': gir.toString(),
                                'wrap': true
                            },
                            {
                                'type': 'TextBlock',
                                'horizontalAlignment': 'Center',
                                'spacing': 'Small',
                                'size': 'Small',
                                'color': 'Dark',
                                'text': 'Got it right',
                                'wrap': true
                            },
                            {
                                'type': 'TextBlock',
                                'horizontalAlignment': 'Center',
                                'spacing': 'Medium',
                                'separator': true,
                                'size': 'Small',
                                'color': 'Accent',
                                'text': ratio.toString() + '%',
                                'wrap': true
                            },
                            {
                                'type': 'TextBlock',
                                'horizontalAlignment': 'Center',
                                'spacing': 'Small',
                                'size': 'Small',
                                'color': 'Dark',
                                'text': 'Overall ratio',
                                'wrap': true
                            }
                        ],
                        'width': 18
                    }
                ]
            }
        ]
    };
    return theCard;
};
