(function() {
    angular
        .module('app')
        .controller('SettingsMealsController', SettingsMealsController);

    SettingsMealsController.$inject = ['UserService'];

    function SettingsMealsController(UserService) {
        var vm = this;
        vm.isLoaded = false;

        UserService.getCurrentUser()
            .then( function(user) {
                vm.isLoaded = true;
                vm.userId = user._id;
                vm.maxDailyCalories = user.maxCaloriesPerDay;
            });

        this.update = function() {
            UserService.setMaxCaloriesPerDay(vm.userId, vm.maxDailyCalories)
                .then( function() {
                    alert('Updated with success')
                })
                .catch( function() {
                    alert('Failed to update!');
                });
        }
    }
})();