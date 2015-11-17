(function() {
    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['MealService', 'ModalService', 'DateService'];

    function HomeController(MealService, ModalService, DateService) {
        var vm = this;
        vm.meals = [];
        vm.meal = {};
        vm.formToggleText = "Add Meal";
        vm.isMealFormVisible = false;
        vm.isEditingMeal = false;

        vm.filter = {
            dateFrom: DateService.formatDate(new Date()),
            timeFrom: '00:00 AM',
            dateTo: DateService.formatDate(new Date()),
            timeTo: '11:59 PM'
        };

        MealService.getTodayMeals()
            .then( function(meals) {
                vm.meals = meals;
                vm.todayCalories = 0;
                meals.forEach( function(m) {
                    vm.todayCalories += m.calories;
                });
            });

        this.applyFilter = function() {
            var from = new Date(this.filter.dateFrom + " " + this.filter.timeFrom);
            var to = new Date(this.filter.dateTo + " " + this.filter.timeTo);
            MealService.getMeals(from, to)
                .then( function(meals) {
                    vm.meals = meals;
                    meals.forEach( function(m) {
                        //vm.todayCalories += m.calories;
                    });
                });
        };

        this.closeModal = function() {
            this.isEditing = false;
            ModalService.close();
        };

        this.showMealAddForm = function() {
            vm.meal = {};
            var d = new Date();
            vm.meal.date = DateService.formatDate(d);
            vm.meal.time = DateService.formatTime(d);
            ModalService.open();
        };

        this.showMealEditForm = function(meal) {
            vm.isEditing = true;
            vm.meal = meal;
            var d = new Date(meal.dateTime);
            vm.meal.date = DateService.formatDate(d);
            vm.meal.time = DateService.formatTime(d);
            ModalService.open();
        };

        this.addOrUpdateMeal = function() {
            var m = vm.meal;
            if (vm.isEditing) {
                MealService.updateMeal(m)
                    .then( function() {
                        vm.closeModal();
                    })
                    .catch( function() {
                        alert('Failed to save!');
                    });
            } else {
                MealService.addMeal(m.food, m.calories, m.date, m.time)
                    .then( function(meal) {
                        vm.closeModal();
                        vm.meals.push(meal);
                    })
                    .catch( function(response) {
                        alert('Failed to save!');
                    });
            }
        };

        this.removeMeal = function(id) {
            if (confirm("Are you sure you want to remove this meal?")) {
                MealService
                    .deleteMeal(id)
                    .then( function() {
                        vm.meals = vm.meals.filter(function(t) {
                            return t._id !== id
                        });
                    })
                    .catch( function() {
                        alert('Failed to remove meal!');
                    });
            }
        };
    }
})();