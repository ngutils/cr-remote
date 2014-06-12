## cr-remote-service

``` shell
$. bower install
```

### Usage
Inject in your project 'corley-remote-service' and create services:

``` javascript
[...]
.service("BookRest", function(crRemoteService) {
	return angular.copy(crRemoteService).build(
		"book",
		{
			methods: ["get", "post"] //configuration
		}
	);
})

```
Use in your controller (inject it into ctrl)

``` javascript
BookRest.get({success: function(data) {
		console.log(data);
	}, error: function(data) {
		console.log("error");
	}
});

```

### Configuration
Use the provider to configure it adding custom auth and user handlers.

``` javascript
.config(['$crRemoteServiceProvider', '$myAuthProvider', '$myUserProvider', 
        function($crRemoteServiceProvider, $myAuthProvider, $myUserProvider) {  
  
  	$crRemoteServiceProvider.setEndpoint("/angular-seed-test/app/");
	$crRemoteServiceProvider.setAuthHandler($myAuthProvider);
	$crUserProvider.setAuthHandler($myAuthProvider);
}]);

```