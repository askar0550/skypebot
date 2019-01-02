
exports.trivia = function (id, question, arrofans, rans, exp) {

  var formatPosAns = []
  for (var i = 0; i < arrofans.length; i++) {
    formatPosAns.push(
        {
          "type": "TextBlock",
          "horizontalAlignment": "Left",
          "spacing": "Small",
          "separator": true,
          // "height": "stretch",
          "size": "Medium",
          "text": i+1 +": " + arrofans[i],
          "wrap": true
        }
      )
  }

  var formatchoises = []
  for (var i = 0; i < arrofans.length; i++) {
    formatchoises.push(
      {
        "title": i + 1,
        "value": i+1
      }
      )
  }

  var multich = false;
  if (rans.length > 1) {
      multich = true
    }

//function activecards() {
  var theCard
  = {
    "type": "AdaptiveCard",
    "body": [
        {
          "type": "TextBlock",
          "text": "Question number: " + id
        },
        {
          "type": "TextBlock",
          "horizontalAlignment": "Left",
          "spacing": "Small",
          "separator": true,
          "height": "stretch",
          "size": "Medium",
          "weight": "Bolder",
          "color": "Dark",
          "text": question,
          "wrap": true
        },
        {
          "type": "ColumnSet",
          "separator": true,
          "columns": [
              {
                "type": "Column",
                "horizontalAlignment": "Left",
                "spacing": "Small",
                "separator": true,
                "height": "stretch",
                "style": "emphasis",
                "items": formatPosAns,
                "width": 85
              },
              {
                "type": "Column",
                "horizontalAlignment": "Left",
                "separator": true,
                "height": "stretch",
                "style": "emphasis",
                "items": [
                    {
                      "type": "Input.ChoiceSet",
                      "spacing": "Medium",
                      "separator": true,
                      "title": "Please pick",
                      "choices": formatchoises,
                      "style": "expanded",
                      "isMultiSelect": multich
                    }
                ],
                "width": 15
              }
          ]
        },
        //{
        //  "type": "Container",
        //  "items": [
        //      {
        //        "type": "TextBlock",
        //        "separator": true,
        //        "height": "stretch",
        //        "size": "Medium",
        //        "text": rans + ", " + exp,
        //        "isSubtle": true,
        //        "wrap": true
        //      }
        //  ]
        //}
    ],
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.0"
  }
  // console.log(theRest[0])
  // console.log(theCard)
  return theCard
}

//activecards()