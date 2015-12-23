process.env.NODE_ENV = 'test';

var assert = require('assert');

//var should = require('should');
var chai = require("chai")
var expect = chai.expect;
chai.should();

var EventEmitter = require('events').EventEmitter;
var sinon = require('sinon');

var MongoAccessor = require('../MongoAccessor.js');

describe('MongoAccessor', function () {
    describe('when executing GetProjectBoxList', function () {
        it('should emit a json shape', function (done) {
            //replace init function and inject mock MongoQuery object
            var oMongo = MongoAccessor.createWithMongoQueryOverride("mongoString", MockMongoQuerySuccess);
                        
            var oExpected = (new MockMongoQuerySuccess).oExpectedSuccess;
            
            //Call GetProjectBoxList and listen for events
            var r = oMongo.GetProjectBoxList();
            
            r.on('data', function (d) {
                expect(d).to.deep.equal(oExpected);
                done();
            });
        });
        
        it('should emit an error when there is a problem connecting to the database', function (done) {
            //replace init function and inject mock MongoQuery object
            var oMongo = MongoAccessor.createWithMongoQueryOverride("mongoString", MockMongoQueryError);
            
            var oExpected = (new MockMongoQueryError).oExpectedError;
            
            //Call GetProjectBoxList and listen for events
            var r = oMongo.GetProjectBoxList();
            
            r.on('error', function (d) {
                expect(d).to.deep.equal(oExpected);  
                done();
            });
        });
    });
});



function MockMongoQuerySuccess() {
    
    var me = this;
    
    this.oExpectedSuccess = { _id: 'CurrentProjectBoxList', boxId: 1, "field": "someting" };
    
    this.init = function () {
        return me;
    };
    
    this.MongoRun = function () {
        var oEmitter = new EventEmitter();
        
        //Stall out the emition, to allow the function to return
        // a reference to the emitter.
        process.nextTick(function () {
            oEmitter.emit("data", me.oExpectedSuccess);
            oEmitter.emit("close");
        }, 10);
        
        return oEmitter;
    };
}

function MockMongoQueryError() {
    
    var me = this;
    
    this.oExpectedError = { "name": "MongoError", "message": "connect ECONNREFUSED 127.0.0.1:27017" };
    
    this.init = function () {
        return me;
    };
    
    this.MongoRun = function () {
        var oEmitter = new EventEmitter();
        
        //Stall out the emition, to allow the function to return
        // a reference to the emitter.
        process.nextTick(function () {
            oEmitter.emit('error', me.oExpectedError);
            oEmitter.emit('close');
        }, 10);
        
        return oEmitter;
    };
}
