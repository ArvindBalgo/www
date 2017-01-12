angular
    .module('myApp')
    .controller('mainController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {
        //Setup view model object
        console.log('main CONTROLLER');
        Data.get('session.php').then(function (results) {
            if(results.uid){
                $scope.isLogged = true;
                $scope.utilisateur = results.name;
            }
            $scope.sessionInfo = results;
            $location.path('home');
        });

       /* $scope.doLogin = function (customer) {
            Data.post('login', {
                customer: customer
            }).then(function (results) {
                    console.log("RESULTS", results);
                    Data.toast(results);
                    if (results.status == "success" && $location.path() != '/fichetech') {
                            $location.path('home');
                    }
                });
        };*/

        $scope.doLogin = function(customer){
            console.log(customer ,  "  :::  ");
            //var customer = {};
            //customer.email=customer.username;
            //customer.password=customer.password;
            Data.post('loginClient.php', {
                customer: customer
            }).then(function (results) {
                    console.log("RESULTS", results);
                    Data.toast(results);
                    if (results.status == "success") {
                        if(results.uid){
                            if($location.path() != '/fichetech'){
                                $location.path('home');
                            }

                            $timeout(function() {
                                $scope.isLogged = true;
                                $scope.utilisateur = results.name;
                            }, 2000);
                        }

                        toastr.options.positionClass = 'toast-top-right';
                        toastr.success('Bienvenue ' + results.name);

                    }
                });
        }

        $scope.signUp = function (customer) {
            console.log("customer" , customer);
            Data.post('signupClient.php', {
                customer: customer
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    $location.path('home');
                }
            });
        };

        $scope.logout = function () {
            Data.get('logout').then(function (results) {
                Data.toast(results);
                $location.path('home');
            });
        }
    });
