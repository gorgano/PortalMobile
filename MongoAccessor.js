﻿var MongoClient = require('mongodb').MongoClient;
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
    //var fnPrivate = new Object(); //private function storage
    var oEmitter = new EventEmitter(); //need to encapsolate this better
    
    this.init = function (strMongoConnectionURL) {
        MongoURL = strMongoConnectionURL;
    };
    
    this.GetProjectBoxList = function () {
        var fnPrivate = new MongoPrivates(MongoURL, oEmitter);
        
        fnPrivate.MongoConnect(fnPrivate.GetProjectBoxListCallback);
        
        return oEmitter;
    };
    
}

/*****************Private functions****************/
function MongoPrivates(MongoURL, oEmitter) {
    var MongoURL = MongoURL;
    var oEmitter = oEmitter;

    this.MongoConnect = function (fnCallback) {
        MongoClient.connect(MongoURL, fnCallback);
    };

    this.GetProjectBoxListCallback = function (err, db) {
        //assert.equal(null, err); //check good connection to database
        if (err != null) {
            console.log("Unable to connect to mongo database!");
            oEmitter.emit("error", err);
            oEmitter.emit("close");
        } else {
            console.log('Retrieving Record....\n');
            
            db.collection("ProjectBoxList").findOne({ _id: 'CurrentProjectBoxList' }, function (err, document) {
                console.log("Found data to return.");
                
                if (err != null)
                    oEmitter.emit('error', err);
                else
                    oEmitter.emit('data', document);
                
                db.close();
                
                oEmitter.emit("close"); //signal to listener that we are done
                
                console.log("Done pulling data");
            
            });
        }
    };
}