angular
    .module('adminApp')
    .controller('revendeurController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {
        console.log("Admin revendeur controller");

        Data.get('session').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });
    });

