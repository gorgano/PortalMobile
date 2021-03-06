﻿var MongoClient = require('mongodb').MongoClient;
var EventEmitter = require('events').EventEmitter;

module.exports = {
    //Create and return a new instance of the MongoAccessor
    create: function (strMongoConnectionURL) {
        return (new MongoAccessor()).init(strMongoConnectionURL);
    },
    //Conveniance 'static' function to instantiate a new instance of
    // MongoAccessor, call the GetProjectBoxList method and return the
    // event processor.
    GetProjectBoxList: function (strMongoConnectionURL) {
        var oAccessor = (new MongoAccessor()).init(strMongoConnectionURL);
        return oAccessor.GetProjectBoxList();
    }
};

//Provides exposure to override functionality when unit testing
if (process.env.NODE_ENV === 'test') {
    module.exports.createWithMongoQueryOverride = function (strMongoConnectionURL, fnMongoQueryOverride) {
        return (new MongoAccessor()).init(strMongoConnectionURL, fnMongoQueryOverride);
    }
}

function MongoAccessor() {
    
    var _MongoURL;
    var _oInstance = this;
    var _fnMongoQuery = MongoQuery;

    this.init = function (strMongoConnectionURL, fnMongoQueryOverride) {
        _MongoURL = strMongoConnectionURL;
        
        if (fnMongoQueryOverride != null)
            _fnMongoQuery = fnMongoQueryOverride;

        return _oInstance;
    };
    
    this.GetProjectBoxList = function () {
        var oEmitter = new EventEmitter(); 
        
        var oQuery = (new _fnMongoQuery).init(
            _MongoURL, 
            "findOne", 
            "ProjectBoxList", 
            { _id: 'CurrentProjectBoxList' }
        );
        
        var r = oQuery.MongoRun();

        r.on('error', function (e) {
            oEmitter.emit('error', e);
            oEmitter.emit('close');
        });
        r.on('data', function (d) {
            oEmitter.emit('data', d);
            oEmitter.emit('close'); //only need to wait for data, single return value
        });

        return oEmitter;
    };
    
}

function MongoQuery() {
    var _strMongoURL;
    var _strQueryType;
    var _strCollection;
    var _oQuery;
    var _oInstance = this;
    var _oEmitter = new EventEmitter();
    var _fnPrivate = new Object();
    

    //Initialize the current object
    this.init = function (MongoURL, strQueryType, strCollection, oQuery) {
        _strMongoURL = MongoURL;
        _strQueryType = strQueryType;
        _strCollection = strCollection;
        _oQuery = oQuery;

        return _oInstance;
    };
    
    this.MongoRun = function () {
        var fnCallback = _fnPrivate.FindOne;

        MongoClient.connect(_strMongoURL, fnCallback);
        
        return _oEmitter;
    };
    
    _fnPrivate.HandleError = function (e) {
        console.log("Error triggered: " + JSON.stringify(e));
        
        _oEmitter.emit("error", e);
        
        _oEmitter.emit("close");
    };

    _fnPrivate.FindOne = function (err, db) {
        try {
            if (err != null) throw err;
            
            console.log('Retrieving Record....\n');
            
            db.collection(_strCollection).findOne(_oQuery, function (err, document) {
                console.log("Found data to return.");
                
                if (err != null) throw err;
                    
                _oEmitter.emit('data', document);
                
                db.close();
                
                _oEmitter.emit("close"); //signal to listener that we are done
                
                console.log("Done pulling data");
            
            });
        } catch (e) {
            _fnPrivate.HandleError(e);
        }
    };
}