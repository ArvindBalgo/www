angular
    .module('adminApp')
    .controller('prodClientController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, $routeParams) {
        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        $scope.header = "Produit Client";
        vm.currentProd = $routeParams.idCommDetail;
        console.log(vm.currentProd, "current produit");

    });
