(function() {
    angular
        .module('app')
        .controller('LogoutController', LogoutController);

    LogoutController.$inject = ['AuthService', '$state'];

    function LogoutController(AuthService, $state) {
        AuthService.logout();
        $state.go('login');
    }
})();