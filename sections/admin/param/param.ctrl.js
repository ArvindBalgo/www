angular
    .module('adminApp')
    .controller('paramController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {
        console.log("Admin param controller");

        Data.get('session').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });
    });

