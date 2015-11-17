(function() {
    angular
        .module('app')
        .directive('ctTimePicker', function() {
            function link(scope, element, attrs) {
                var picker = element.pickatime();
            }

            return {
                link: link
            };
        });
})();