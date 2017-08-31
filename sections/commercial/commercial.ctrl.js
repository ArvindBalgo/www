angular
    .module('myApp')
    .controller('commercialController', function ($scope, $location, $timeout, messages, $http, Data) {
        var vm = this;

        vm.fnGetAll = function() {
            $http({
                method: "POST",
                url: "/api/v1/metierCRUDPOST.php",
                data: $.param({mode:18}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    console.log(data);
                })
                .error(function (data, status, headers, config) {
                });
        }

        vm.fnGetAll();
    });
