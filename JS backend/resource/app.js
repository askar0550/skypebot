
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

function switchLtoN(x) {
    var y = x.split('');
    for (var k = 0; k < y.length; k++) {
        // transform upper char to number -- 96 for lower
        y[k] = y[k].charCodeAt(0) - 64;
    }
    // console.log(y);
    return y;
};
