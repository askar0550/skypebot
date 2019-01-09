
const { CardFactory } = require('botbuilder'); // AttachmentLayoutTypes, ActivityTypes,
// card templates
var adpcd = require('./resource/card templates');
// functions
var ff = require('./resource/fs');
var dbfire = ff.dbfire;
var botcall = '!bot';

class MyBot {
    async onTurn(turnContext) {
        // vars
        var conact = turnContext.activity;
        const DBname = 'dbtest';
        const schemaName = 'con' + conact.conversation['id'].replace('|', '_').split('-').join('_');
        var hm = [];
        if (conact.text) {
            hm = conact.text.split(' ');
        };
        // console.log(hm);
        switch (true) {
        // first step
        case (conact.membersAdded && conact.membersAdded[0]['name'] === 'Bot'):
            await turnContext.sendActivity('My name is Mark');
            // create this conv schema
            await dbfire('createCS', [DBname, schemaName]);
            break;

        // return random or number question card; post question fired
        case hm[0] === botcall && (hm[1] === 'random' || (Number(hm[1]) > 0 && Number(hm[1]) < 301)):

            // check if random or number
            var qnumber;
            if (hm[1] === 'random') {
                qnumber = Math.floor(Math.random() * (300 - 1 + 1) + 1);
            } else {
                qnumber = hm[1];
            };

            // new question if not already
            const cardDetails = await dbfire('getQ', [qnumber, '', schemaName]);
            // console.log(cardDetails);
            if (Object.keys(cardDetails).length) {
                // Insert question was fired
                var invalueFiredQ =
                {
                    'convid': conact.conversation['id'],
                    'qid': qnumber,
                    'tmstamp': new Date(),
                    'schema': schemaName
                };
                var fqid = await dbfire('firedQ', invalueFiredQ);

                // add fired question id to query arguments
                invalueFiredQ['fqid'] = fqid;
                invalueFiredQ['theanswer'] = cardDetails['answer'];

                // Return question card
                await turnContext.sendActivity({
                    attachments: [
                        CardFactory.adaptiveCard(adpcd.triviablocA(cardDetails, fqid))
                    ]
                });
                // send response card after double wait
                await ff.waitForReturn(invalueFiredQ);

                // Return answer card
                const fqs = await dbfire('returnFQS', invalueFiredQ);
                fqs.push(invalueFiredQ['fqid']);
                await turnContext.sendActivity({
                    attachments: [
                        CardFactory.adaptiveCard(adpcd.triviablocB(fqs, cardDetails))
                    ]
                });
            } else {
                await turnContext.sendActivity('question already active!');
            }

            break;

        // insert user answer
        case (conact.value && conact.value.hasOwnProperty('rightResponse')):
            // console.log(conact.value);
            var numberifychoise = conact.value['thechoise'].split(',');
            for (var i = 0; i < numberifychoise.length; i++) {
                numberifychoise[i] = Number(numberifychoise[i]);
            };
            var invalueUserAnswer =
            {
                'schema': schemaName,
                'username': conact.from['name'],
                'userid': conact.from['id'],
                'qid': conact.value['questionnr'],
                'fqid': conact.value['fromQuestion'],
                'chvalues': conact.value['thechoise'].toString(),
                'rightResponse': conact.value['rightResponse'],
                'formatedchvalues': numberifychoise
            };
            await dbfire('firedA', invalueUserAnswer);
            break;

        // post question complaint
        case (conact.value && conact.value.hasOwnProperty('wrongQ')):
            var invalueComplaint =
                {
                    'convid': schemaName,
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
            console.log("");
        };
    }
};

module.exports.MyBot = MyBot;
