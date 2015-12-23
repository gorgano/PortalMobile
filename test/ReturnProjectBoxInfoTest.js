process.env.NODE_ENV = 'test';

var assert = require('assert');

var chai = require("chai")
var expect = chai.expect;
chai.should();

var sinon = require('sinon');

var http = require("http");

var MongoAccessor = require('../MongoAccessor.js');
var oConfig = require("../QueueConfig.js");


describe('APIServices', function () {
    describe("ReturnProjectBoxInfo", function () {
        
        it("should write expected result to http stream", function (done) {
            //What we expect to be returned 
            var oExpected = {'some':'string'}
            var strExpected = JSON.stringify(oExpected);
            
            //replace the GetProjectBoxList function with one that returns a known value
            sinon.stub(MongoAccessor, "GetProjectBoxList", function (s) {
                var EventEmitter = require('events').EventEmitter;
                var emitter = new EventEmitter();
            
                process.nextTick(function () {
                    emitter.emit("data", oExpected);
                    emitter.emit("close");
                });

                return emitter;
            });
            
            //mock response object
            var mockResponse = new function(){
                var _written = '';
                
                this.write = function (s) { 
                    _written += s; 
                };
                //We know things are 'done' when the response is 'closed'.
                // Use this is the test wrapup method
                this.end = function () { 
                    expect(_written).to.equal(strExpected);
                    done(); //signal unit test is complete and can exit
                };
            }

            var service = require("../ServiceDefintions.js").filter(function (item) {
                return item.name == "/AllProjects";
            })[0];

            //Call the service
            service.fn(new Object(), mockResponse);
        });
    });
});