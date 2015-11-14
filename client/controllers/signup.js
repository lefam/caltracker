(function() {
    angular
        .module('app')
        .controller('SignupController', SignupController);

    SignupController.$inject = ['$state', 'AuthService', 'UserService'];

    function SignupController($state, AuthService, UserService) {
        var vm = this;

        vm.user = {};

        vm.signup = function() {
            UserService
                .createUserForAuth(vm.user.username, vm.user.firstName, vm.user.lastName, vm.user.email, vm.user.password)
                .then( function(response) {
                    AuthService.login(vm.user.username, vm.user.password)
                        .then( function() {
                            $state.go('home');
                        })
                        .catch( function(response) {
                            alert(response.data);
                        });
                })
                .catch( function(e) {
                    alert('Failed to create user');
                });
        }
    }
})();