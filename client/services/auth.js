(function() {
    angular
        .module('app')
        .service('AuthService', AuthService);

    AuthService.$inject = ['$window', '$rootScope', '$http'];

    function AuthService($window, $rootScope, $http) {
        this.login = function(username, password) {
            var credentials = {
                username: username,
                password: password
            };
            return $http
                .post('/api/v1/auth/login', credentials)
                .then(function(response) {
                    if( response.data.status === 1 && response.data.token != '' ) {
                        $window.sessionStorage.setItem("auth_token", response.data.token);
                        $window.sessionStorage.setItem("user.username", username);
                    }
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
            $window.sessionStorage.clear();
        };

        this.isAuthenticated = function() {
            return $window.sessionStorage.getItem("auth_token");
        };

        this.getToken = function() {
            return $window.sessionStorage.getItem("auth_token");
        };

        this.getUsername = function() {
            return $window.sessionStorage.getItem("user.username");
        }
    }
})();