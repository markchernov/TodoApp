var express = require('express');
var app = express();

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

