angular
    .module('adminApp')
    .controller('homeController', function ($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {
        console.log("HOME CONtroller admin partt");
        var vm = this;
        vm.listOrders = [];

        $scope.fnSession = function () {
            Data.get('session.php').then(function (results) {
                if (results.uid) {
                    vm.fnGetOrders();

                } else {
                    $location.path("/login");
                }
            });
        }

        $scope.fnLogout = function () {
            Data.get('logout.php').then(function (results) {
                $scope.sessionInfo = results;
                console.log(results, 'results from admin');

                $scope.fnSession();
            });
            //$location();
        };

        vm.fnGetOrders = function() {
            $http({
                method  : "POST",
                url     : "/api/v1/commande.php",
                data: $.param({mode:1}),
                headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    vm.listOrders = data;
                })
                .error(function (data, status, headers, config) {
                });
        };
        vm.fnToggleEye = function(item) {
            if(!item.displayDetails) {
                $http({
                    method  : "POST",
                    url     : "/api/v1/commande.php",
                    data: $.param({mode:2, idOrder:item.id}),
                    headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
                })
                    .success(function (data, status, headers, config) {
                        console.log(data);
                        item.details = data;
                    })
                    .error(function (data, status, headers, config) {
                    });
            }
            item.displayDetails = !item.displayDetails;
        };

        vm.fnStart = function(item) {
            $http({
                method  : "POST",
                url     : "/api/v1/commande.php",
                data: $.param({mode:3, idOrder:item.id, status:'INPROCESS'}),
                headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    vm.listOrders = data;
                })
                .error(function (data, status, headers, config) {
                });
        };
        $scope.fnSession();
    });

