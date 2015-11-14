(function() {
    angular
        .module('app')
        .service('UserService', UserService);

    UserService.$inject = ['$http'];

    function UserService($http) {
        this.getById = function(id) {
            return $http.get('/api/v1/users/' + id)
                .then( function(response) {
                    return response.data;
                });
        };

        this.createUser = function(username, firstName, lastName, email, password) {
            var user = {
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            };
            return $http.post('/api/v1/users', user);
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

        this.updateUser = function(id, username, firstName, lastName, email, lastPassword, newPassword) {
            var user = {
                id: id,
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                lastPassword: lastPassword,
                newPassword: newPassword
            };
            return $http.put('/api/v1/users/' + id, user);
        };

        this.deleteUser = function(userId) {
            return $http.delete('/api/v1/users/' + userId);
        };

        this.setMaxCaloriesPerDay = function(userId, calories) {
            return $http.put('/api/v1/users/' + userId + '/max_daily_calories', {calories: calories});
        };
    }
})();