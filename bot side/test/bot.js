// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { AttachmentLayoutTypes, ActivityTypes, CardFactory } = require('botbuilder');
// const { ChoicePrompt, DialogSet, DialogTurnStatus, ListStyle } = require('botbuilder-dialogs');
var test = require('./resource/app.js');
var adpcd = require('./resource/trivia.js');
// var sammple = require('./resource/simple_sample.json');

class MyBot {
    /**
     *
     * @param {TurnContext} on turn context object.
     */
	
    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        // if (turnContext.activity.type === ActivityTypes.Message) {
        var conact = turnContext.activity;
        // console.log(turnContext.activity);
        switch (true) {
        case conact.text === 'random':
            var rannr = Math.floor(Math.random() * (300 - 1 + 1) + 1);
            await test.getQ(rannr) // 201
                .then(async function(result) {
                    // console.log(CardFactory.adaptiveCard(adpcd.trivia(result)));
                    await turnContext.sendActivity({
                        attachments: [
                            CardFactory.adaptiveCard(adpcd.triviablocA(result))
                        ]
                    });
                })
                .catch(function(error) {
                    console.error(error);
                });
            break;
        case (Number(conact.text) > 0 && Number(conact.text) < 301):
            await test.getQ(conact.text) // 201
                .then(async function(result) {
                    // console.log(CardFactory.adaptiveCard(adpcd.trivia(result)));
                    await turnContext.sendActivity({
                        attachments: [
                            CardFactory.adaptiveCard(adpcd.triviablocA(result))
                        ]
                    });
                })
                .catch(function(error) {
                    console.error(error);
                });
            // console.log(turnContext.sendActivity);
            break;
        case (conact.hasOwnProperty('value') && conact.value.hasOwnProperty('rightResponse')):
            // console.log(conact);
            await turnContext.sendActivity({
                attachments: [
                    CardFactory.adaptiveCard(adpcd.triviablocB(conact.value))
                ]
            });
            break;
        case (conact.hasOwnProperty('value') && conact.value.hasOwnProperty('wrongQ')):
            var invalue =
                {
                    'convid': conact.conversation['id'],
                    'username': conact.from['name'],
                    'userid': conact.from['id'],
                    'tmstamp': test.getDateTime(), // (new Date()).toISOString().slice(0, 10).replace(/-/g, ''),
                    'qid': conact.value['qid'],
                    'complaint': conact.value['wrongQ']
                };
            // console.log(invalue);
            await test.postC(invalue)
                .then(async function(result) {
                    // console.log(result);
                    await turnContext.sendActivity('Thank you ' + result + ' for your feedback!');
                    
                })
                .catch(function(error) {
                    console.error(error.stack);
                });
            
            break;

        default:
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        };
    }
}

module.exports.MyBot = MyBot;
