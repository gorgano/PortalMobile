var http = require('http');
var dispatcher = require('httpdispatcher');

var oConfig = require("./QueueConfig.js");

var arrServices = require("./ServiceDefintions.js"); //.getServiceDefintions();

http.createServer(function (request, response) {
    try {
        console.log("Got Request for: " + request.url);
        dispatcher.dispatch(request, response);
    }
	catch (e) {
        console.log(e);
    }
}).listen(oConfig.intWebServerPort, oConfig.strWebServerIP);

console.log("Starting server on port: " + oConfig.intWebServerPort +
    "\nUsing the following to connect to mongo: " + oConfig.strMongoURL);

//Define static files
dispatcher.setStatic("resources");

//Register reach service that is defined.
for (var u = 0; u < arrServices.length; ++u) {
    var oService = arrServices[u];

    console.log("Registering service: " + oService.name);
    
    dispatcher.onGet(oService.name, oService.fn);
}
        




