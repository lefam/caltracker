(function() {
    angular
        .module('app')
        .controller('AdminMealsController', AdminMealsController);

    AdminMealsController.$inject = ['AuthService', 'UserService' , 'MealService', 'ModalService'];

    function AdminMealsController(AuthService, UserService, MealService, ModalService) {
        var vm = this;
        vm.isEditing = false;

        MealService.getAllTodayMeals()
            .then( function(meals) {
                console.log(meals);
                vm.meals = meals;
            });


        this.closeModal = function() {
            this.isEditing = false;
            ModalService.close();
        };

        this.showMealEditForm = function(meal) {
            vm.isEditing = true;
            vm.meal = meal;
            var d = new Date(meal.dateTime);
            vm.meal.date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
            vm.meal.time = d.toLocaleTimeString();
            ModalService.open();
        };

        this.showMealAddForm = function() {
            vm.meal = {};
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