var http = require('http');
var dispatcher = require('httpdispatcher');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var MongoAccessor = require('./MongoAccessor.js');


/********config *******/
var strMongoURL = 'mongodb://localhost/DeploymentPortalMobile';
/**********************/

//var oMongo = MongoAccessor.create(strMongoURL);

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
    
    //var oMongo = MongoAccessor.create(strMongoURL);
    //var oEmit = oMongo.GetProjectBoxList();
    var oEmit = MongoAccessor.GetProjectBoxList(strMongoURL);
    
    oEmit.on("error", function (error) {
        response.write(JSON.stringify(error));
    });
    oEmit.on("data", function (document) {
        response.write(JSON.stringify(document));
    });
    oEmit.on("close", function () {
        response.end();
    });
    
    
 //   MongoClient.connect(strMongoURL, function (err, db) 
	//{
	//	assert.equal(null, err); //check good connection to database

                                
 //       response.writeHead(200, {'Content-Type': 'text/plain'});

        
 //       console.log('Retrieving Record....\n');


 //       db.collection("ProjectBoxList").findOne({ _id: 'CurrentProjectBoxList' }, function (err, document) {
 //           assert.equal(null, err);
            
 //           //console.log(JSON.stringify(document));

 //           response.end(JSON.stringify(document));
            
 //           db.close();
            
 //           console.log("Done pulling data");
 //       });
        
 //       //var strData = '';

 //       //var stream = db.collection("ProjectBoxList").find({ _id: 'CurrentProjectBoxList' })
 //       //    .stream();
 //       //    //.pipe(JSONStream.stringify())
 //       //    //.pipe(response);
        
 //       //stream.on("data", function (data) {
 //       //    console.log(JSON.stringify(data));
 //       //    //response.write(JSON.stringify(data));

 //       //    strData += JSON.stringify(data);
 //       //});
 //       //stream.on("close", function () {
 //       //    console.log("Done pulling data");
            
 //       //    db.close();
            
 //       //    response.end(strData);
 //       //});

 //       //respone.end("Done");

 //       //db.close();

 //       //console.log("waiting for data");

	//});
    
});




