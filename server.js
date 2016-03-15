var express = require('express');
var app = express();


// ---------------------------------------------------- cookies

var cookieParser = require('cookie-parser');

var credentials = require('./credentials.js');

app.use(cookieParser(credentials.cookieSecret));


app.get("/signed", function(req,res){
    res.cookie('testCookie', {test : "test"}, {signed : true});
    res.render('index');
});


app.get('/allCookies', function(req, res) {
  console.log("Cookies: ", req.cookies)
});


app.get('/allSignedCookies', function(req, res) {
  console.log("Cookies: ", req.signedCookies);
});


app.get('/allSignedCookies', function(req,res) {
    console.log(req.signedCookies.testCookie);
});





// -----------------------------------------------------  database

var mysql = require('mysql');
var conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'todo_rest'
});


var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

conn.connect();


var handelbars = require('express-handlebars').create({defaultLayout: 'application'});


app.engine('handlebars', handelbars.engine);
app.set('view engine', 'handlebars');



app.use(express.static(__dirname + '/public'));  // use the static middleware to serve static content from a 'public' directory

app.get('/', function(req,res) {   // now create a script file and source it from your 'index.html', for now just console.log 'LOADED' to make sure its correctly pathed
	res.render('index.html');
});

app.get('/hello', function(req,res) {
	res.send('Hello world');
});

app.listen(3000, function() {
	console.log("listening on 3000");
});

// --------------------------------- paths

app.get('/todos', function(req,res) {
    conn.query('SELECT * FROM todo', function(err,rows,fields) {
        if (err) {
            console.log("Something is amiss...");
            console.log(err);
        } else {
            res.send({data : rows});
            console.log({data : rows});
        }
    }); 
});


app.post('/todos', function(req,res) {
    
    console.log(req.body);
    console.log(req.body.description)
    
   var returnObject = {description: req.body.description , priority: req.body.priority };
    
    conn.query('INSERT INTO todo (description, priority) VALUES("' + req.body.description +'","'+ req.body.priority +'")', function(err,rows,fields) {
        if (err) {
            console.log("Something is amiss...");
            console.log(err);
        } else {
            
            
        
            res.send({data: [returnObject]});
            console.log({data : rows});
        }
    }); 
});

// ----------------------------------------------------DELETE
app.delete('/delete', function (req, res) {
    
var todoId = req.body.id;

    console.log(todoId);

// Use our query clause:
var myQuery = "DELETE FROM todo WHERE id=" + todoId;



var returnObject = {
    "id": todoId,
    "confirmation": "was deleted"
};


  console.log(returnObject);  
    
    
conn.query(myQuery, function(err,rows,fields) {
        if (err) {
            console.log("Something is amiss...");
            console.log(err);
        } else {
            
            
        
            res.send({data: [returnObject]});
            console.log({data : rows});
        }
    }); 
});

// ----------------------------------------------------PUT
app.put('/update', function (req, res) {
    
var todoId = req.body.id;
var description = req.body.description; 
var priority = req.body.priority;
    

    console.log(todoId);
    console.log(description);
    console.log(priority);

// Use our query clause:

var myQuery = "UPDATE todo SET  description='"+ description +"', priority='"+ priority + "' WHERE id=" + todoId;

console.log("in update function");

var returnObject = {
    "id": todoId,
    "confirmation": "was updated"
};


  console.log(returnObject);  
    
    
conn.query(myQuery, function(err,rows,fields) {
        if (err) {
            console.log("Something is amiss...");
            console.log(err);
        } else {
            
            
        
            res.send({data: [returnObject]});
            console.log({data : rows});
        }
    }); 
});