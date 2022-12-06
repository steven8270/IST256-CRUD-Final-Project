//Author: Joe Oakes
//Penn State Abington
//IST 256 Web Programming
//Date: 12/2/2020
//Version: 10
//App Purpose: Handles CRUD opertion requests
//Helpful Online Documentation: https://www.w3schools.com/nodejs/

//Require the NPM Node Package Module express which is the web application handler
var express = require("express");
//app object global scope
var app = express();
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//app.use(express.json())
//npm install body-parser
//app.use(express.bodyParser());
//==========================================================================================	
//Create a Document Function from MongoDB using a URL Request GET HTTP Method NodeJS
//==========================================================================================
//req is the request object, res is the response object
//The URL route and query string is specified as an example shown below
// /Create?StudentName=JoeOakes&StudentSSN=3336661299&StudentEmail=jxo19@psu.edu&StudentPhone=4445559999
app.get("/Create", function(req, res) {
 try {
    //Require the NPM Node Package Module mongodb
    var mongodb = require('mongodb');
	//Create the MongoClient object
    var MongoClient = mongodb.MongoClient;
	//Response HTTP Header parameter setting
    res.header("Access-Control-Allow-Origin", "*");
	//Check the request query studentID so that it has a value
	console.log("student id: " + req.query.studentID);	
    if(!req.query.studentID) {
		console.log("missing the student ID"); //Used for debugging in the console window
		//respond back with the JSON status error message
        return res.send({"result": "missing the student name"});
    } else {
	//Create the student JSON object 
	//It is filled in with request query student field values sent
		var student = {
        "StudentID": req.query.studentID,
        "StoreName": req.query.storeName,
        "UserDate" : req.query.userDate,
        "DrinkName" : req.query.drinkName,
        "UserMessage" : req.query.userMessage
        }
		console.log(student); //Used for debugging in the console window
		//Create the URL to connect to the local Mongo Database Server	
        var url = 'mongodb://localhost:27017';
        MongoClient.connect(url, function (err, client) {
          if (err) {
			console.log(err); //Used for debugging in the console window
			//respond there was Mongo connection error
            return res.send({"result" : "failed"});
          } else {
            var db = client.db('OakesDB'); //Select the Mongo Database OakesDB
		    var collection = db.collection('Students'); //Select the Collection Students
            collection.insertOne(student, function (err, res){
			  if (err) throw err;
              client.close();  //Close the client connection
            }); //insertOne code block
            return res.send({"result" : "passed"}); //respond the create operation worked			
		  }//close if err check
        });//close the connect function
    } //close else code block
  } catch (error) {
	  console.error(error);
  } //Close the catch code block
}); //Close the app.get code block

//=================================================================================
//Read a Document Function from MongoDB using a URL Request GET HTTP Method NodeJS
//=================================================================================
app.get("/Read", function(req, res) {
try {
 var mongodb = require('mongodb');
 var MongoClient = mongodb.MongoClient;
    res.header("Access-Control-Allow-Origin", "*");
    if(!req.query.studentID) {
        return res.send({"result": "missing the student name"});
    } else {
        var url = 'mongodb://localhost:27017';
        MongoClient.connect(url, function (err, client) {
        if (err) {
          return res.send({"result" : "failed"});
        } else {
		  var db = client.db('OakesDB');
          var collection = db.collection('Students');
            collection.findOne({"StudentID" : req.query.studentID}, function(err, student){
			  if (err) throw err;
              client.close();
			  console.log(student);
			  return res.send(student);
            });//close findOne code block
         }//close if err check
       }); //close function
    } //close else
  } catch (error) {
	  console.error(error);
  } //Close the catch code block
});//Close app.get

