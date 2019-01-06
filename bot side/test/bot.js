
const { CardFactory } = require('botbuilder'); // AttachmentLayoutTypes, ActivityTypes,
var test = require('./resource/app.js');
var adpcd = require('./resource/trivia.js');

class MyBot {
    async onTurn(turnContext) {
        var conact = turnContext.activity;

        switch (true) {
            // first step
            case (conact.membersAdded && conact.membersAdded[0]['name'] === 'Bot'):
                await turnContext.sendActivity('My name is Mark');
                break;

            // return random or number question card; post question fired
            case conact.text === 'random' || (Number(conact.text) > 0 && Number(conact.text) < 301):

                // check if random or number
                var qnumber;
                if (conact.text === 'random') {
                    qnumber = Math.floor(Math.random() * (300 - 1 + 1) + 1);
                } else {
                    qnumber = conact.text;
                };

                // new question if not already 
                const cardDetails = await dbfire('getQ', [qnumber, '']);
                if (Object.keys(cardDetails).length) {

                    // Insert question was fired
                    var invalueFiredQ =
                    {
                        'convid': conact.conversation['id'],
                        'qid': qnumber,
                        'tmstamp': new Date()
                    };
                    var fqid = await dbfire('firedQ', invalueFiredQ);

                    // add fired question id to query arguments
                    invalueFiredQ['fqid'] = fqid;

                    // Return question card
                    await turnContext.sendActivity({
                        attachments: [
                            CardFactory.adaptiveCard(adpcd.triviablocA(cardDetails, fqid))
                        ]
                    });
                    // send response card after double wait
                    // await waitForReturn(invalueFiredQ);
                    // console.log(cardDetails);
                    const test2 = await x(invalueFiredQ);
                    if (test2 != '') {
                        // Return answer card
                        await turnContext.sendActivity({
                            attachments: [
                                CardFactory.adaptiveCard(adpcd.triviablocB(test2, cardDetails))
                            ]
                        });
                    }
                } else {
                    await turnContext.sendActivity('question already active!');
                }

                break;

            // insert user answer
                case (conact.value && conact.value.hasOwnProperty('rightResponse')):
                var invalueUserAnswer =
                {
                    'convid': conact.conversation['id'],
                    'username': conact.from['name'],
                    'userid': conact.from['id'],
                    'qid': conact.value['questionnr'],
                    'fqid': conact.value['fromQuestion'],
                    'chvalues': conact.value['thechoise'].toString()
                };
                await dbfire('firedA', invalueUserAnswer);
                break;

            // post question complaint
                case (conact.value && conact.value.hasOwnProperty('wrongQ')):
                var invalueComplaint =
                    {
                        'convid': conact.conversation['id'],
                        'username': conact.from['name'],
                        'userid': conact.from['id'],
                        'tmstamp': new Date(),
                        'qid': conact.value['qid'],
                        'complaint': 'Fired Question: ' + conact.value['fqid'] + '; Message: ' + conact.value['wrongQ']
                    };
                var resultingUser = await dbfire('postC', invalueComplaint);

                // bot reply OK
                await turnContext.sendActivity('Thank you ' + resultingUser + ' for your feedback!');
                break;
            // here will be the help function
            default:
                await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        };
    }
};

// wait function for the response card
async function waitForReturn(x) {
    awaitingTime = 6000;  // <= set a/w time
    setTimeout(async function() {
        var chresult = await dbfire('returnQC', x['fqid'] );
        if (chresult.rows[0]['complete']) {
            return x; // console.log('1');
        } else {
            console.log('re await!!!!!!!!!!');
            setTimeout(async function () {
                var chresult = await dbfire('returnQC', x['fqid'] );
                if (chresult.rows[0]['complete']) {
                    return x; // console.log('2');
                } else {
                    await dbfire('completeQ', x['fqid']);
                    console.log('question ' + x['qid'] + ' has been closed');
                    return ''; //console.log('3');
                };
            }, awaitingTime);
        };
    }, awaitingTime);
};

//test timeout
async function x(x) {
    awaitingTime = 6000;  // <= set a/w time
    var promise1 = new Promise(function (resolve, _) {
        setTimeout(async function () {
            var chresult = await dbfire('returnQC', x['fqid']);
            if (chresult.rows[0]['complete']) {
                resolve(x); // console.log('1');
            } else {
                console.log('re await!!!!!!!!!!');
                var promise2 = new Promise(function (resolve, _) {
                    setTimeout(async function () {
                        var chresult = await dbfire('returnQC', x['fqid']);
                        if (chresult.rows[0]['complete']) {
                            resolve(x); // console.log('2');
                        } else {
                            await dbfire('completeQ', x['fqid']);
                            console.log('question ' + x['qid'] + ' has been closed');
                            resolve(''); //console.log('3');
                        };
                    }, awaitingTime);
                });
                resolve(promise2);
            };
        }, awaitingTime);
    });
    return promise1;
}

// show response card B or G
async function showcard(turnContext, x) {
    console.log('waiting is done, here\'s the response ');
    //console.log(turnContext);
    //await turnContext.sendActivity({
    //    attachments: [
    //        CardFactory.adaptiveCard(adpcd.triviablocB(x))
    //    ]
    //});
}

// database functions
async function dbfire(f, x) {
    var rresult;
    var ff;

    // case function -ugly but better than eval
    switch (f) {
        case 'getQ': ff = test.getQ(x); break;
        case 'firedQ': ff = test.firedQ(x); break;
        case 'postC': ff = test.postC(x); break;
        case 'firedA': ff = test.firedA(x); break;
        case 'returnQC': ff = test.returnQC(x); break; 
        case 'completeQ': ff = test.completeQ(x); break;
        default: console.log('Not a function!');
    };

    // actual function -uses promise
    await ff
        .then(async function(result) {
            rresult = result;
        })
        .catch(function(error) {
            console.error(error);
        });
    return rresult;
};

module.exports.MyBot = MyBot;
