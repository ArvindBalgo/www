angular
    .module('adminApp')
    .controller('configDiversController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, FileUploader, $compile) {

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        $scope.header = "Configuration divers";
        vm.arrTva = [];

        vm.fnInit = function() {
            $http({
                method: 'GET',
                params: {mode:15},
                url: 'api/v1/metierCRUD.php'
            }).then(function successCallback(response) {
                vm.arrTva = response.data;
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnSaveTva = function() {
            console.log(vm.arrTva);
            $http({
                method: 'GET',
                params: {mode:16, data:JSON.stringify(vm.arrTva)},
                url: 'api/v1/metierCRUD.php'
            }).then(function successCallback(response) {
                console.log(vm.arrTva);
            }, function errorCallback(error) {
                console.log(error);
            });
        }

        vm.fnInit();
    });

