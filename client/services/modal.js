(function() {
    angular
        .module('app')
        .service('ModalService', ModalService);

    ModalService.$inject = ['$rootScope'];

    function ModalService($rootScope) {
        this.open = function() {
            $rootScope.$broadcast('ct-modal.open');
        };

        this.close = function() {
            $rootScope.$broadcast('ct-modal.close');
        }
    }
})();