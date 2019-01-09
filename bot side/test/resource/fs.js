// db actions
var dbq = require('./db.js');

exports.dbfire = async function(f, x) {
    var rresult;
    var ff;

    // case function -ugly but better than eval
    switch (f) {
    case 'getQ': ff = dbq.getQ(x); break;
    case 'firedQ': ff = dbq.firedQ(x); break;
    case 'postC': ff = dbq.postC(x); break;
    case 'firedA': ff = dbq.firedA(x); break;
    case 'returnQC': ff = dbq.returnQC(x); break;
    case 'completeQ': ff = dbq.completeQ(x); break;
    case 'returnFQS': ff = dbq.returnFQS(x); break;
    case 'createCS': ff = dbq.createCS(x); break;
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

// wait function for the response card
exports.waitForReturn = async function(x) {
    var awaitingTime = 6000; // <= set a/w time
    var promise1 = new Promise(function(resolve, reject) {
        setTimeout(async function() {
            var chresult = await exports.dbfire('returnQC', [x['schema'], x['fqid']]);
            if (chresult.rows && chresult.rows[0]['complete']) {
                resolve(x); // console.log('1');
            } else {
                console.log('re await!!!!!!!!!!');
                var promise2 = new Promise(function(resolve, reject) {
                    setTimeout(async function() {
                        var chresult = await exports.dbfire('returnQC', [x['schema'], x['fqid']]);
                        if (chresult.rows && chresult.rows[0]['complete']) {
                            resolve(x); // console.log('2');
                        } else {
                            await exports.dbfire('completeQ', [x['schema'], x['fqid'], 'timeout', x['qid']]);
                            console.log('question ' + x['qid'] + ' has been closed');
                            resolve(''); // console.log('3');
                        };
                    }, awaitingTime);
                });
                resolve(promise2);
            };
        }, awaitingTime);
    });
    return promise1;
};

// switch letters to numbers
exports.switchLtoN = function(x) {
    var y = x.split('');
    for (var k = 0; k < y.length; k++) {
        // transform upper char to number -- 96 for lower
        y[k] = y[k].charCodeAt(0) - 64;
    }
    return y;
};
