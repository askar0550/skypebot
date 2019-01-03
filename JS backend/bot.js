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
            break;
        case (conact.hasOwnProperty('value') && conact.value.hasOwnProperty('rightResponse')):
            await turnContext.sendActivity({
                attachments: [
                    CardFactory.adaptiveCard(adpcd.triviablocB(conact.value))
                ]
            });
            break;
        case (conact.hasOwnProperty('value') && conact.value.hasOwnProperty('wrongQ')):
            await turnContext.sendActivity(`Thank you for your feedback!`);
            break;

        default:
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        };
    }
}

module.exports.MyBot = MyBot;
