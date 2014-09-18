
angular.module('vs.auth', ['ng', 'ngRoute', 'ngResource', 'ngCookies'])


	// AUTH API MANAGEMENT 

	.factory('AuthIC', function($q, $location){
		return {
			'response': function(response){
				console.log(response);
				return response.resource;	// || $q.when(response);
			},
			'responseError': function(response){
				return $location.path('/');
			}
		}
	})
	
	.factory('LoAPI', function($resource, $cookies){
		var url = {
			host: 'https://host1.myarangodb.com:2003',
			path: 'vs_API',
			version: 'v0',
			suffix: ''
		};
		
		var apiSource = url.host + '/' + url.path + '/' + url.version;
		
		var pipe = {
			'AuthRes': $resource(apiSource + '/auth/:verb', {}, { 
				login:{ method: 'POST', params: { verb: 'login'}}, 
				logout: { method: 'POST', params: { verb: 'logout'}},
				register: { method: 'POST', params: { verb: 'register'}},
				changePassword: { method: 'POST', params: { verb: 'changePassword'}}
			}),
			'PreAuth': $resource(apiSource + '/user/signup', {}, { 
				save:{ method: 'POST'}
			})
		};
		
		return pipe;
	})
	
		
	.service('Auth', function ($rootScope, $q, $timeout, $route, $routeParams, $location, $cookies, LoAPI) {	//Session
			
		$rootScope.Auth = {
		
			login: function (un, pw) {
						$rootScope.source = null;
						LoAPI.AuthRes.login(JSON.stringify({username: un, password: pw}), 
							function(response){
								$rootScope.loggedIn = true;
								$rootScope.user = response.user;
								$cookies['x-vitalsana'] = response.session;
								
								console.log($rootScope.user);
								console.log($rootScope.source);
								$rootScope.$broadcast('authenticated', null);
								
							}, function (error) {
								$rootScope.$broadcast('authFailed', error);
							});
			},
			logout: function(){
						LoAPI.AuthRes.logout( function(){
								$cookies['x-vitalsana'] = null;
								$rootScope.loggedIn = false;
								$rootScope.user = {};
								$rootScope.$broadcast('loggedout', true );
						});
			},
			changePassword: function(id, pw){
						LoAPI.AuthRes.changePassword(JSON.stringify({identifier: id, password: pw}),
							function(response){
								$rootScope.$broadcast('passwordChanged', true);
							}, function(error){
								$rootScope.$broadcast('passwordChangedFailed', error);
							});
			},
			register: function(reg){
						console.log(reg);
						if(reg.password===reg.password2){
							LoAPI.AuthRes.register(JSON.stringify({
								firstName: reg.firstName,
								lastName: reg.lastName,
								username: reg.username,
								password: reg.password
							}),
							function(response){
								console.log(response);
								$rootScope.user = response.user;
								return $rootScope.Auth.login(response.user.identifier, reg.password);
							}, function(error){
								$rootScope.$broadcast('registeredFailed', error);
							});
						} else {
							$rootScope.$broadcast('registeredFailed', 'password entries do not match');
						}
			},
			pregister: function(ident){
						LoAPI.PreAuth.save(JSON.stringify(ident), 
							function(response){
								$rootScope.$broadcast('signedup', response.preuser);
							}, function(error){
								$rootScope.$broadcast('signedupFailed', error);
							})
						
			}
	
		};

	});
	
	
