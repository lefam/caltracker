(function() {
    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['MealService'];

    function HomeController(MealService) {
        var vm = this;
        vm.meals = [];
        vm.meal = {};
        vm.formToggleText = "Add Meal";
        vm.isMealFormVisible = false;

        MealService.getTodayMeals()
            .then( function(meals) {
                vm.meals = meals;
                vm.todayCalories = 0;
                meals.forEach( function(m) {
                    vm.todayCalories += m.calories;
                });
            });

        this.toggleMealForm = function() {
            vm.isMealFormVisible = !vm.isMealFormVisible;
            if (vm.isMealFormVisible) {
                vm.meal = {
                    dateTime: new Date()
                };
                vm.formToggleText = "Hide Form";
            } else {
                vm.formToggleText = "Add Meal";
            }
        };

        this.addMeal = function() {
            MealService
                .addMeal(vm.meal.food, vm.meal.calories, vm.meal.dateTime)
                .then( function(meal) {
                    vm.meals.push(meal);
                    vm.toggleMealForm();
                })
                .catch( function(response) {
                    alert('Failed to add meal!');
                });
        }
    }
})();