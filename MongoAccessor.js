var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

module.exports = {
    create: function (strMongoConnectionURL) {
        var oAccessor = new MongoAccessor();
        oAccessor.init(strMongoConnectionURL);
        return oAccessor;
    }
}

function MongoAccessor() {
    
    var MongoURL;
    var fnPrivate = new Object(); //private function storage
    var oEmitter = new EventEmitter(); //need to encapsolate this better

    this.init = function (strMongoConnectionURL) { 
        MongoURL = strMongoConnectionURL;    
    };
    this.GetProjectBoxList = function () {
        fnPrivate.MongoConnect(fnPrivate.GetProjectBoxListCallback);
        return oEmitter;
    };
    
    
    
    /*****************Private functions****************/
    fnPrivate.MongoConnect = function (fnCallback) {
        MongoClient.connect(MongoURL, fnCallback);
    };
    fnPrivate.GetProjectBoxListCallback = function (err, db) {
        assert.equal(null, err); //check good connection to database
        
        console.log('Retrieving Record....\n');
        
        db.collection("ProjectBoxList").findOne({ _id: 'CurrentProjectBoxList' }, function (err, document) {
            //assert.equal(null, err); //throw if there is an error
            //response.end(JSON.stringify(document));
            //var oEmitter = new EventEmitter();
            
            console.log("Found data to return.");
            
            if (err != null)
                oEmitter.emit('error', err);
            else
                oEmitter.emit('data', document);
            
            db.close();
            
            oEmitter.emit("close"); //signal to listener that we are done
            
            console.log("Done pulling data");
            
        });
    };
}