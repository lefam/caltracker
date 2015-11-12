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

    runBlock.$inject = ['$rootScope', '$state', 'AuthService'];

    function runBlock($rootScope, $state, AuthService) {
        if (AuthService.isAuthenticated()) {
            $rootScope.currentUser = {
                username: AuthService.getUsername()
            };
        }

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (AuthService.isAuthenticated()) {
                // If the user is already authenticated we will not show login and signup screens.
                // We redirect him to the home screen, instead!
                if (["signup", "login"].indexOf(toState.name) != -1) {
                    event.preventDefault();
                    $state.go('home');
                }
            } else if (!(toState.data && toState.data.doesNotRequireAuth)) {
                event.preventDefault();
                $state.go('login');
            }
        });
    }
})();