(function() {
    angular
        .module('app')
        .directive('ctModal', ['$rootScope', function($rootScope) {
            function link(scope, element, attrs) {
                element.addClass("ct-modal ct-modal-closed");
                $rootScope.$on('ct-modal.open', function(e) {
                    element.removeClass('ct-modal-closed');
                });

                $rootScope.$on('ct-modal.close', function(e) {
                    element.addClass('ct-modal-closed');
                });
            }
            return {
                link: link
            };
        }]);
})();