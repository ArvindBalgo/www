
angular
    .module('myApp')
    .controller('clientController', function($scope, $location, $timeout, messages, $http, Data, $translate) {
        var vm = this;
        $scope.isFiche = true;
        var lang = sessionStorage.getItem("LANG");
        vm.isDiv = false;
        vm.isFrance= false;
        $http({
            method: 'GET',
            params: {mode:3, lang:lang},
            url: 'api/v1/langueCRUD.php'
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.langue = angular.copy(response.data);
        });

        $http({
            method: 'POST',
            data: $.param({mode:6}),
            url: 'api/v1/commande.php',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            console.log(response.data);
            vm.myOrders = response.data;
        });

        if(lang == "" || lang == null) {
            vm.isFrance = false;
        }
        else if(lang == 'FR') {
            vm.isFrance  = true;
        }

        vm.people = [
            { name: 'Janet Perkins', img: 'img/100-0.jpeg', newMessage: true },
            { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
            { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false }
        ];

        $scope.setLang = function(langKey) {
            $translate.use(langKey);
        };

        $scope.$watch('isActualLang', function(ov, nv) {
            $scope.setLang(sessionStorage.getItem("LANG"));
        });

        vm.fnToggleTab = function(val) {
            if(Number(val) == 1) {
                if($('#collapseOne:visible').length == 0)
                {
                    $("#collapseOne").show();
                }
                else{
                    $("#collapseOne").hide();
                }
                $("#collapseTwo").hide();
                $("#collapseThree").hide();
                $("#collapseFour").hide();
            }
            else if(Number(val) == 2){
                if($('#collapseTwo:visible').length == 0)
                {
                    $("#collapseTwo").show();
                }
                else{
                    $("#collapseTwo").hide();
                }
                $("#collapseOne").hide();
                $("#collapseThree").hide();
                $("#collapseFour").hide();
            }
            else if(Number(val) == 3){
                if($('#collapseThree:visible').length == 0)
                {
                    $("#collapseThree").show();
                }
                else{
                    $("#collapseThree").hide();
                }
                $("#collapseOne").hide();
                $("#collapseTwo").hide();
                $("#collapseFour").hide();
            }
            else if(Number(val) == 4){
                if($('#collapseFour:visible').length == 0)
                {
                    $("#collapseFour").show();
                }
                else{
                    $("#collapseFour").hide();
                }
                $("#collapseOne").hide();
                $("#collapseTwo").hide();
                $("#collapseThree").hide();
            }
        };
        
        vm.fnChangeDiv = function() {
            console.log("div cliekd")
            console.log(vm.isDiv);
            $("#espaceClient").hide();
            $("#divClient").show();
        }
        
    });
