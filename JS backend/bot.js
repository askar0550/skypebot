// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { AttachmentLayoutTypes, ActivityTypes, CardFactory } = require('botbuilder');
const { ChoicePrompt, DialogSet, DialogTurnStatus, ListStyle } = require('botbuilder-dialogs');
var test = require('./resource/app.js')
var adpcd = require('./resource/trivia.js')


class MyBot {
    /**
     *
     * @param {TurnContext} on turn context object.
     */

    

    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.

        if (turnContext.activity.type === ActivityTypes.Message) {
            var rannr = Math.floor(Math.random() * (300 - 1 + 1) + 1);

            await test.getQ(rannr)
                .then(async function (result) {
                    var arrqq = []
                    for (var key in result) {
                        if (key.length == 4) {
                            arrqq.push(result[key])
                        }
                    }

                    var idd = result['questionnr'];
                    var questionn = result['question'];
                    var resultt = result['answer']
                    if (result['explanation']) {
                        var exp = result['explanation']
                    } else {
                        var exp = ''
                    }

                    await turnContext.sendActivity({
                        attachments: [
                            CardFactory.adaptiveCard(adpcd.trivia(idd, questionn, arrqq, resultt, exp)),
                            
                        ]
                    })

                })
                .catch(function(error) {
                    console.error(error);
                });


            
        } else {
            await turnContext.sendActivity(`[${turnContext.activity.type} event detected]`);
            console.log('to say');
        }

        
        
    }
}


module.exports.MyBot = MyBot;
