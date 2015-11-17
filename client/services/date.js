(function() {
    angular
        .module('app')
        .service('DateService', DateService);

    function DateService() {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        this.formatDate = function(date) {
            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();

            return day + ' ' + monthNames[monthIndex] + ', ' + year;
        };

        this.formatTime = function(date) {
            return date.toLocaleTimeString();
        }
    }
})();