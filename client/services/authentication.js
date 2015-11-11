(function() {
    angular
        .module('app')
        .service('AuthService', AuthService);

    AuthService.$inject = ['$window', '$http'];

    function AuthService($window, $http) {
        this.login = function(username, password) {
            var credentials = {
                username: username,
                password: password
            };
            $http.post('/api/v1/auth', credentials)
                .then(function(response) {
                    if( response.data.status === 1 && response.data.token != '' ) {
                        alert('Logged In');
                        $window.sessionStorage.setItem("auth_token", response.data.token);
                    }
                });
        };

        this.logout = function() {
            $window.sessionStorage.clear();
        };
    }
})();