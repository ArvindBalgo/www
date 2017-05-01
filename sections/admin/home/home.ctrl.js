angular
    .module('adminApp')
    .controller('homeController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {
        console.log("HOME CONtroller admin partt");
var vm  = this;

            $scope.fnSession= function(){
                Data.get('session.php').then(function (results) {
                    if (results.uid) {

                    } else {
                        $location.path("/login");
                    }
                });
            }

            $scope.fnLogout = function(){
                Data.get('logout.php').then(function (results) {
                    $scope.sessionInfo = results;
                    console.log(results, 'results from admin');

                    $scope.fnSession();
                });
            //$location();
        };
        /*$http({
            method: 'GET',
            params: {mode:23},
            url: 'api/v1/info.php'
        }).then(function successCallback(response) {
            console.log(response.data);

        }, function errorCallback(error) {
            console.log(error);
        });*/
        $scope.fnSession();
    });

