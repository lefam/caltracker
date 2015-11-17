(function() {
    angular
        .module('app')
        .directive('ctDatePicker', function() {
            function link(scope, element, attrs) {
                var picker = element.pickadate();
            }

            return {
                link: link
            };
        });
})();