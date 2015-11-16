(function() {
    angular
        .module('app')
        .service('UserService', UserService);

    UserService.$inject = ['$http'];

    function UserService($http) {
        function handleSuccess(response) {
            return response.data;
        };

        this.getCurrentUser = function() {
            return $http.get('/api/v1/me')
                .then(handleSuccess);
        };

        this.getUsers = function() {
            return $http.get('/api/v1/users')
                .then(handleSuccess);
        }

        this.getById = function(id) {
            return $http.get('/api/v1/users/' + id)
                .then( function(response) {
                    return response.data;
                });
        };

        this.getByUsername = function(username) {
            return $http.get('/api/v1/identity/users/' + username)
                .then(handleSuccess);
        };

        this.createUser = function(username, firstName, lastName, email, password, role) {
            var user = {
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                role: role
            };
            return $http.post('/api/v1/users', user)
                .then(handleSuccess);
        };

        // This method should be used when the client is not authenticated, eg. through a signup form.
        this.createUserForAuth = function(username, firstName, lastName, email, password) {
            var user = {
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            };
            return $http.post('/api/v1/auth/signup', user);
        };

        this.updateUser = function(user) {
            return $http.put('/api/v1/users/' + user._id, user)
                .then(handleSuccess);
        };

        this.deleteUser = function(userId) {
            return $http.delete('/api/v1/users/' + userId)
                .then(handleSuccess);
        };

        this.setMaxCaloriesPerDay = function(userId, calories) {
            return $http.put('/api/v1/users/' + userId + '/max_daily_calories', {calories: calories})
                .then(handleSuccess);
        };
    }
})();