angular
    .module('adminApp')
    .controller('loginController', function($scope, $rootScope, $routeParams, $location, $http, Data) {
        //Setup view model object
        console.log('login CONTROLLER');
        var vm = this;

        vm.login = function(){

            var customer = {};
            customer.email=vm.username;
            customer.password=vm.password;
            Data.post('login.php', {
                customer: customer
            }).then(function (results) {
                    console.log("RESULTS", results);
                    Data.toast(results);
                    if (results.status == "success") {
                        if(results.uid > 0) {
                            console.log("reslts:  ". results);
                            $location.path('home');
                        }
                        console.log("LOGGING IN:: ", results);
                    }
                });
        }
    });