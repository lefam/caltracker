(function() {
    angular
        .module('app')
        .controller('SettingsProfileController', SettingsProfileController);

    SettingsProfileController.$inject = ['UserService'];

    function SettingsProfileController(UserService) {
        var vm = this;
        vm.isChangingPassword = false;
        vm.isLoaded = false;

        UserService.getCurrentUser()
            .then( function(user) {
                vm.isLoaded = true;
                vm.user = user;
            });

        this.toggleChangePassword = function() {
            vm.isChangingPassword = !vm.isChangingPassword;
        }

        this.update = function() {
            if (!vm.isChangingPassword) {
                delete vm.user.currentPassword;
                delete vm.user.password;
            }
            UserService
                .updateUser(vm.user)
                .then( function() {
                    alert('Profile updated with success!');
                })
                .catch( function(response) {
                    if (response.data && response.data.message) {
                        alert(response.data.message);
                    } else {
                        alert("Failed to update user");
                    }
                });
        }
    }
})();