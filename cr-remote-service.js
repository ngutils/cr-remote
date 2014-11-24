angular.module('cr.remote-service', [])
.service('crRemoteService', ['$q', '$http', '$crRemoteService', function($q, $http, $crRemoteService) {
    
    //basic configuration
    this._config = {
        id: false, //id for get, delete, post calls
        params: false, //added as ?...
        resourceName: "", // radix (endpoint + resourceName)
        endpoint: "default", // name of endpoint set in app.config
        endpointBuilder: "default",
        //resourceEndpoint: "", // TODO
        methods: ["get", "post", "put", "delete", "list", "patch"], //TODO
        headers: {}, 
        authType: false,
        cache: false, //true or fals,
        responseInterceptor: function(data) {return data;}, //base response interceptor,
        success: function(data) {}, //callback
        error: function(data) {} //callback
    };
    
    
    //build the service
    this.build = function(resourceName, options) {
        for(var iii in options) {
            if(this._config[iii]) {
                this._config[iii] = options[iii];
            }
        }         
        
        
        //TODO check se cambiare
        this._config.resourceName = resourceName;
        return this;
    };
    
    //check if method exists
    this._checkMethod = function(methodName) {
        return (this._config.methods.indexOf(methodName) != -1);
    };
    
    
    this._call = function(httpMethod, options) {
        if(this._checkMethod(httpMethod)) {
            //create local config rewriting resource config with options
            options = this.getMergedConfig(options);
            //authorize the request
            options = this.authorizeRequest(options);
            
            var deferred = $q.defer();
            var builder = $crRemoteService.getEndpointBuilder(options.endpointBuilder);
            var url = builder($crRemoteService.getEndpoint(options.endpoint), options.resourceName, options.id/*, options.params*/);
            
            var httpConfig = {"params": options.params, "headers": options.headers};
            
            
            $http.get(url, httpConfig).success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);
            });
            if(options.success && options.error) {
                deferred.promise.then(options.success, options.error);
            }
        }
    };
    
    this.list = function(options) {
        if(options && options.id) {
            options.id = false;
        }
        this.get(options);
       
    };
    
    //get method, make a $http.get request
    this.get = function(options) {
        //check if method is available
        if(this._checkMethod("get")) {
            //create local config rewriting resource config with options
            options = this.getMergedConfig(options);
            //authorize the request
            options = this.authorizeRequest(options);
            
            var deferred = $q.defer();
            var builder = $crRemoteService.getEndpointBuilder(options.endpointBuilder);
            var url = builder($crRemoteService.getEndpoint(options.endpoint), options.resourceName, options.id/*, options.params*/);
            var httpConfig = {"params": options.params, "headers": options.headers};
            $http.get(url, httpConfig).success(function(data, status, headers, config) {
                if(options.responseInterceptor) {
                    data = options.responseInterceptor(data, status, headers, config);
                }
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);
            });
//            if(options.success && options.error) {
                deferred.promise.then(options.success, options.error);
//            }
        }
    };
    
    //post method, make a $http.post request
    this.post = function(options) {
        //check if method is available
        if(this._checkMethod("post")) {
            //create local config rewriting resource config with options
            
            var data = options.data;
            
            options = this.getMergedConfig(options);
            //authorize the request
            options = this.authorizeRequest(options);
            
            var deferred = $q.defer();
            var builder = $crRemoteService.getEndpointBuilder(options.endpointBuilder);
            var url = builder($crRemoteService.getEndpoint(options.endpoint), options.resourceName, options.id/**, options.params*/);
            
            var httpConfig = {"params": options.params, "headers": options.headers};
            
            $http.post(url, data, httpConfig).success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);
            });
//            if(options.success && options.error) {
            deferred.promise.then(options.success, options.error);
//            }
        }
    };
    this.patch = function(options) {
        //check if method is available
        if(this._checkMethod("patch")) {
            //create local config rewriting resource config with options
            
            var data = options.data;
            
            options = this.getMergedConfig(options);
            //authorize the request
            options = this.authorizeRequest(options);
            
            var deferred = $q.defer();
            var builder = $crRemoteService.getEndpointBuilder(options.endpointBuilder);
            var url = builder($crRemoteService.getEndpoint(options.endpoint), options.resourceName, options.id/**, options.params*/);
            var httpConfig = {"params": options.params, "headers": options.headers};
            
            $http.patch(url, data, httpConfig).success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);
            });
//            if(options.success && options.error) {
            deferred.promise.then(options.success, options.error);
