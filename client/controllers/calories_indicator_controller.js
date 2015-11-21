(function() {
    angular
        .module('app')
        .controller('CaloriesIndicatorController', CaloriesIndicatorController);

    CaloriesIndicatorController.$inject = ['MealService', 'UserService', '$rootScope'];

    function CaloriesIndicatorController(MealService, UserService, $rootScope) {
        var vm = this;
        vm.calories = 0;
        vm.maxCaloriesPerDay = 0;

        this.fetchTodayMeals = function() {
            MealService.getTodayMeals()
                .then( function(meals) {
                    vm.meals = meals;
                    vm.calories = 0;
                    meals.forEach( function(m) {
                        vm.calories += m.calories;
                    });
                });
        };

        this.isGreen = function() {
            return vm.calories <= vm.maxCaloriesPerDay;
        };

        UserService.getCurrentUser()
            .then( function(user) {
                vm.maxCaloriesPerDay = user.maxCaloriesPerDay;
                vm.fetchTodayMeals();

                $rootScope.$on('meal.updated', function() {
                    vm.fetchTodayMeals();
                });
            });
    }
})();