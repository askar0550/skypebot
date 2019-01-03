
// getQ(50);

exports.getQ = async function(x) {
    // async function getQ(x) {
    const { Pool } = require('pg');
    const pool = new Pool({
        user: 'app_user',
        host: 'localhost',
        database: 'appdata',
        password: '123456',
        port: 5432
    });

    const client = await pool.connect();

    const result = await client.query({
        rowMode: 'array',
        text: 'select * from app_test.question where id = ' + x
    });

    var qqq = {};
    for (var i = 1; i < result.rows[0].length; i++) {
        if (result.rows[0][i] !== '') {
            qqq[result.fields[i].name] = result.rows[0][i];
        }
    }

    var formatqqq = {};

    var arrqq = [];
    for (var key in qqq) {
        if (key.length === 4) {
            arrqq.push(qqq[key]);
        }
    }

    formatqqq['id'] = qqq['questionnr'];
    formatqqq['question'] = qqq['question'];
    formatqqq['answers'] = arrqq;
    formatqqq['result'] = switchLtoN(qqq['answer']);

    formatqqq['exp'] = '';
    if (qqq['explanation']) {
        formatqqq['exp'] = qqq['explanation'];
    };

    await client.end();
    // console.log(formatqqq);
    return formatqqq;
};

exports.postC = async function(x) {
    // async function getQ(x) {
    const { Pool } = require('pg');
    const pool = new Pool({
        user: 'app_user',
        host: 'localhost',
        database: 'appdata',
        password: '123456',
        port: 5432
    });

    const client = await pool.connect();

    const query = {
        text: 'insert into app_test.complaints (convid, username, userid, tmstamp, qid, complaint) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [x['convid'], x['username'], x['userid'], x['tmstamp'], x['qid'], x['complaint']]
    };
    await client.query(query)
        .then(res => console.log(res.rows[0]))
        .catch(e => console.error(e.stack));
    return x['username'];
};

exports.getDateTime = function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length === 1) {
        month = '0' + month;
    }
    if (day.toString().length === 1) {
        day = '0' + day;
    }
    if (hour.toString().length === 1) {
        hour = '0' + hour;
    }
    if (minute.toString().length === 1) {
        minute = '0' + minute;
    }
    if (second.toString().length === 1) {
        second = '0' + second;
    }
    var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    // console.log(dateTime);
    return dateTime;
};

function switchLtoN(x) {
    var y = x.split('');
    for (var k = 0; k < y.length; k++) {
        // transform upper char to number -- 96 for lower
        y[k] = y[k].charCodeAt(0) - 64;
    }
    // console.log(y);
    return y;
};
