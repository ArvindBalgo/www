angular
    .module('adminApp')
    .controller('commandeController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {
        console.log("Admin commande controller");

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });
    });

