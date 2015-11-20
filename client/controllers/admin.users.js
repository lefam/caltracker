(function() {
    angular
        .module('app')
        .controller('AdminUsersController', AdminUsersController);

    AdminUsersController.$inject = ['AuthService', 'UserService', 'ModalService'];

    function AdminUsersController(AuthService, UserService, ModalService) {
        var vm = this;
        vm.isEditingUser = false;
        vm.isChangingPassword = false;
        vm.roles = [{id: 0, desc: 'Normal'}, {id: 1, desc: 'Manager'}];

        if (AuthService.getUser().role === AuthService.ROLE_ADMIN) {
            vm.roles.push({id: 2, desc: 'Admin'});
        }

        UserService.getUsers()
            .then( function(users) {
                vm.users = users;
            });

        this.toggleChangePassword = function() {
            this.isChangingPassword = !this.isChangingPassword;
        };

        this.closeModal = function() {
            this.isEditingUser = false;
            ModalService.close();
        };

        this.showUserEditForm = function(user) {
            vm.isEditingUser = true;
            vm.user = user;
            vm.canChangeRole = user.role < AuthService.getUser().role;
            ModalService.open();
        };

        this.showUserAddForm = function() {
            vm.user = {role: 0};
            vm.canChangeRole = true;
            ModalService.open();
        };

        this.isValid = function(form) {
            var isPartiallyValid =
                form.username.$valid &&
                form.firstName.$valid &&
                form.lastName.$valid;
            if (!vm.isEditingUser || vm.isChangingPassword) {
                return isPartiallyValid && form.password.$valid;
            }
            return isPartiallyValid;
        };

        this.addOrUpdateUser = function() {
            var u = vm.user;
            console.log(u);
            if (vm.isEditingUser) {
                UserService.updateUser(u)
                    .then( function(user) {
                        vm.closeModal();
                    })
                    .catch( function(response) {
                        if (response.data && response.data.message) {
                            alert(response.data.message);
                        } else {
                            alert('Failed to save!');
                        }
                    });

            } else {
                UserService.createUser(u.username, u.firstName, u.lastName, u.email, u.password, u.role)
                    .then( function(user) {
                        vm.closeModal();
                        vm.users.push(user);
                    })
                    .catch( function() {
                        alert('Failed to save!');
                    });
            }
        };

        this.removeUser = function(id) {
            if (confirm("Are you sure you want to delete this user?")) {
                UserService.deleteUser(id)
                    .then( function() {
                        vm.users = vm.users.filter(function(t) {
                            return t._id !== id
                        });
                    });
            }
        }
    }
})();