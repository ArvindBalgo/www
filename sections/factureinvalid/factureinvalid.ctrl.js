angular
    .module('myApp')
    .controller('factureInvalidController', function ($scope, $location, $timeout, messages, $http, Data) {
        var vm = this;
        vm.title = "";
        vm.contenu = "";
        vm.id = 0;
        vm.arrContents = [];
        vm.isFrance = false;

        vm.fnInit = function () {
            var param = sessionStorage.getItem('LANG');
            if (param == "") {
                param = "FR";
            }

        };

        var lang = sessionStorage.getItem("LANG");
        $http({
            method: 'GET',
            params: {mode: 3, lang: lang},
            url: 'api/v1/langueCRUD.php'
        }).then(function successCallback(response) {
            $scope.langue = angular.copy(response.data);
            vm.fnInit();
        });

        if (lang == 'FR') {
            vm.isFrance = true;
        }
        $scope.$watch('isActualLang', function (ov, nv) {
            vm.fnInit();
        });
    });
