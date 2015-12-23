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
            var strExpected = "{'some':'string'}";
            
            //replace the GetProjectBoxList function with one that returns a known value
            sinon.stub(MongoAccessor, "GetProjectBoxList", function (s) {
                var EventEmitter = require('events').EventEmitter;
                var emitter = new EventEmitter();
            
                process.nextTick(function () {
                    emitter.emit("data", strExpected);
                    emitter.emit("done");
                });

                return emitter;
            });
            
            //mock response object
            var mockResponse = new function(){
                this.written = '';
                this.me = this;
                this.write = function (s) { me.written += s; };
                this.end = function () { };
            }

            var service = require("../ServiceDefintions.js").filter(function (item) {
                return item.name == "/AllProjects";
            });

            service.fn(new object(), mockResponse);

            expect(mockResponse.written).to.equal(strExpected);

        });
    });
});