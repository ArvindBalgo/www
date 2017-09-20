angular
    .module('adminApp')
    .controller('compteController', function ($scope, $rootScope, $routeParams, $location, $http, Data, NgTableParams) {
        var vm = this;
        $scope.header = "Compte Client";

        Data.get('session.php').then(function (results) {
            if (results.uid) {
                vm.fnGetAll();
            } else {
                $location.path("/login");
            }
        });

        vm.fnGetAll = function () {
            $http({
                method: "GET",
                url: "/api/v1/user_crud.php",
                params: {mode: 5}
            })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    vm.tableParams = new NgTableParams({}, {
                        dataset: data
                    });
                })
                .error(function (data, status, headers, config) {
                });
        };

        vm.fnGetAll();


    });
