(function() {
    angular
        .module('app')
        .directive('ctCaloriesIndicator', ['UserService', function(UserService) {
            return {
                templateUrl: 'partials/calories_indicator.html',
                controller: "CaloriesIndicatorController as caloriesIndicatorCtrl"
            };
        }]);
})();