// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var path       = require('path');
var fs         = require('fs');
// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
var Tasks     = require('./app/models/task');

// file watching
fs.watch('public', function (event, filename) {
    console.log('event is: ' + event);
    if (filename) {
        console.log('filename provided: ' + filename);
    } else {
        console.log('filename not provided');
    }
});


// ROUTES FOR OUR API
// =============================================================================

// create our routers
var api_router = express.Router();

// middleware to use for all requests
api_router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening in the api.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
api_router.get('/', function(req, res) {
	console.log('foobar');
	res.json({ message: 'hooray! welcome to our api!' });	
});


// on routes that end in /task
// ----------------------------------------------------
api_router.route('/tasks')

	// create a task (accessed at POST http://localhost:8080/tasks)
	.post(function(req, res) {
		
		var task = new Task();		// create a new instance of the Task model
		task.name = req.body.name;  // set the tasks name (comes from the request)

		task.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Task created!' });
		});

		
	})

	// get all the tasks (accessed at GET http://localhost:8080/api/tasks)
	.get(function(req, res) {
		Task.find(function(err, tasks) {
			if (err)
				res.send(err);

			res.json(tasks);
		});
	});

// on routes that end in /tasks/:task_id
// ----------------------------------------------------
api_router.route('/tasks/:task_id')

	// get the task with that id
	.get(function(req, res) {
		Task.findById(req.params.task_id, function(err, task) {
			if (err)
				res.send(err);
			res.json(task);
		});
	})

	// update the task with this id
	.put(function(req, res) {
		Task.findById(req.params.task_id, function(err, task) {

			if (err)
				res.send(err);

			task.name = req.body.name;
			task.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Task updated!' });
			});

		});
	})

	// delete the task with this id
	.delete(function(req, res) {
		Task.remove({
			_id: req.params.task_id
		}, function(err, task) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', api_router); // all routes made with this router will be available @ /api/... etc

// Setup static HTML file dir
app.use(express.static(__dirname + "/public")); //use static files in ROOT/public folder
app.use("/public", express.static(path.join(__dirname, 'public')));


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
