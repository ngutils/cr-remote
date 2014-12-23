# crRemote
CrRemote is a wrap of remote service
* $http
Todo
* Dynamo
* Firebase
* Custom

``` shell
$. bower install
```

## Configuration
```javascript
angular.module(
        'ngPolecats',
        [
            'cr.remote'
        ]
)
.config(function myAppConfig(crRemoteProvider) {
    crRemoteProvider.setEndpoint("http://api1.test.it");

    // you can set more endpoint
    crRemoteProvider.setEndpoint("http://api2.test.it", "name2");
})
.run(function run(crRemote) {
})
.controller('AppCtrl', function AppCtrl($scope, $state, $rootScope, crRemote) {
    crRemote.get({
        resourceName: "/product"
    }).success(function(data){
        $scope.products = data;
    });
});
```

## Service
You can create different resource
```javascript
angular.module("ngPolecats.remote-service", [])
.service("UserRest", ['crRemote', function(crRemote) {
    var user = crRemote.createService();
    user.check = function(username, password){
        var opt = {};
        opt.authType = "default";
        opt.resourceName = "/login";
        return user.get(opt);
    };
    return user;
}])
.service("ProductRest", ['crRemote', function(crRemote) {
    var product = crRemote.createService({resourceName:"/product"});
    product.list = function(){
        return product.get();
    };
    return product;
}]);
```
## [CrAuth](https://github.com/corley/cr-user) + CrRemote
You can use CrAuth to manage authentication
```javascript
angular.module(
        'ngPolecats',
        [
            'cr.remote',
            'cr.auth',
        ]
)
.config(function myAppConfig(crRemoteProvider) {
    crRemoteProvider.setEndpoint("http://api.test");
})
.run(function run(crAuth, crAuthBasic, crRemote) {
    crAuth.setAuthHandler(crAuthBasic);
    crAuth.setSessionHandler(localStorageService);
    crRemote.setAuthHandler(crAuth);
})
.controller('AppCtrl', function AppCtrl($scope, $state, $rootScope, $crRemote) {
    $scope.login = function(username, password) {
        crAuth.setIdentity({username: username, password: password});
        UserRest.check()
            .success(function(data){
            })
            .error(function(data){
                console.log("d'oh");
            });
    };
});
```
