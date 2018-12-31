
const argss = process.argv

	if ( argss.length > 3) {
		
		console.log('too many arguments were given!')
	} else {
		
		var input = argss[2]
		console.log(input)
		
		if (  Number(input) < 301) {
			getQ(input)
		} else if (input == 'random') {
			// random number min = 1 to max = 300
			var rannr =  Math.floor(Math.random()*(300-1+1)+1);
			console.log(rannr);
			getQ(rannr);
		} else {
			console.log('there are only two options an integer less than 300 or type \'random\', please retry!');
		}
		
	
	}


function getQ(x) {
	
	const { Pool, Client } = require('pg')

	const pool = new Pool({
	  user: 'app_user',
	  host: 'localhost',
	  database: 'appdata',
	  password: '123456',
	  port: 5432,
	})




	pool.query('select * from app_test.question where id = ' + x, (err, res) => {
	  console.log( 'ID: ',  res.rows[0].id);

	  console.log('QUESTION: ',  res.rows[0].question);
	  if (res.rows[0].ansa) {
	  	console.log('ANSWER A: ', res.rows[0].ansa);
	  }
	  
	  if (res.rows[0].ansb) {
	  	console.log('ANSWER B: ', res.rows[0].ansb);
	  }
	  
	  if (res.rows[0].ansc) {
	  	console.log('ANSWER C: ', res.rows[0].ansc);
	  }
	  
	  if (res.rows[0].ansd) {
	  	console.log('ANSWER D: ', res.rows[0].ansd);
	  }
	  if (res.rows[0].anse) {
	  	console.log('ANSWER E: ', res.rows[0].anse);
	  }
	  if (res.rows[0].ansf) {
	  	console.log('ANSWER F: ', res.rows[0].ansf);
	  }
	  if (res.rows[0].ansg) {
	  	console.log('ANSWER G: ', res.rows[0].ansg);
	  }
	  console.log(' \n', 'RIGHT ANSWER: ', res.rows[0].answer);
	  if (res.rows[0].explanation) {
	  	console.log('\n', res.rows[0].explanation);
	  }
	  pool.end()
	})
}

/*
for (i = 1; i <= 150; i++ ) {
	getQ()
}
*/
