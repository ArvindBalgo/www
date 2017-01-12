angular
    .module('adminApp')
    .controller('maquetteController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {
        console.log("Admin maquette controller");

        Data.get('session').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

    });

