angular
    .module('adminApp')
    .controller('listFacturesController', function ($scope, $rootScope, $routeParams, $location, $http, Data, NgTableParams) {
        var vm = this;
        $scope.header = "Factures";

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
                url: "/api/v1/details_commande.php",
                params: {mode: 2}
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

        vm.fnGeneratePdf = function (idOrder) {
            $http({
                method: "POST",
                url: "/api/v1/pdf_generation.php",
                data: $.param({mode: 0, id: idOrder}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    vm.fnGetAll();
                    //jQuery('<form target="_blank" action="' + data + '" method="get"></form>').appendTo('body').submit().remove();

                })
                .error(function (data, status, headers, config) {
                });
        };

        vm.fnSendEmail = function (idOrder) {
            $http({
                method: "GET",
                url: "/api/v1/details_commande.php",
                params: {mode: 3, id_order: idOrder}
            })
                .success(function (data, status, headers, config) {
                    console.log(data);
                })
                .error(function (data, status, headers, config) {
                });
        }

    });
