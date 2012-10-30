
// Modules used:
var mysql = require('mysql');

// Database-related constants:
var HOST = 'ensembldb.ensembl.org';
var MYSQL_USER = 'anonymous';
var MYSQL_PASS = '';
var MYSQL_PORT = 5306;
var DATABASE = 'ensembl_compara_51';

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
		password: MYSQL_PASS,
		port: MYSQL_PORT
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
//	client.query('SELECT project_name FROM PROJECTS WHERE userid="'+username+'";', 
//	client.query('SELECT COUNT(DISTINCT taxon_id) FROM ncbi_taxa_node;', 

//	client.query('SELECT taxon_id FROM ncbi_taxa_node;', 

	client.query('SELECT * FROM ncbi_taxa_name where taxon_id=9606;', 
		function getR(err, results, fields){
		
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
			console.log('Query executed, now saving the results...'+results.length);

			var names = [];
			for(var i=0;i<results.length;i++) {
				console.log('results length:'+results.length);
				var resultItem = results[i];
				names[i] = resultItem['name'];
				console.log("prj name:"+resultItem['name']+" and taxon id: "+resultItem['taxon_id']+" name class:"+resultItem['name_class']);
			}//
		
			var count = results.length;
		//	var nr = count['taxon_id'];
		/*	for(r in results) {
				console.log("Each result: "+r+" lenght of array: "+results.length);
			}
*/
			console.log("Fields: "+fields);
			console.log("Successful query, prj: "+count);
		    res.render('login', {
		        username: username,
		        projects: names
		    });

			console.log('Finished the query, close the connection!');
			client.end();
		}
	});
//	}
}



// exports.connectClient = connectClient;
exports.getProjects = getProjects;
exports.insert = insert;
