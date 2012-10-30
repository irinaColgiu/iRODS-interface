
/**
 * Module dependencies.
 */

var express = require('express')
  , nib = require('nib')
  , stylus = require('stylus')
 // , routes = require('./routes')
 // , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var dbClient = require("./public/javascripts/db_client");

var dbEnsembl = require("./public/javascripts/db_Ensemble");

// var dbClient = require('./public/javascripts/db_client');



var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  app.use(stylus.middleware(
    { src: __dirname + '/public'
    , compile: compile
    }
  ))
 /* app.use(require('stylus').middleware(
    { src: __dirname + '/public'
    , compile: compile
    }
   ));
  */
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//app.get('/', routes.index);
//app.get('/users', user.list);


app.get('/', function(req, res){
  res.render('home');
});

/*app.post('/', function(req, res){
  var username = req.body.username;
  console.log('Username receiverd on post: '+username);
  res.redirect('/login', {username: username});
  // res.render('login', { username: username });
});*/

app.post('/login', function(req, res){
 // var username = req.params.username;
  var username = req.body.username;
  console.log("I have received the following username: "+username);
  dbClient.getProjects(username, res);

////  dbEnsembl.getProjects(username, res);
  


//  res.render('about');
  //console.log("Projects: "+prjList);
  


 /* res.render('login', {
    //  res.send({
        username: username,
        projects: prjList
      });*/
  
 /* var prjList = dbClient.getProjects(username, function() {
      res.render('login', {
    //  res.send({
        username: username,
        projects: prjList
      });
  });
 */


});

app.get('/about', function(req, res){
  console.log('Request for ABOUT page...');
  res.render('about',{success : true});
});


// res.send({username: username, projects: prjList});


/*app.get('/about', function(req, res){
  res.render('about', {
    title: 'About'
  });
});

app.get('/contact', function(req, res){
  res.render('contact', {
    title: 'Contact'
  });
});*/

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
