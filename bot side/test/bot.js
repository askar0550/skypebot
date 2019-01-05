
const { CardFactory } = require('botbuilder'); // AttachmentLayoutTypes, ActivityTypes,
var test = require('./resource/app.js');
var adpcd = require('./resource/trivia.js');

class MyBot {
    async onTurn(turnContext) {
        var conact = turnContext.activity;
        // console.log(conact);

        switch (true) {
            ///first step
            case (conact.membersAdded && conact.membersAdded[0]['name'] === 'Bot'):
                await turnContext.sendActivity('My name is Mark');
                break;

            /// return random or number question card; post question fired
            case conact.text === 'random' || (Number(conact.text) > 0 && Number(conact.text) < 301):

                // check if random or number
                var qnumber;
                if (conact.text === 'random') {
                    qnumber = Math.floor(Math.random() * (300 - 1 + 1) + 1);
                } else {
                    qnumber = conact.text;
                };

                // Insert question was fired
                var invalueFiredQ =
                {
                    'convid': conact.conversation['id'],
                    'qid': qnumber,
                    'tmstamp': new Date()
                };
                var fqid = await dbfire('firedQ', invalueFiredQ);

                // Return question card
                await turnContext.sendActivity({
                    attachments: [
                        CardFactory.adaptiveCard(adpcd.triviablocA(await dbfire('getQ', qnumber), fqid))
                    ]
                });
                /*
                /////// HERE TO ADD AWAIT FUNCTION TO RETURN THE ANSWERS IF EXISTS
                ////// ELSE WAIT MORE
                */
                waitForReturn(invalueFiredQ);
                break;

            /// insert user answer
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

            /// post question complaint
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
    awaitingTime = 6000;
    setTimeout(async function() {
        var chresult = await checkcompletion(x)
        console.log(chresult);
        if (chresult) {
            showcard(1);
        } else {
            setTimeout(async function () {
                var chresult = await checkcompletion(x)
                if (chresult) {
                    showcard(2);
                } else {
                    console.log('question has been closed')
                };
            }, awaitingTime);
        };
    }, awaitingTime);
};

// show response B or R
function showcard(x) {
    console.log('waiting is done, here\'s the response ' + x)
}

async function checkcompletion(x) {
    var isQcomplete = await dbfire('returnAC', x);
    return isQcomplete.rows[0]['complete'];
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
        case 'returnAC': ff = test.returnAC(x); break;
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