//            }
        }
    };
    //put method, make a $http.post request
    this.put = function(options) {
        //check if method is available
        if(this._checkMethod("put")) {
            //create local config rewriting resource config with options
            
            var data = options.data;
            
            options = this.getMergedConfig(options);
            //authorize the request
            options = this.authorizeRequest(options);
            
            var deferred = $q.defer();
            var builder = $crRemoteService.getEndpointBuilder(options.endpointBuilder);
            var url = builder($crRemoteService.getEndpoint(options.endpoint), options.resourceName, options.id/**, options.params*/);
            
            var httpConfig = {"params": options.params, "headers": options.headers};
            
            $http.put(url, data, httpConfig).success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);
            });
//            if(options.success && options.error) {
                deferred.promise.then(options.success, options.error);
//            }
        }
    };
    
    
    //delete method, make a $http.delete request
    this.del = function(options) {
        //check if method is available
        if(this._checkMethod("delete")) {

            //create local config rewriting resource config with options
            options = this.getMergedConfig(options);
            //authorize the request
            options = this.authorizeRequest(options);
            
            var deferred = $q.defer();
            var builder = $crRemoteService.getEndpointBuilder(options.endpointBuilder);
            var url = builder($crRemoteService.getEndpoint(options.endpoint), options.resourceName, options.id/*, options.params*/);
            
            var httpConfig = {"params": options.params, "headers": options.headers};
            
            
            $http.delete(url, httpConfig).success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);
            });
//            if(options.success && options.error) {
                deferred.promise.then(options.success, options.error);
//            }
        }
    };
    
    //is set, call the authorized function on the auth provider and return the request authorized
    this.authorizeRequest = function(request) {
       var handler = $crRemoteService.getAuthHandler(request.authType);
       if(handler) {
           return handler.getSign(request);
       }  
       else {
           return request;
       }
    };
    
    

    this.getConfig = function() {
        var results = {};
        for(var iii in this._config) {
            results[iii] = this._config[iii];
        }
        return results;
    };
    
    //return options (rewriting default options with the parameters)
    this.getMergedConfig = function(options) {
        var results = this.getConfig();
        for(var iii in options) {
            if(results[iii] !== null) {
                results[iii] = options[iii];
            }
        }
        return results;
    };
    
}])

.provider('$crRemoteService', function() {
    var _config = {
        "authHandlers": {},
        "endpoint": {},
        //come gestire una risorsa del tipo user/11/posts/12 ?
        "endpointBuilder": {},
        "methods": ["get", "list", "post",  "put", "delete"]
    };
    
    this.setEndpointBuilder = function(buildFunction, buildType) {
        if(!buildType) {
            buildType = "default";
        }
        _config.endpointBuilder[buildType] = buildFunction;
    };
    
    this.parseParams = function(obj, prefix, recursive) {
        var str = [];
        for(var p in obj) {
          var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
          if(typeof v == "array") {
            for(var iii in v) str.push(iii + "=" + v[iii]);
          }
          else {
            str.push(typeof v == "object" ?
            recursive(v, k, recursive) :
            //k + "=" + v);
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
          }
        }
        return str.join("&");
    };

    this.getEndpointBuilder = function(endpointBuilderType) {
        if(!endpointBuilderType) {
            endpointBuilderType = "default";
        }
        if(_config.endpointBuilder[endpointBuilderType]) {
            return _config.endpointBuilder[endpointBuilderType];
        }
        else {
          var parseParams = this.parseParams;
            return function(endpoint, resourceName, resourceId, params) {
                if(resourceName) {
                    endpoint += resourceName;
                }
                if(resourceId) {
                    endpoint += "/" + resourceId;
                }
                if(params) {
                    endpoint += "?" + parseParams(params, null, parseParams);
                    /**var paramsAr = [];
                    for(var iii in params) {
                        paramsAr.push(iii + "=" + params[iii]);
                    }
                    if(paramsAr.length) {
                        endpoint += "?" + paramsAr.join("&");
                    }  */
                }
                return endpoint;
            } ;
        }
    };
    
    this.setEndpoint = function (endpoint, endpointType) {
        if(!endpointType) {
            endpointType = "default";
        }
        _config.endpoint[endpointType] = endpoint;
    };
    
    this.getEndpoint = function(endpointType) {
        if(!endpointType) {
            endpointType = "default";
        }
        if(_config.endpoint[endpointType]) {
            return _config.endpoint[endpointType];
        }
        else {
            return "" ;
        }
    };

    
    this.setAuthHandler = function (authHandler, authType) {
        if(!authType) {
            authType = "default";
        }
        _config.authHandlers[authType] = authHandler;
    };

    
    this.getAuthHandler = function(authType) {
        if(!authType) {
            authType = "default";
        }
        if(_config.authHandlers[authType]) {
            return _config.authHandlers[authType];
        }
        else {
            return false;
        }
    };
    
    this.setMethods = function (methods) {
        _config.methods = methods;
    };
    

    
    this.getMethods = function() {
        return _config.methods;
    };
    
    this.getConfig = function() {
        return _config;
    };
        
    this.$get = function() {
        return this;
    };
});