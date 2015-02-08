// set up the express app
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
// body parse allows us to use req.body and get post data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// point the express app to the static files folder so it can set up a static file server
app.use(express.static(path.join(__dirname, 'client')));


// SET UP THE DATABASE STUFF
// now we need to add in mongoose to be able to connect to the DB
var mongoose = require('mongoose');
// connect to the db
mongoose.connect('mongodb://localhost/bucketlist');
// create the topic schema
var TaskSchema = new mongoose.Schema({
	task: String,
	description: String,
	user: String,
	user_id: String,
	created_by: String,
	created_at: {type: Date, default: new Date},
	completed: {type: Boolean, default: false }
})
var UserSchema = new mongoose.Schema({
	name: String,
})
// create the model using the schema and store it to Topic so that we can use it to run mongodb commands
mongoose.model('Task', TaskSchema)
var Task = mongoose.model('Task')
mongoose.model('User', UserSchema)
var User = mongoose.model('User')

//GETS
app.get('/users', function (req, res) {
	User.find({}, function(err, results) {
	 	res.json(results);
	})
})
app.get('/user/:id', function (req, res) {
	Task.find({user_id: req.params.id}, function(err, results) {
		console.log('profile tasks: ', results);
	 	res.json(results);
	})
})
app.get('/userid/:id', function (req, res) {
	User.findOne({name:req.params.id}, function(err, results) {
	 	res.json(results);
	})
})
app.get('/tasks/:id', function (req, res) {
	Task.find({user_id: req.params.id}, function(err, results) {
		console.log('tasks: ',results)
	 	res.json(results);
	})
})
app.get('/tasks/done/:id', function (req, res) {
	Task.find({user_id: req.params.id, completed: true}, function(err, results) {
		console.log('tasks done: ',results)
	 	res.json(results);
	})
})
app.get('/tasks/pending/:id', function (req, res) {
	Task.find({user_id: req.params.id, completed: false}, function(err, results) {
		console.log('tasks pending: ',results)
	 	res.json(results);
	})
})
app.get('/blah/done/:id', function (req, res) {
	Task.find({user_id: req.params.id, completed: true}, function(err, results) {
		console.log('tasks done: ',results)
	 	res.json(results);
	})
})
app.get('/blah/pending/:id', function (req, res) {
	Task.find({user_id: req.params.id, completed: false}, function(err, results) {
		console.log('tasks pending: ',results)
	 	res.json(results);
	})
})
//POSTS
app.post('/user/create', function(req, res){
	new_user = new User({name: req.body.name})
	new_user.save(function(err,results){
		console.log('new_user: ', new_user);
		res.json(new_user.id);
	})
})
app.post('/task/create', function(req, res){
	new_task = new Task({task: req.body.new_task, description:req.body.new_description,created_by: req.body.created_by,user: req.body.user, user_id: req.body.user_id })
	new_task.save(function(err,results){
		console.log('new_task: ', new_task)
		res.json(results);
	})
})
// TELL THE SERVER TO LISTEN
app.listen(3000, function() {
	console.log("port 3000 is open for business")
})