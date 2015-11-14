(function() {
    angular
        .module('app')
        .service('AuthService', AuthService);

    AuthService.$inject = ['$window', '$rootScope', '$http'];

    function AuthService($window, $rootScope, $http) {
        var store = $window.sessionStorage;

        this.login = function(username, password) {
            var credentials = {
                username: username,
                password: password
            };
            return $http
                .post('/api/v1/auth/login', credentials)
                .then(function(response) {
                    store.setItem("auth_token", response.data.token);
                    store.setItem("user.username", username);
                    $rootScope.currentUser = {
                        username: username
                    };
                    //$http.get("/api/v1/me")
                    //    .then( function(response) {
                    //        alert(response.data.firstName + " - this is working!");
                    //    });
                });
        };

        this.logout = function() {
            $rootScope.currentUser = null;
            store.clear();
        };

        this.isAuthenticated = function() {
            return store.getItem("auth_token");
        };

        this.getToken = function() {
            return store.getItem("auth_token");
        };

        this.getUsername = function() {
            return store.getItem("user.username");
        }
    }
})();