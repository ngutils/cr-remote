angular.module('cr.remote', [])
.service('crRemoteHttp', ['$http', function($http) {
    /**
     * configuration
     * @param _config Object
     */
    this._config = {
        id: false,
        params: false,
        resourceName: "",
        endpoint: "default",
        endpointBuilder: "default",
        headers: {},
        authHandlers: {},
        authType: false,
        responseInterceptor: function(data) {return data;}
    };

    /**
     * Create service
     * @param options Object init configuration
     */
    this.createService = function(options) {
        var service = angular.copy(this);
        service._config = service.getMergedConfig(options);
        return service;
    };

    /**
     * Return build endpoint by name
     * @param endpointBuilderType String name of your endpoint builder
     * @return endpoint String
     */
    this.getEndpointBuilder = function(endpointBuilderType) {
        if(!endpointBuilderType) {
            endpointBuilderType = "default";
        }
        if(this.getConfig()['endpointBuilders'][endpointBuilderType]) {
            return this.getConfig()['endpointBuilders'][endpointBuilderType];
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
                    endpoint += "?" + this.parseParams(params, null, parseParams);
                }
                return endpoint;
            } ;
        }
    };

    /**
     * Authorize request
     * @param requt Object HTTP request
     * @return Object
     */
    this.authorizeRequest = function(request) {
        var handler = this.getAuthHandler(request.authType);
        if(handler) {
            return handler.sign(request);
        }
        return request;
    };

    this.getConfig = function() {
        return this._config;
    };

    this.setConfig = function(obj) {
        for (var ii in obj) {
            this._config[ii] = obj[ii];
        }
    };

    /**
     * Merge configuration
     * @param options Object your configuration
     * @return Object
     */
    this.getMergedConfig = function(options) {
        var results = angular.copy(this.getConfig());
        for(var iii in options) {
            if(results[iii] !== null) {
                results[iii] = options[iii];
            }
        }
        return results;
    };

    /**
     * Set Authentication Handler
     * @param authHandler Object
     * @param authType    String Name of authentication
     */
    this.setAuthHandler = function (authHandler, authType) {
        if(!authType) {
            authType = "default";
        }
        this.getConfig()['authHandlers'][authType] = authHandler;
    };

    /**
     * Return authentication handler
     * @param authType String
     * @return {}|false
     */
    this.getAuthHandler = function(authType) {
        if(!authType) {
            authType = "default";
        }
        return this.getConfig().authHandlers[authType];
    };

    this.parseParams = function(obj, prefix, recursive) {
        var str = [];
        for(var p in obj) {
          var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
          if (typeof v === "object") {
            for (var iii in v) {
                str.push(iii + "=" + v[iii]);
            }
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

    /**
     * Return endpoint
     * @param endpointType String endpoint name
     * @return config|""
     */
    this.getEndpoint = function(endpointType) {
        if(!endpointType) {
            endpointType = "default";
        }
        if(this.getConfig().endpoints[endpointType]) {
            return this.getConfig().endpoints[endpointType];
        }
        else {
            return "" ;
        }
    };


    /**
     * Wrap of $http
     * @param options Object Call configuation
     * @return $http
     */
    this._call = function(options) {
        options = this.getMergedConfig(options);
        var builder = this.getEndpointBuilder(options.endpointBuilder);
        var url = builder(this.getEndpoint(options.endpoint), options.resourceName, options.id);
        options = this.authorizeRequest(options);
        var httpConfig = {
            "url": url,
            "method": options.method,
            "params": options.params,
            "headers": options.headers
        };
        return $http(httpConfig);
    };

    /**
     * Get entry point
     * @param options Object Call configuation
     * @return $q
     */
    this['get'] = function(options) {
        options.method = "GET";
        return this._call(options);
    };

    /**
     * Delete entry point
     * @param options Object Call configuation
     * @return $q
     */
    this['delete'] = function(options) {
        options.method = "DELETE";
        return this._call(options);
    };

    /**
     * Post entry point
     * @param options Object Call configuation
     * @return $q
     */
    this['post'] = function(options) {
        options.method = "POST";
        return this._call(options);
    };

    /**
     * Put entry point
     * @param options Object Call configuation
     * @return $q
     */
    this['put'] = function(options) {
        options.method = "PUT";
        return this._call(options);
    };

    /**
     * Patch entry point
     * @param options Object Call configuation
     * @return $q
     */
    this['patch'] = function(options) {
        options.method = "PATCH";
        return this._call(options);
    };
}])
.provider('crRemote', function() {
    var _config = {
        endpointBuilders: {},
        endpoints: {}
    };

    /**
     * Build your endpoint
     * @param   buildFunction function Callback to create endpoint url
     * @param   buildType     function Name of endpoint
     */
    this.setEndpointBuilder = function(buildFunction, buildType) {
        if(!buildType) {
            buildType = "default";
        }
        this.getConfig().endpointBuilders[buildType] = buildFunction;
    };


    /**
     * Set new endpoint
     * @param endpoint String endpoint url
     * @param endpointType String name of endpoint
     */
    this.setEndpoint = function (endpoint, endpointType) {
        if(!endpointType) {
            endpointType = "default";
        }
        this.getConfig().endpoints[endpointType] = endpoint;
    };

    /**
     * Return config
     * @return Object
     */
    this.getConfig = function() {
        return _config;
    };

    this.$get = ["crRemoteHttp", function(crRemoteService) {
        crRemoteService.setConfig(this.getConfig());
        return crRemoteService;
    }];
});
