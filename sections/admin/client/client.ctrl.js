angular
    .module('adminApp')
    .controller('clientController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {
        console.log("Admin client controller");

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });
    });

