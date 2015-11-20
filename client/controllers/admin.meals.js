(function() {
    angular
        .module('app')
        .controller('AdminMealsController', AdminMealsController);

    AdminMealsController.$inject = ['AuthService', 'UserService' , 'MealService', 'ModalService', 'DateService'];

    function AdminMealsController(AuthService, UserService, MealService, ModalService, DateService) {
        var vm = this;
        vm.isEditing = false;

        vm.filter = {
            dateFrom: DateService.formatDate(new Date()),
            timeFrom: '00:00 AM',
            dateTo: DateService.formatDate(new Date()),
            timeTo: '11:59 PM'
        };

        MealService.getAllTodayMeals()
            .then( function(meals) {
                vm.meals = meals;
            });


        this.applyFilter = function() {
            var from = new Date(this.filter.dateFrom + " " + this.filter.timeFrom);
            var to = new Date(this.filter.dateTo + " " + this.filter.timeTo);
            MealService.getMeals(from, to, 1)
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

        this.showMealEditForm = function(meal) {
            vm.isEditing = true;
            vm.meal = meal;
            var d = new Date(meal.dateTime);
            vm.meal.date = DateService.formatDate(d);
            vm.meal.time = DateService.formatTime(d);
            ModalService.open();
        };

        this.showMealAddForm = function() {
            vm.meal = {};
            var d = new Date();
            vm.meal.date = DateService.formatDate(d);
            vm.meal.time = DateService.formatTime(d);
            ModalService.open();
        };

        this.addOrUpdateMeal = function() {
            var m = vm.meal;
            if (vm.isEditing) {
                UserService
                    .getByUsername(m.user.username)
                    .then( function(user) {
                        MealService.updateMealForUser(user._id, m)
                            .then( function() {
                                vm.closeModal();
                            })
                            .catch( function() {
                                alert('Failed to save!');
                            });
                    });
            } else {
                UserService
                    .getByUsername(m.user.username)
                    .then ( function(user) {
                        MealService.addMealForUser(user._id, m.food, m.calories, m.date, m.time)
                            .then( function(meal) {
                                vm.closeModal();
                                vm.meals.push(meal);
                            })
                            .catch( function(response) {
                                alert('Failed to save!');
                            });

                    })
                    .catch( function(response) {
                       alert('User not found with username ' + m.username);
                    });
            }
        };

        this.removeMeal = function(id) {
            if (confirm("Are you sure you want to delete this meal?")) {
                MealService.deleteMeal(id)
                    .then( function() {
                        vm.meals = vm.meals.filter(function(t) {
                            return t._id !== id
                        });
                    });
            }
        }
    }
})();