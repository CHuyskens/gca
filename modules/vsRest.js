

angular.module('vs.rest', ['ng', 'ngResource', 'ngCookies'])

.factory('ICapi', function($q){
	var interceptor = {
		'response': function(response){
			return response.resource;
		},
		'responseError': function(response){
			console.log(response);
		}
	};
	return interceptor;
})

.factory('API', function($resource, $cookies){
	var url = {
		host: 'https://host1.myarangodb.com:2003',
		path: 'vs_API',
		version: 'v0'
	};
	
	var apiSource = url.host + '/' + url.path + '/' + url.version;
	
	var pipe = {
		'XXX_endpoint_XXX': $resource(apiSource + '/prefix/endpoint', {}, { 
			get: { method: 'get', headers: { 'x-vitalsana': $cookies['x-vitalsana']}  }, 
			query: { method: 'get', headers: { 'x-vitalsana': $cookies['x-vitalsana']},isArray: true},
			save: { method: 'post', headers: {'x-vitalsana': $cookies['x-vitalsana']}},
			update: { method: 'put',  headers: { 'x-vitalsana': $cookies['x-vitalsana']}},
			remove: { method: 'delete', headers: { 'x-vitalsana': $cookies['x-vitalsana']}}
		})
	};
		
	return pipe;
})

.factory('XAPI', function(API){
	var dataModel = {};
	
	return dataModel;
});