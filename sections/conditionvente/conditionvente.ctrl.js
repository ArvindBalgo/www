
angular
    .module('myApp')
    .controller('conditionventeController', function($scope, $location, $timeout, messages, $http, Data, $sanitize) {
        var vm = this;
        vm.title = "";
        vm.contenu = "";
        vm.id=0;
        vm.arrContents = [];
        vm.isFrance = false;

        vm.fnInit = function() {
            var param = localStorage.getItem('LANG');
            if(param == "") {
                param = "FR";
            }
            $http({
                method: 'GET',
                params: {mode:10, type:2, param:param},
                url: 'api/v1/metierCRUD.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                vm.id=response.data.id;
                vm.title = response.data.title;
                vm.contenu = response.data.description;
                vm.arrContents = angular.copy(response.data);
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        var lang = localStorage.getItem("LANG");
        $http({
            method: 'GET',
            params: {mode:3, lang:lang},
            url: 'api/v1/langueCRUD.php'
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.langue = angular.copy(response.data);
            vm.fnInit();
        });

        if(lang == 'FR') {
            vm.isFrance = true;
        }

        $scope.$watch('isActualLang', function(ov, nv) {
            vm.fnInit();
        });
        //vm.fnInit();
    });
