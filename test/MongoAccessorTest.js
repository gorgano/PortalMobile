var assert = require('assert');
var should = require('should');
var EventEmitter = require('events').EventEmitter;
var MongoAccessor = require('../MongoAccessor.js');


describe('MongoAccessor', function () {
    describe('when executing GetProjectBoxList', function () {
        it('should emit a json shape', function (done) {
            //replace init function and inject mock MongoQuery object
            var oMongo = MongoAccessor.create("mongoString");
            oMongo.init = function () {
                _fnMongoQuery = MongoQueryMock;
            };
            oMongo.init();
            
            var oExpected = (new MongoQueryMock).oExpectedSuccess;
            
            //Call GetProjectBoxList and listen for events
            var r = oMongo.GetProjectBoxList();
            
            r.on('data', function (d) {
                d.should.deepEqual(d, oExpected, "Did not return expected successful shape");
                done();
            });
        })
        
        //it.skip('Test 2', function () {
        //    assert.ok(1 === 1, "This shouldn't fail");
        //    assert.ok(false, "This should fail");
        //})
    });
});



function MongoQueryMock(booSuccess) {
    
    var me = this;
    
    this.oExpectedSuccess = { _id: 'CurrentProjectBoxList', boxId: 1, "field": "someting" };
    this.oExpectedError = { "name": "MongoError", "message": "connect ECONNREFUSED 127.0.0.1:27017" };

    this.init = function () { };
    
    this.MongoRun = function () {
        if (booSuccess)
            return success();
        else
            return error();
    };

    function success() {
        var oEmitter = new EventEmitter();
        
        //Stall out the emition, to allow the function to return
        // a reference to the emitter.
        process.nextTick(function () {
            oEmitter.emit("data", me.oExpectedSuccess);
            oEmitter.emit("close");
        }, 10);

        return oEmitter;
    }
    
    function error() {
        var oEmitter = new EventEmitter();
        
        //Stall out the emition, to allow the function to return
        // a reference to the emitter.
        process.nextTick(function () {
            oEmitter.emit('error', me.oExpectedError);
            oEmitter.emit('close');
        }, 10);

        return oEmitter;
    }
}
