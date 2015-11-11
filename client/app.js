(function() {
    angular
        .module('app', ['ui.router'])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'partials/login.html'
                })
                .state('signup', {
                    url: '/signup',
                    templateUrl: 'partials/signup.html',
                    controller: 'SignupController as signupCtrl'
                })
                .state('home', {
                    url: '/home',
                    templateUrl: 'partials/home.html'
                });
        }])
})();