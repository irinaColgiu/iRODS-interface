
// Modules used:
var mysql = require('mysql');

// Database-related constants:
var HOST = 'localhost';
var MYSQL_USER = 'root';
var MYSQL_PASS = 'admin';
var DATABASE = 'PROJECTS_USERS_DB';

/*
var client = mysql.createClient({
	host: HOST,
	user: MYSQL_USER,
	password: MYSQL_PASS
});
*/

function connectClient() {
	var client = mysql.createClient({
		host: HOST,
		user: MYSQL_USER,
		password: MYSQL_PASS	
	});
	client.query('use '+DATABASE, function(err){
		if(err) {
			console.log('ERROR - use DATABASE!');
			client.end();
			throw err;
		}
	});
	return client;
}

function insert() {
	connectClient();
	client.query('INSERT into PROJECTS SET userid="sn3", project_name="HGI"', function(err, results) {
		if(err) {
			console.log('ERROR at insert!');
		}
		else {
			console.log('Successful insert!');
		}
		client.end();
	});
}


function getProjects(username, res) {
	var client = connectClient();
	console.log('Hello from DB Client, '+username);
	client.query('SELECT project_name FROM PROJECTS WHERE userid="'+username+'";', 
		function getR(err, results){
		
		if(err) {
			console.log('ERROR - SELECT FROM DB!');
			client.end();
			throw err;
		}
		else {
			if(results.length <= 0) {
				res.send('No user called '+username+' in the DATABASE!');
				return;
			}
			console.log('Query executed, now saving the results...');

			var projects = [];
			for(var i=0;i<results.length;i++) {
				console.log('results length:'+results.length);
				var resultItem = results[i];
				projects[i] = resultItem['project_name'];
				console.log("prj name:"+resultItem['project_name']+" and var prj: "+projects[i]);
			}
			console.log("Successful query, prj: "+projects);
		    res.render('login', {
		        username: username,
		        projects: projects
		 //       scripts: ['/imports/jqueryFileTree/jqueryFileTree.js','/imports/jqueryFileTree/myScript.js']
		 //       projects: firstResult['project_name']
		    });

		//	console.log("Successful query, prj: "+firstResult['project_name']);
			
		//	res.render('about');
			console.log('Finished the query, close the connection!');
			// res.send({ projects : results.project_name});
			client.end();
		}
	});
//	}
}



// exports.connectClient = connectClient;
exports.getProjects = getProjects;
exports.insert = insert;
