angular
    .module('myApp')
    .controller('tutorielsController', function ($scope, $location, $timeout, messages, $http, Data) {
        var vm = this;
        vm.title = "";
        vm.contenu = "";
        vm.id = 0;
        vm.arrContents = [];
        vm.isFrance = false;
        vm.arrData = [];

        vm.fnInit = function () {
            var param = sessionStorage.getItem('LANG');
            if (param == "") {
                param = "FR";
                vm.isFrance = true;
            }
            var langSel = sessionStorage.getItem('LANG');
            if (langSel == "" || langSel == null) {
                return;
            }
            $http({
                method: 'GET',
                params: {mode: 3, pays: langSel},
                url: 'api/v1/produitCRUD.php'
            }).then(function successCallback(response) {
                $scope.pub_src = response.data.link;
                vm.fnVideos();
            }, function errorCallback(error) {

            });
        };

        vm.fnVideos = function() {
            $http({
                method: 'GET',
                params: {mode: 1},
                url: 'api/v1/youtube.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                vm.arrData = response.data;
            }, function errorCallback(error) {

            });
        }

        var lang = sessionStorage.getItem("LANG");
        $http({
            method: 'GET',
            params: {mode: 3, lang: lang},
            url: 'api/v1/langueCRUD.php'
        }).then(function successCallback(response) {
            console.log(response.data);
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
