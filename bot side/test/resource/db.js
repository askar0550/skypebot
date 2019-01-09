
var ff = require('./fs');
// serlect question details
exports.getQ = async function(x) {
    // check if any open questions
    var anyopen = await exports.returnUNC(x[2]);
    var responseRowObject = {};

    if (anyopen.rowCount === 0 || x[1] !== '') {
        // db actions
        const qtext = {
            text: 'select * from main.question where questionnr = $1',
            values: [x[0]]
        };
        var qans = await submitQuery(qtext);
        const cqtext1 = {
            text: 'select id from ' + x[2] + '.question where questionnr = $1',
            values: [x[0]]
        };
        var chch = await submitQuery(cqtext1);
        if (!chch.rowCount) {
            const cqtext2 = {
                text: 'insert into ' + x[2] + '.question (questionnr) values ($1)',
                values: [x[0]]
            };
            await submitQuery(cqtext2);
        };

        responseRowObject = qans.rows[0];

        // clean empty atributes from response
        Object.keys(responseRowObject).forEach((key) => (responseRowObject[key] === '') && delete responseRowObject[key]);

        // group possible answers
        var arrqq = [];
        Object.keys(responseRowObject).forEach((key) => (key.length === 4) &&
            arrqq.push(responseRowObject[key]) &&
            delete responseRowObject[key]);
        responseRowObject['panswers'] = arrqq;
        responseRowObject['answer'] = ff.switchLtoN(responseRowObject['answer']);
    }
    return responseRowObject;
};

// insert complaint
exports.postC = async function(x) {
    // db actions
    const qtext = {
        text: 'insert into main.complaints (convid, username, userid, tmstamp, qid, complaint) VALUES ($1, $2, $3, $4, $5, $6)',
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
        text: 'insert into ' + x['schema'] + '.fired_question (qid, tmstamp, complete) VALUES ($1, $2, $3);',
        values: [x['qid'], newstamp, false]
    };
    await submitQuery(qtextInsert);

    const qtextUpdate = {
        text: 'update ' + x['schema'] + '.question set firedcounter = firedcounter + 1 where questionnr = $1;',
        values: [x['qid']]
    };
    await submitQuery(qtextUpdate);

    const qtextSelect = {
        text: 'select id from ' + x['schema'] + '.fired_question where qid = $1 and tmstamp = $2',
        values: [x['qid'], newstamp]
    };
    var qans = await submitQuery(qtextSelect);

    return qans.rows[0]['id'];
};

// select fired question stats
exports.returnFQS = async function(x) {
    // answers counter
    const qtextSelectQstats = {
        text: 'select firedcounter, ansokcounter, anstoutcounter from ' + x['schema'] + '.question where questionnr = $1;',
        values: [x['qid']]
    };
    var qstats = await submitQuery(qtextSelectQstats);

    // answers counter
    const qtextSelectAnsnumber = {
        text: 'select count(fqid) as cnter from ' + x['schema'] + '.fired_answer where fqid = $1;',
        values: [x['fqid']]
    };
    var ansnuimber = await submitQuery(qtextSelectAnsnumber);

    // number of right answers
    const qtextSelectchoises = {
        text: 'select choises from ' + x['schema'] + '.fired_answer where fqid = $1;',
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
        text: 'select id from ' + x['schema'] + '.fired_answer where username = $1 and userid = $2 and fqid = $3',
        values: [x['username'], x['userid'], x['fqid']]
    };
    var checkefa = await submitQuery(qtextSelect);
    var checkra = (x['rightResponse'].sort().toString() === x['formatedchvalues'].toString());
    if (checkefa.rowCount === 0) {
        const qtextInsert = {
            text: 'insert into ' + x['schema'] + '.fired_answer (username, userid, qid, fqid, choises, mark) VALUES ($1, $2, $3, $4, $5, $6)',
            values: [x['username'], x['userid'], x['qid'], x['fqid'], x['chvalues'], checkra]
        };
        await submitQuery(qtextInsert);
        var ismarked = await exports.returnQC([x['schema'], x['fqid']]);
        if (!ismarked.rows[0]['complete']) {
            await exports.completeQ([x['schema'], x['fqid'], '']);
        };

        // check if is the right answer
        if (checkra) {
            const qtextUpdate = {
                text: 'update ' + x['schema'] + '.question set ansokcounter = ansokcounter + 1 where questionnr = $1;',
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
        text: 'select complete from ' + x[0] + '.fired_question where id = $1 ',
        values: [x[1]]
    };
    var checker = await submitQuery(qtextSelect);
    // console.log(checker.rows[0]['complete']);
    return checker;
};

// select any uncompleted
exports.returnUNC = async function(x) {
    // db actions
    const qtextSelect = {
        text: 'select complete from ' + x + '.fired_question where complete = $1 ',
        values: [false]
    };
    var checker = await submitQuery(qtextSelect);
    return checker;
};

// complete  question
exports.completeQ = async function(x) {
    // db actions
    const qtextUpdateFQ = {
        text: 'update ' + x[0] + '.fired_question set complete = $1 where id = $2',
        values: [true, x[1]]
    };
    await submitQuery(qtextUpdateFQ);
    if (x[2] === 'timeout') {
        const qtextUpdateQ = {
            text: 'update ' + x[0] + '.question set anstoutcounter = anstoutcounter + 1 where questionnr = $1',
            values: [x[3]]
        };
        await submitQuery(qtextUpdateQ);
    };
};

// create conversation schema if it does not exist
exports.createCS = async function(x) {
    const qtextSelect = {
        text: 'select * from information_schema.schemata where schema_name = $1',
        values: [x[0]]
    };
    var checkefa = await submitQuery(qtextSelect);
    if (!checkefa.rowCount) {
        var spawn = require('child_process').spawn;
        var child;
        child = spawn('powershell.exe', ['powershell', '"..\\..\\\'DB side\'\\\'PS scripts\'\\createSchema.ps1"', x[0], x[1]]);
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
    }
};

// database query sender
async function submitQuery(qset) {
    const { Pool } = require('pg');
    const pool = new Pool({
        user: 'app_user',
        host: 'localhost',
        database: 'dbtest',
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
