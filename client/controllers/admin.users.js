(function() {
    angular
        .module('app')
        .controller('AdminUsersController', AdminUsersController);

    AdminUsersController.$inject = ['UserService'];

    function AdminUsersController(UserService) {
        var vm = this;

        UserService.getUsers()
            .then( function(users) {
                vm.users = users;
            });
    }
})();