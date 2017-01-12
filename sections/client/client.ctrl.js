
angular
    .module('myApp')
    .controller('clientController', function($scope, $location, $timeout, messages, $http, Data) {
        var vm = this;
        $scope.isFiche = true;
        $lang = localStorage.getItem("LANG");
        vm.isDiv = false;
        $http({
            method: 'GET',
            params: {mode:3, lang:$lang},
            url: 'api/v1/langueCRUD.php'
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.langue = angular.copy(response.data);
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
