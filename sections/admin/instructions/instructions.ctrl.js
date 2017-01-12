angular
    .module('adminApp')
    .controller('instructionsController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, FileUploader) {
        $scope.header = "Instructions";

        var vm          = this;
        vm.isEdit       = false;
        vm.arrInstructions = [];


        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }
        });





        vm.fnGetInstructions = function(){
            $http({
                method: 'GET',
                params: {mode:11},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                    vm.arrInstructions  = response.data;
                }, function errorCallback(error) {
                    console.log(error);
                });
        };

        vm.fnEdit = function(){
            vm.isEdit = true;
        };

        vm.fnAnnuler = function(){
            vm.isEdit = false;
        };

        vm.fnSave = function() {

            angular.forEach(vm.arrInstructions, function(value) {
                console.log(value);
                $http({
                    method: 'GET',
                    params: {mode:12 , id:value.id, instruction:value.instruction},
                    url: 'api/v1/info.php'
                }).then(function successCallback(response) {

                    }, function errorCallback(error) {
                        console.log(error);
                    });
            });
            vm.isEdit = false;

        };

        $( document ).ready(function() {
           vm.fnGetInstructions();
        });

    });