/*
Restful API testing with Node.js/Express/MySQL/Angular
-CRUD app with sample product listing
*********
Author:	Drew Lenhart
Date:	5/10/2016
*/

var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");

//Security
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

/*
 * create log directory if it doesnt exsist.
 * try/catch from log4js demo.
 */
try {
	require('fs').mkdirSync('./log');
} catch (e) {
	if (e.code !== 'EEXIST') {
		console.error("Could not set up log directory, error was: ", e);
		process.exit(1);
	}
}

//LOGGER
var log4js = require('log4js');
log4js.configure('./config/log4js.json');
var log = log4js.getLogger("server");


//STATIC FILES
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data

//More security
app.use(session({ secret: 'WDI Rocks!',
                  resave: true,
                  saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

/*MY SQL Connection Info*/
var pool = mysql.createPool({
	connectionLimit : 25,
	host     : 'localhost',
	user     : 'Agesander',
	password : 'superlux',
	database : 'leslie3'
});

log.debug('Server is starting....');

//TEST CONNECTION
pool.getConnection(function (err, connection) {
	if (!err) {
		console.log("Database is connected ... ");
		log.info('Database is connected ... ');
		connection.release();
	} else {
		console.log("Error connecting database ... ");
		log.error('Error connecting database ... ');
	}
	console.log("releasing connection ... ");
});

// ROOT - Loads Home
app.get('/home', function (req, res) {
	res.sendFile( __dirname + "/" + "public/home.ejs" );
});

// ROOT - Loads Angular App
app.get('/requests', function (req, res) {
	res.sendFile( __dirname + "/" + "index.html" );
});

// This responds a GET request for the /list page.
app.get('/api/list', function (req, res) {
	console.log("GET Request :: /list");
	log.info('GET Request :: /list');
	var data = {
        "error": 1,
        "products": ""
    };
	
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * from products', function (err, rows, fields) {
			connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["products"] = rows;
				res.json(data);
			} else if (rows.length === 0) {
				//Error code 2 = no rows in db.
				data["error"] = 2;
				data["products"] = 'No products Found..';
				res.json(data);
			} else {
				data["products"] = 'error while performing query';
				res.json(data);
				console.log('Error while performing Query: ' + err);
				log.error('Error while performing Query: ' + err);
			}
		});
	
	});
});

//UPDATE Product
app.put('/api/update', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var description = req.body.description;
    var price = req.body.price;
    var data = {
        "error": 1,
        "product": ""
    };
	console.log('PUT Request :: /update: ' + id);
	log.info('PUT Request :: /update: ' + id);
    if (!!id && !!name && !!description && !!price) {
		pool.getConnection(function (err, connection) {
			connection.query("UPDATE products SET name = ?, description = ?, price = ? WHERE id=?",[name,  description, price, id], function (err, rows, fields) {
				if (!!err) {
					data["product"] = "Error Updating data";
					console.log(err);
					log.error(err);
				} else {
					data["error"] = 0;
					data["product"] = "Updated Book Successfully";
					console.log("Updated: " + [id, name, description, price]);
					log.info("Updated: " + [id, name, description, price]);
				}
				res.json(data);
			});
		});
    } else {
        data["product"] = "Please provide all required data (i.e : id, name, desc, price)";
        res.json(data);
    }
});

//LIST Product by ID
app.get('/api/list/:id', function (req, res) {
	var id = req.params.id;
	var data = {
        "error": 1,
        "product": ""
    };
	
	console.log("GET request :: /list/" + id);
	log.info("GET request :: /list/" + id);
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * from products WHERE id = ?', id, function (err, rows, fields) {
			connection.release();
			
			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["product"] = rows;
				res.json(data);
			} else {
				data["product"] = 'No product Found..';
				res.json(data);
				console.log('Error while performing Query: ' + err);
				log.error('Error while performing Query: ' + err);
			}
		});
	
	});
});

//INSERT new product
app.post('/api/insert', function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var price = req.body.price;
    var data = {
        "error": 1,
        "products": ""
    };
	console.log('POST Request :: /insert: ');
	log.info('POST Request :: /insert: ');
    if (!!name && !!description && !!price) {
		pool.getConnection(function (err, connection) {
			connection.query("INSERT INTO products SET name = ?, description = ?, price = ?",[name,  description, price], function (err, rows, fields) {
				if (!!err) {
					data["products"] = "Error Adding data";
					console.log(err);
					log.error(err);
				} else {
					data["error"] = 0;
					data["products"] = "Product Added Successfully";
					console.log("Added: " + [name, description, price]);
					log.info("Added: " + [name, description, price]);
				}
				res.json(data);
			});
        });
    } else {
        data["products"] = "Please provide all required data (i.e : name, desc, price)";
        res.json(data);
    }
});

app.post('/api/delete', function (req, res) {
    var id = req.body.id;
    var data = {
        "error": 1,
        "product": ""
    };
	console.log('DELETE Request :: /delete: ' + id);
	log.info('DELETE Request :: /delete: ' + id);
    if (!!id) {
		pool.getConnection(function (err, connection) {
			connection.query("DELETE FROM products WHERE id=?",[id],function (err, rows, fields) {
				if (!!err) {
					data["product"] = "Error deleting data";
					console.log(err);
					log.error(err);
				} else {
					data["product"] = 0;
					data["product"] = "Delete product Successfully";
					console.log("Deleted: " + id);
					log.info("Deleted: " + id);
				}
				res.json(data);
			});
		});
    } else {
        data["product"] = "Please provide all required data (i.e : id ) & must be a integer";
        res.json(data);
    }
});

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("dummy app listening at: " + host + ":" + port);

})