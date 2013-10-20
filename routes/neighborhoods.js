var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

database = null;

mongo.connect(process.env.MONGOLAB_URI, {}, dbConnectionOpen);

function dbConnectionOpen(err, db) {
    database = db;
    if(!err) {
        console.log("Connected to 'neighborhooddb' database");
        db.collection('neigborhoods', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'neighborhoods' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
}

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving neighborhood: ' + id);
    database.collection('neighborhoods', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    database.collection('neighborhoods', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addNeighborhood = function(req, res) {
    var neighborhood = req.body;
    console.log('Adding neighborhood: ' + JSON.stringify(neighborhood));
    database.collection('neighborhoods', function(err, collection) {
        collection.insert(neighborhood, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateNeighborhood = function(req, res) {
    var id = req.params.id;
    var neighborhood = req.body;
    delete neighborhood._id;
    console.log('Updating neighborhood: ' + id);
    console.log(JSON.stringify(neighborhood));
    database.collection('neighborhoods', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, neighborhood, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating neighborhood: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(neighborhood);
            }
        });
    });
};

exports.deleteNeighborhood = function(req, res) {
    var id = req.params.id;
    console.log('Deleting neighborhood: ' + id);
    database.collection('neighborhoods', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var neighborhoods = [
    {
        name: "Downtown",
        metro: "Austin",
        state: "Texas",
        country: "USA",
        description: "Shit is dope.",
        picture: "saint_cosme.jpg"
    },
    {
        name: "North Loop",
        metro: "Austin",
        state: "Texas",
        country: "USA",
        description: "Placeholder.",
        picture: "waterbrook.jpg"
    }];

    database.collection('neighborhoods', function(err, collection) {
        collection.insert(neighborhoods, {safe:true}, function(err, result) {});
    });

};