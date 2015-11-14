(function() {
    angular
        .module('app')
        .controller('SettingsMealsController', SettingsMealsController);

    function SettingsMealsController() {
        var vm = this;

        vm.maxDailyCalories = 250;
    }
})();