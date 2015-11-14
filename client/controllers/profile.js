(function() {
    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['UserService'];

    function ProfileController(UserService) {
        var vm = this;
        vm.isChangingPassword = false;
        vm.isLoaded = false;

        UserService.getCurrentUser()
            .then( function(user) {
                console.log(user);
                vm.isLoaded = true;
                vm.user = user;
            });

        this.toggleChangePassword = function() {
            vm.isChangingPassword = !vm.isChangingPassword;
        }
    }
})();