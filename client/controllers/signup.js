(function() {
    angular
        .module('app')
        .controller('SignupController', SignupController);

    SignupController.$inject = ['AuthService', 'UserService'];

    function SignupController(AuthService, UserService) {
        var vm = this;
        vm.user = {};

        vm.signup = function() {
            UserService
                .createUser(vm.user.username, vm.user.firstName, vm.user.lastName, vm.user.email, vm.user.password)
                .then( function(response) {
                    alert('User created with success!');
                })
                .catch( function(e) {
                    alert('Failed to create user');
                });
        }
    }
})();