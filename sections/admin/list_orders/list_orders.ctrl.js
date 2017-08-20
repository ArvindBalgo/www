angular
    .module('adminApp')
    .controller('listOrdersController', function($scope, $rootScope, $routeParams, $location, $http, Data, NgTableParams) {
        var vm = this;
        $scope.header = "Archieve des commandes";

        Data.get('session.php').then(function (results) {
            if (results.uid) {
                vm.fnGetOrdersList();
            } else {
                $location.path("/login");
            }

            //$location();
        });

        vm.fnGetOrdersList = function() {
            $http({
                method: 'GET',
                params: {mode:1},
                url: 'api/v1/details_commande.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                vm.test = response.data;
                vm.tableParams = new NgTableParams({
                    // initial grouping
                    group: "id_order",
                    sorting: { id_order: "desc" }
                }, {
                    dataset: vm.test
                });
            }, function errorCallback(error) {
                console.log(error);
            });
        }

        vm.fnModalImage = function() {

        };

        vm.fnRedirectModal = function() {

        }

    });
