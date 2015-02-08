// create the angular app
var angularExpress = angular.module('angularExpress', ['ngRoute']);
angularExpress.config(function ($routeProvider) {
	$routeProvider
	.when('/',
	{
		templateUrl: 'views/login.html'
	})
	.when('/dashboard',
	{
		templateUrl: 'views/dashboard.html'
	})
	.when('/user/:id',
	{
		templateUrl: 'views/user.html'
	})
	.otherwise({
		redirectTo:'/'
	});
});
// create the angular controller
angularExpress.controller('MainCtrl', function($scope, MainFactory,$location) {
	$scope.completed_tasks=JSON.parse(localStorage['completed_tasks']), 
	$scope.pending_tasks=JSON.parse(localStorage['pending_tasks']);
	console.log($scope.pending_tasks)
	$scope.logged_in_user = localStorage['name'];
	MainFactory.getUsers(function(data) {
		console.log("data in the controller", data)
		$scope.users = data
	});
	MainFactory.getInitialTasks(function(data) {
	 	$scope.tasks = data
	 });
	$scope.addUser = function() {
		MainFactory.addUser($scope.new_user, function(user){
		localStorage['name'] = $scope.new_user;
		localStorage['id']=user.id.replace(/(^"|"$)/g, '');
		$location.path('/dashboard');
		console.log('localStorage: ',localStorage['id'],localStorage['name']);
		})
	}
	$scope.addTask = function() {
		console.log('scope.new_user: ',$scope.new_user)
		MainFactory.addTask($scope.new_task, $scope.new_description,localStorage['name'],$scope.new_user)
		$scope.tasks = MainFactory.getList();
		console.log('BLAAAAA',$scope.tasks );
	



		// $scope.tasks = MainFactory.getTasks();
	}
	$scope.getProfile = function(id) {
		MainFactory.getProfile(id,function(tasks){
		localStorage['completed_tasks']=JSON.stringify(tasks);
		console.log('ugg',localStorage['completed_tasks'])
		console.log('completed RARA: ', $scope.completed_tasks )
	}, function(tasks2) {
		localStorage['pending_tasks']=JSON.stringify(tasks2);
		console.log('ugg',localStorage['pending_tasks'])
		console.log('pending RARA: ', $scope.pending_tasks)
		$location.path('/user/'+id);
	})	
	}
})

angularExpress.factory('MainFactory', function($http) {
	var tasks = [];
	var users = [];
	var logged_in_user = [];
	var factory = {};
	var userid = '';
	factory.addUser = function(a,callback){
		$http.post('/user/create', {name: a})
		.success(function(output){ 
			logged_in_user = {name: a, id: output}
			users.push({name: a});
			callback(logged_in_user);
		})
	}
	factory.addTask = function(task,desc,created,name,callback) {
		console.log('userid',userid);
		$http.get('/userid/'+ name).success(function(output){
			userid = output._id;
			console.log('hmmm',output._id)
			$http.post('/task/create', {new_task: task, new_description: desc, created_by: created,user: name, user_id: userid }).success(function(output) {
				console.log('task: ',output)
				if(name === localStorage['name']){
					tasks.push(output);	
				}
					
			})
		})
	}
	factory.getUsers = function(callback) {
		$http.get('/users').success(function(output) {
			console.log("output in factory", output)
			users = output
			console.log('users: ', users)
			callback(users);
		})
	}
	factory.getInitialTasks = function(callback) {
		$http.get('/tasks/'+localStorage['id']).success(function(output) {
			topics = output
			console.log('topics: ', topics)
			callback(topics);
		})
	}
	factory.getList = function() {
		return tasks;
	}

	factory.getProfile = function(id,callback,callback2) {
		$http.get('/tasks/done/'+id).success(function(output) {
			console.log('completed tasks: ', output)
			callback(output)
		})
		$http.get('/tasks/pending/'+id).success(function(output2) {
			console.log('pending tasks: ', output2)
			callback2(output2)
		})
	}
	return factory;
})