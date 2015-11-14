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
        vm.isEditingMeal = false;

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
                if (vm.isEditingMeal) {

                } else {
                    vm.meal = {
                        dateTime: new Date()
                    }
                }
            } else {
                vm.isEditingMeal = false;
            }
        };

        this.addMeal = function() {
            if (vm.isEditingMeal) {
                MealService
                    .updateMeal(vm.meal)
                    .then( function(response) {
                        vm.toggleMealForm();
                    })
                    .catch( function(response) {
                        alert('Failed to add meal!');
                    });
            } else {
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
        };

        this.showMealEditForm = function(meal) {
            vm.isEditingMeal = true;
            vm.meal = meal;
            vm.toggleMealForm();
        };

        this.removeMeal = function(id) {
            alert(id);
        };
    }
})();