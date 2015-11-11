(function() {
    angular
        .module('app', ['ui.router'])
        .config(configBlock)
        .run(runBlock);

    configBlock.$inject = ['$stateProvider', '$urlRouterProvider'];

    function configBlock($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('welcome', {
                url: '/welcome',
                templateUrl: 'partials/welcome.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'LoginController as loginCtrl',
                data: {
                    doesNotRequireAuth: true
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'partials/signup.html',
                controller: 'SignupController as signupCtrl',
                data: {
                    doesNotRequireAuth: true
                }
            })
            .state('home', {
                url: '/',
                templateUrl: 'partials/home.html'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutController'
            });
    }

    runBlock.$inject = ['$rootScope', '$state', '$window'];

    function runBlock($rootScope, $state, $window) {
        if ($window.sessionStorage.getItem("auth_token") != "") {
            $rootScope.currentUser = {
                username: $window.sessionStorage.getItem("username")
            };
        }

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            var isAuthed = $window.sessionStorage.getItem("auth_token") != "";
            if (!isAuthed && !(toState.data && toState.data.doesNotRequireAuth)) {
                event.preventDefault();
                $state.go('login');
            }
        });
    }
})();