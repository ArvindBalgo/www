angular
    .module('adminApp')
    .controller('youtubeController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, $sanitize) {
        console.log("youtube controller");

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        $scope.header = "Youtube links";
        vm.fnNew = function() {
            $http({
                method: 'GET',
                params: {mode:2},
                url: 'api/v1/youtube.php'
            }).then(function successCallback(response) {
                console.log(response.data);
               vm.arrData = response.data;
            }, function errorCallback(error) {
                console.log(error);
            });
        };


        vm.fnGetAll = function() {
            $http({
                method: 'GET',
                params: {mode:1},
                url: 'api/v1/youtube.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                vm.arrData = response.data;
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnValider = function ($item) {
           console.log($item);
            $http({
                method: 'GET',
                params: {mode:3, title:$item.title, id:$item.id, description:$item.description, links:$item.links},
                url: 'api/v1/youtube.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                vm.arrData = response.data;
            }, function errorCallback(error) {
                console.log(error);
            });
        }
        vm.fnGetAll();
        vm.arrDataOrig = [];
        vm.arrData = [];
        vm.message  = "";

    });
