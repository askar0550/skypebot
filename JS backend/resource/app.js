
//getQ(50);

exports.getQ = async function(x) {
//async function getQ(x) {
    const { Pool } = require('pg')
    const pool = new Pool({
        user: 'app_user',
        host: 'localhost',
        database: 'appdata',
        password: '123456',
        port: 5432,
    })

    const client = await pool.connect()

    const result = await client.query({
        rowMode: 'array',
        text: 'select * from app_test.question where id = ' + x,
    })

    var qqq = []
    for (var i = 1; i < result.rows[0].length; i++) {
        if (result.rows[0][i] != '') {
            qqq[result.fields[i].name] = result.rows[0][i]
        }
    }

    await client.end();
    // console.log(qqq);
    return qqq;
}