//==========================================================================================
//Update a Document Function from MongoDB using a URL Request GET HTTP Method NodeJS
//==========================================================================================
app.get("/Update", function(req, res) {
try {
	console.log("Update");
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    res.header("Access-Control-Allow-Origin", "*");
    if(!req.query.storeName) {
        return res.send({"status": "error", "message": "missing student Name"});
    } else {
        var url = 'mongodb://localhost:27017';
        MongoClient.connect(url, function (err, client) {
        if (err) {
          return res.send({"result" : "failed"});
        } else {
		  var db = client.db('OakesDB');
          var collection = db.collection('Students');
		  const query = {"StudentID" : req.query.studentID};
		  console.log(query);
		  console.log(req.query.studentID);
		   var newvalues = { $set: {"StoreName": req.query.storeName,
		   "UserDate" : req.query.userDate,
           "DrinkName" : req.query.drinkName,
           "UserMessage" : req.query.userMessage } };
          collection.updateOne(query,newvalues, function(err, res){
			if (err) throw err;
            client.close();
	       });//close the UpdateOne code block
		  return res.send({"result" : "passed"});
         }  //close if err
        }); //close function
    } //close else
  } catch (error) {
	  console.error(error);
  } //Close the catch code block
});

//==========================================================================================
//Delete a Document Function from MongoDB using a URL Request GET HTTP Method NodeJS
//==========================================================================================
app.get("/Delete", function(req, res) {
try {
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    res.header("Access-Control-Allow-Origin", "*");
    if(!req.query.studentID) {
        return res.send({"result": "missing the student ID"});
    } else {
        var url = 'mongodb://localhost:27017';
        MongoClient.connect(url, function (err, client) {
        console.log(err);
        if (err) {
          return res.send({"result" : "delete failed"});
        } else {
	      const db = client.db('OakesDB');
          const collection = db.collection('Students');
		  const query = { StudentID:req.query.studentID };
		  console.log("student id:" + req.query.studentID);
          collection.deleteOne(query, function(err, obj) {
            if (err) throw err;
            client.close();
			return res.send({"result" : "passed"});
		  }); //close the delectOne code block
         }  //close if err
        }); //close function
    } //close else
  } catch (error) {
	  console.error(error);
  } //Close the catch code block
}); //Close app.get
//========================================================================================	
//Create Document Function from MongoDB using a URL Request POST HTTP Method NodeJS
//========================================================================================
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()
app.post("/Create", jsonParser, function(req, res) {
console.log("Create Post");
try {
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    res.header("Access-Control-Allow-Origin", "*");
	console.log('student ID: ' + req.body.studentID);
    if(!req.body.studentID) {
        return res.send({"result": "missing the student ID"});
    } else {
    var student = {
        "StudentID": req.body.studentID,
        "StoreName": req.body.storeName,
        "UserDate" : req.body.userDate,
        "DrinkName" : req.body.drinkName,
        "UserMessage" : req.body.userMessage
        }
		console.log("Student:" + student);
        var url = 'mongodb://localhost:27017';
        MongoClient.connect(url, function (err, client) {
        if (err) {
          return res.send({"result" : "failed"});
        } else {
          var db = client.db('OakesDB');
		  var collection = db.collection('Students');
            collection.insertOne(student, function (err, res){
			  if (err) throw err;
              client.close();  //Close the client connection
            }); //insertOne code block
            return res.send({"result" : "passed"}); //respond the create operation worked
         }  //close if
        }); //close function
    } //close elses
  } catch (error) {
	  console.error(error);
  } //Close the catch code block
}); //Close app.get
//==========================================================================================
//Read All Documents Function from MongoDB using a URL Request GET HTTP Method NodeJS
//==========================================================================================
app.get("/ReadAll", function(req, res) {
try{
   var mongodb = require('mongodb');
   var MongoClient = mongodb.MongoClient;
   res.header("Access-Control-Allow-Origin", "*");
   var url = 'mongodb://localhost:27017';
   MongoClient.connect(url, function (err, client) {
    if (err) {
       return res.send({"result" : "failed"});
    } else {
	  var db = client.db('OakesDB');
	  var collection = db.collection('Students');
      collection.find({}).toArray(function(err, students){
		    if (err) throw err;
            client.close();
			console.log(students)
            return res.send(students);
       });
    } //close else
   }); //close connect function
  } catch (error) {
	  console.error(error);
  } //Close the catch code block
});//Close app.get

//==========================================================
//Start the listening NodeJS Server on Networking Port 3000
//==========================================================
try{
  var server = app.listen(3000, function () {
    console.log("Listening on port %$...", server.address().port);
  })
} catch (error) {
	  console.error(error);
} //Close the catch code block
