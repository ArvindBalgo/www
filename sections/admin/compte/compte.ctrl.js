angular
    .module('adminApp')
    .controller('compteController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, FileUploader) {

        Data.get('session').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });


    });

