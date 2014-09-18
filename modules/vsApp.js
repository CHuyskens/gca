
var app = angular.module('vs.app', [
	'ngRoute', 
	'ngCookies', 
	'ngResource', 
	'ngCrossfilter', 
	'vs.auth', 
	'vs.rest'
]);

// ROUTER /////////////////////////////
app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        // ROOT
		$routeProvider.when('/', {
            controller: 'index.controller',
            templateUrl: 'views/index.html'
		}).when('/register', {
			controller: 'register.controller',
            templateUrl: 'views/register.html'
		}).when('/auth', {
			controller: 'auth.index.controller',
            templateUrl: 'auth/views/index.html'
		});
    }
]);


// GLOBAL HTTP CONFIG ///////////////////
app.config(function($httpProvider) {
	
	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.responseType = 'json';
	$httpProvider.defaults.headers.common = {
		'Content-Type': 'application/json',
		'x-requested-with': 'XMLHttpRequest',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		'x-vitalsana': false
	};
});

// GLOBAL INDEX CONTROLLER //////////////
app.controller('main.controller', function($scope, $rootScope, $q, $timeout, $filter, $route, $routeParams, $location, Auth, API){
	$scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
	
	$scope.$on('authenticated', function(event, args){
		return $location.path('/auth');
	});

});

app.controller('index.controller', function($scope, $rootScope, $q, $timeout, $filter, $route, $routeParams, $location, Auth, API){

});


app.controller('register.controller', function($scope, $rootScope, $q, $timeout, $filter, $route, $routeParams, $location, Auth, API){
	
	$scope.reg = {};
	
	$scope.register = function(){
		var reg = $scope.reg;
		console.log(reg);
		$rootScope.Auth.register(reg);
	}
	
});

app.controller('auth.index.controller', function($scope, $rootScope, $q, $timeout, $filter, $route, $routeParams, $location, Auth, API){
	(!$rootScope.loggedIn) ? $location.path('/') : null;
	

});