(function() {
    angular
        .module('app')
        .service('MealService', MealService);

    MealService.$inject = ['$http'];

    function MealService($http) {
        function handleSuccess(response) {
            return response.data;
        }

        this.getMeals = function(from, to) {
            var fromStamp = from.getTime();
            var toStamp = to.getTime();
            return $http
                .get("/api/v1/meals?fromDateTime=" + fromStamp + "&toDateTime=" + toStamp)
                .then(handleSuccess);
        };

        this.getTodayMeals = function() {
            var now = new Date();
            var todayBegin = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return this.getMeals(todayBegin, now);
        };

        this.addMeal = function(food, calories, dateTime) {
            var data = {
                food: food,
                calories: calories,
                dateTime: dateTime
            };
            return $http
                .post('/api/v1/meals', data)
                .then(handleSuccess);
        }
    }
})();