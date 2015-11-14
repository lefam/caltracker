(function() {
    angular
        .module('app', ['ui.router'])
        .config(configBlock)
        .run(runBlock);

    configBlock.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];

    function configBlock($stateProvider, $urlRouterProvider, $httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');

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
                templateUrl: 'partials/home.html',
                controller: 'HomeController as homeCtrl'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'partials/settings.html',
                controller: 'SettingsController as settingsCtrl'
            })
            .state('settings.profile', {
                url: '/settings/profile',
                templateUrl: 'partials/profile.html',
                controller: 'ProfileController as profileCtrl'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'partials/admin.html',
                controller: 'AdminController as adminCtrl'
            })
            .state('admin.profile', {
                url: '/admin/meals',
                templateUrl: 'partials/admin.meals.html',
                controller: 'AdminMealsController as adminMealsCtrl'
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

        $rootScope.$on('unauthorized', function(e) {
            AuthService.logout();
            $state.go("login");
        });
    }
})();