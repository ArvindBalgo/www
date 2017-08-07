angular
    .module('adminApp')
    .controller('loginController', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
        //Setup view model object
        var vm = this;

        vm.login = function () {

            var customer = {};
            customer.email = vm.username;
            customer.password = vm.password;
            Data.post('login.php', {
                customer: customer
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    if (results.uid > 0 && results.admintype == 0) {
                        console.log("reslts:  ".results);
                        $location.path('home');
                    }
                    else if (results.uid > 0 && results.admintype == 1) {
                        $location.path('operateurs');
                    }
                }
            });
        }
    });