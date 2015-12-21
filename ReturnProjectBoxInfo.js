var http = require('http');
var dispatcher = require('httpdispatcher');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var JSONStream = require('JSONStream');

/********config *******/
var strMongoURL = 'mongodb://localhost/DeploymentPortalMobile';
/**********************/



http.createServer(function (request, response) {
	try
	{
		console.log("Got Request for: " + request.url);
		dispatcher.dispatch(request, response);
	}
	catch( e )
	{
		console.log(e);
	}
}).listen(1337, "127.0.0.1");

console.log("Started server on port 1337\nUsing the following to connect to mongo: " + strMongoURL);


dispatcher.setStatic("resources");


dispatcher.onGet("/AllProjects", function (request, response)
{
	console.log("Pulling mongo data....");
	MongoClient.connect(strMongoURL, function(err, db) 
	{
		assert.equal(null, err); //check good connection to database

                                
        response.writeHead(200, {'Content-Type': 'text/plain'});

        
        response.write('Retrieving Record....\n');

        db.collection("ProjectBoxList").find({ _id: 'CurrentProjectBoxList' })
            .stream()
            .pipe(JSONStream.stringify())
            .pipe(response);

        //respone.end("Done");

        db.close();

        console.log("Done pulling data");

	});

});

