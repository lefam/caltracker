(function() {
    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', 'AuthService', '$state'];

    function LoginController($rootScope, AuthService, $state) {
        var vm = this;

        vm.login = function() {
            AuthService.login(vm.username, vm.password)
                .then( function() {
                    $state.go('home');
                })
                .catch( function() {
                    alert('Username or password invalid!');
                });
        };
    }
})();