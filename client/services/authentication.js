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
                });
        };

        this.logout = function() {
            $rootScope.currentUser = null;
            $window.sessionStorage.clear();
        };
    }
})();