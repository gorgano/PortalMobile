
//Service definitions to export and use.
// List each defintion as a new array object.

module.exports = [
    {
        name: "/AllProjects", 
        fn: function (request, response) {
            
            //OK to perform requires multiple times.  After
            // included and compiled, it is just a call to an existing
            // object.
            //Need to find solution for pathing.
            var MongoAccessor = require('./MongoAccessor.js');
            var oConfig = require("./QueueConfig.js");

            console.log("Pulling mongo data....");
            
            //var oMongo = MongoAccessor.create(strMongoURL);
            //var oEmit = oMongo.GetProjectBoxList();
            var oEmit = MongoAccessor.GetProjectBoxList(oConfig.strMongoURL);
            
            oEmit.on("error", function (error) {
                response.write(JSON.stringify(error));
            });
            oEmit.on("data", function (document) {
                response.write(JSON.stringify(document));
            });
            oEmit.on("close", function () {
                response.end();
            });
        }
    }
];