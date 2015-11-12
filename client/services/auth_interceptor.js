(function() {
    angular
        .module('app')
        .service('AuthInterceptor', AuthInterceptor);

    AuthInterceptor.$inject = ['$injector', '$rootScope', '$q'];

    function AuthInterceptor($injector, $rootScope, $q) {
        this.request = function(config) {
            // There is a circular dependency between this interceptor and the $http service.
            // So we need to used the $injector service in this fashion to get the AuthService.
            var AuthService = $injector.get('AuthService');
            var $state = $injector.get('$state');

            config.headers = config.headers || {};

            if (AuthService.isAuthenticated()) {
                config.headers['x-access-token'] = AuthService.getToken();
            }
            return config;
        };

        this.responseError = function(response) {
            if (response.status === 400 || response.status == 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return response;
        }
    }
})();