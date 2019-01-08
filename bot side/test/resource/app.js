
// serlect question details
exports.getQ = async function(x) {
    // check if any open questions
    var anyopen = await exports.returnUNC();
    var responseRowObject = {};

    if (anyopen.rowCount === 0 || x[1] !== '') {
        // db actions
        const qtext = {
            text: 'select * from app_test.question where id = $1',
            values: [x[0]]
        };
        var qans = await submitQuery(qtext);
        responseRowObject = qans.rows[0];

        // clean empty atributes from response
        Object.keys(responseRowObject).forEach((key) => (responseRowObject[key] === '') && delete responseRowObject[key]);

        // group possible answers
        var arrqq = [];
        Object.keys(responseRowObject).forEach((key) => (key.length === 4) &&
            arrqq.push(responseRowObject[key]) &&
            delete responseRowObject[key]);
        responseRowObject['panswers'] = arrqq;
        responseRowObject['answer'] = switchLtoN(responseRowObject['answer']);
    }
    return responseRowObject;
};

// insert complaint
exports.postC = async function(x) {
    // db actions
    const qtext = {
        text: 'insert into app_test.complaints (convid, username, userid, tmstamp, qid, complaint) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [x['convid'], x['username'], x['userid'], x['tmstamp'], x['qid'], x['complaint']]
    };
    await submitQuery(qtext);

    return x['username'];
};

// insert fired question
exports.firedQ = async function(x) {
    // db actions
    var newstamp = new Date();
    const qtextInsert = {
        text: 'insert into app_test.fired_question (convid, qid, tmstamp, complete) VALUES ($1, $2, $3, $4);',
        values: [x['convid'], x['qid'], newstamp, false]
    };
    await submitQuery(qtextInsert);

    const qtextUpdate = {
        text: 'update app_test.question set firedcounter = firedcounter + 1 where questionnr = $1;',
        values: [x['qid']]
    };
    await submitQuery(qtextUpdate);

    const qtextSelect = {
        text: 'select id from app_test.fired_question where convid = $1 and qid = $2 and tmstamp = $3',
        values: [x['convid'], x['qid'], newstamp]
    };
    var qans = await submitQuery(qtextSelect);

    return qans.rows[0]['id'];
};

// select fired question stats
exports.returnFQS = async function(x) {
    // answers counter
    const qtextSelectQstats = {
        text: 'select firedcounter, ansokcounter, anstoutcounter from app_test.question where questionnr = $1;',
        values: [x['qid']]
    };
    var qstats = await submitQuery(qtextSelectQstats);

    // answers counter
    const qtextSelectAnsnumber = {
        text: 'select count(fqid) as cnter from app_test.fired_answer where fqid = $1;',
        values: [x['fqid']]
    };
    var ansnuimber = await submitQuery(qtextSelectAnsnumber);

    // number of right answers
    const qtextSelectchoises = {
        text: 'select choises from app_test.fired_answer where fqid = $1;',
        values: [x['fqid']]
    };
    var qchoises = await submitQuery(qtextSelectchoises);
    var choisesArray = [];
    for (var i = 0; i < qchoises.rows.length; i++) {
        var temp = qchoises.rows[i]['choises'];
        if (temp === x['theanswer'].toString()) {
            choisesArray.push(temp);
        };
    };
    return [Number(ansnuimber.rows[0]['cnter']), choisesArray.length, qstats.rows[0]];
};

// insert user answer if it does not exists
exports.firedA = async function(x) {
    const qtextSelect = {
        text: 'select id from app_test.fired_answer where convid = $1 and username = $2 and userid = $3 and fqid = $4',
        values: [x['convid'], x['username'], x['userid'], x['fqid']]
    };
    var checkefa = await submitQuery(qtextSelect);
    if (!checkefa.rowCount) {
        const qtextInsert = {
            text: 'insert into app_test.fired_answer (convid, username, userid, qid, fqid, choises) VALUES ($1, $2, $3, $4, $5, $6)',
            values: [x['convid'], x['username'], x['userid'], x['qid'], x['fqid'], x['chvalues']]
        };
        await submitQuery(qtextInsert);
        var ismarked = await exports.returnQC(x['fqid']);
        if (!ismarked.rows[0]['complete']) {
            await exports.completeQ([x['fqid'], '']);
        };

        // check if is the right answer
        var checkra = (x['rightResponse'].sort().toString() === x['formatedchvalues'].toString());
        if (checkra) {
            const qtextUpdate = {
                text: 'update app_test.question set ansokcounter = ansokcounter + 1 where questionnr = $1;',
                values: [x['qid']]
            };
            await submitQuery(qtextUpdate);
        }
    };
};

// select question completion
exports.returnQC = async function(x) {
    // db actions
    const qtextSelect = {
        text: 'select complete from app_test.fired_question where id = $1 ',
        values: [x]
    };
    var checker = await submitQuery(qtextSelect);
    return checker;
};

// select any uncompleted
exports.returnUNC = async function() {
    // db actions
    const qtextSelect = {
        text: 'select complete from app_test.fired_question where complete = $1 ',
        values: [false]
    };
    var checker = await submitQuery(qtextSelect);
    return checker;
};

// complete  question
exports.completeQ = async function(x) {
    // db actions
    const qtextUpdateFQ = {
        text: 'update app_test.fired_question set complete = $1 where id = $2',
        values: [true, x[0]]
    };
    await submitQuery(qtextUpdateFQ);
    if (x[1] === 'timeout') {
        const qtextUpdateQ = {
            text: 'update app_test.question set anstoutcounter = anstoutcounter + 1 where questionnr = $1',
            values: [x[2]]
        };
        await submitQuery(qtextUpdateQ);
    };
};

// test sql from file
exports.returnUNCq = async function(x) {
    var spawn = require('child_process').spawn;
    var child;
    child = spawn('powershell.exe', ['powershell', '"..\\..\\\'DB side\'\\\'PS scripts\'\\createSchema.ps1"', x]);
    child.stdout.on('data', function(data) {
        console.log('Powershell Data: ' + data);
    });
    child.stderr.on('data', function(data) {
        console.log('Powershell Errors: ' + data);
    });
    child.on('exit', function() {
        console.log('Powershell Script finished');
    });
    child.stdin.end();
};

// database query sender
async function submitQuery(qset) {
    const { Pool } = require('pg');
    const pool = new Pool({
        user: 'app_user',
        host: 'localhost',
        database: 'db5',
        password: '123456',
        port: 5432
    });
    var rreturn;
    const client = await pool.connect();
    const query = qset;
    await client.query(query)
        .then(res => {
            rreturn = res;
            client.release();
        })
        .catch(e => {
            console.error(e.stack);
            client.release();
        });
    pool.end();
    return rreturn;
};

// switch letters to numbers
function switchLtoN(x) {
    var y = x.split('');
    for (var k = 0; k < y.length; k++) {
        // transform upper char to number -- 96 for lower
        y[k] = y[k].charCodeAt(0) - 64;
    }
    return y;
};
