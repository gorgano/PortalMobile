DeploymentPortalNode
==============

This is DeploymentPortalNode.


For this to work, you will need an instance of mongod running on the default port.

You will also need a record in the database with the proper ID.  A dummy record is as follows:

db.ProjectBoxList.save({_id:'CurrentProjectBoxList',boxId:1,"field":"someting"});

