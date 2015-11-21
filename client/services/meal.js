(function() {
    angular
        .module('app')
        .service('MealService', MealService);

    MealService.$inject = ['$http'];

    function MealService($http) {
        function handleSuccess(response) {
            return response.data;
        }

        this.getMealsGroupedByDay = function(from, to, all) {
            var fromStamp = from.getTime();
            var toStamp = to.getTime();
            all = all || 0;
            return $http
                .get("/api/v1/meals?fromDateTime=" + fromStamp + "&toDateTime=" + toStamp + "&all=" + all)
                .then( function(response) {
                    var meals = response.data;
                    var grouped  = _.groupBy(meals, function(m) {
                        return m.dateTime.substring(0, 10);
                    });
                    return grouped;
                });
        };

        this.getMeals = function(from, to, all) {
            var fromStamp = from.getTime();
            var toStamp = to.getTime();
            all = all || 0;
            return $http
                .get("/api/v1/meals?fromDateTime=" + fromStamp + "&toDateTime=" + toStamp + "&all=" + all)
                .then(handleSuccess);
        };

        this.getTodayMeals = function() {
            var now = new Date();
            var todayBegin = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return this.getMeals(todayBegin, now);
        };

        this.getAllTodayMeals = function() {
            var now = new Date();
            var todayBegin = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return this.getMeals(todayBegin, now, 1);
        };

        this.addMeal = function(food, calories, date, time) {
            var data = {
                food: food,
                calories: calories,
                dateTime: date + " " + time
            };
            return $http
                .post('/api/v1/meals', data)
                .then(handleSuccess);
        };

        this.addMealForUser = function(userId, food, calories, date, time) {
            var data = {
                food: food,
                calories: calories,
                dateTime: date + " " + time,
                user: userId
            };
            return $http
                .post('/api/v1/meals', data)
                .then(handleSuccess);
        };

        this.updateMeal = function(meal) {
            var data = {
                food: meal.food,
                calories: meal.calories,
                dateTime: meal.date + " " + meal.time
            };
            return $http
                .put('/api/v1/meals/' + meal._id, data)
                .then(handleSuccess);
        };

        this.updateMealForUser = function(userId, meal) {
            var data = {
                food: meal.food,
                calories: meal.calories,
                dateTime: meal.date + " " + meal.time,
                user: userId
            };
            return $http
                .put('/api/v1/meals/' + meal._id, data)
                .then(handleSuccess);
        };

        this.deleteMeal = function(id) {
            return $http
                .delete('/api/v1/meals/' + id)
                .then(handleSuccess);
        }
    }
})();