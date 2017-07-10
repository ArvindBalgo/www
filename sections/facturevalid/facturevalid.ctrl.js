
angular
    .module('myApp')
    .controller('factureValidController', function($scope, $location, $timeout, messages, $http, Data) {
        var vm = this;
        vm.title = "";
        vm.contenu = "";
        vm.id=0;
        vm.arrContents = [];
        vm.isFrance = false;
        
        vm.fnInit = function() {
            var arrListCheckoutProds = new Array();
            angular.forEach(vm.arrProduits, function (value, key) {
                arrListCheckoutProds[key] = {};
                arrListCheckoutProds[key][value.idn_key] = value.random_str;
                // arrListCheckoutProds.push(value.random_str);
            });
            console.log(JSON.stringify(arrListCheckoutProds));
            $http({
                method: 'GET',
                params: {mode: 20, list: JSON.stringify(arrListCheckoutProds)},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                    vm.arrProduits = [];
                    sessionStorage.clear();
                    toastr.success("Order Confirmed");
                }
                , function errorCallback(error) {
                    console.log(error);
                });
        };

       /* var lang = 'FR';
        $http({
            method: 'GET',
            params: {mode:3, lang:'FR'},
            url: 'api/v1/langueCRUD.php'
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.langue = angular.copy(response.data);
            vm.fnInit();
        });

        if(lang =='FR') {
            vm.isFrance = true;
        }*/
       // $scope.$watch('isActualLang', function(ov, nv) {
            vm.fnInit();
      //  });
    });
