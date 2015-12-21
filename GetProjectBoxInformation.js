var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var fs = require('fs');

/***************** Config **************************/
var strMongoURL = 'mongodb://localhost/DeploymentPortalMobile'; 

var strProjectBoxHost = 'localhost';
var strProjectBoxURL = '/deploymentportal/services/router.php';
//var strProjectBoxURL = '/PortalMobile/services/data/ProjectList_full.json';
//var strProjectBoxURL = '/PortalMobile/NodeApplets/projectBox.json';
var strProjectBoxPayload = '{"action":"AppQuickView","method":"getAppData","data":[{"appId":"","page":1}],"type":"rpc","tid":1}';
var oProjectBoxConnectionOptions = {
    hostname: strProjectBoxHost,
    port: 80,
    path: strProjectBoxURL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': strProjectBoxPayload.length
    }
};
/****************************************************/


var req = http.request(oProjectBoxConnectionOptions, function(oResponse){
    
    //Write to console
    //oResponse.pipe(process.stdout);
    
    //Write to a file
    //oResponse.pipe(fs.createWriteStream('projectBox.json'));

    var strResponse='';

    //console.log('STATUS: ' + oResponse.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(oResponse.headers));

    oResponse.setEncoding('utf8');

    //Read the data one chunk at a time
    oResponse.on('data', function (chunk) {
        strResponse += chunk;
    });

    //When done reading, process the information
    oResponse.on('end', function () {
        var oProjectBoxList = JSON.parse(strResponse);

        //Add an _id
        oProjectBoxList._id = "CurrentProjectBoxList";
        oProjectBoxList.lastDownloadDate = (new Date).getTime();

        //Connect to Mongo and write the file
        MongoClient.connect(strMongoURL, function (err, db) {
            assert.equal(null, err); //check good connection to database

            //Perform insert and close database connection
            db.collection('ProjectBoxList').save(oProjectBoxList, function (err, result) {
                assert.equal(err, null); //throw if there were any insert issues

                //Successful insert into database
                console.log("Done inserting into database");

                //Close connection to database
                db.close();
            });
        });
    });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.write(strProjectBoxPayload);

req.end();




