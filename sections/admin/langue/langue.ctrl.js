angular
    .module('adminApp')
    .controller('langueController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, $sanitize) {
        console.log("langue controller");

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        $scope.header = "Language";
        vm.arrDataOrig = [];
        vm.arrData = [];
        vm.message  = "";

        vm.fnNew = function() {
            bootbox.prompt({
                title: "Mot clé",
                inputType: 'text',
                callback: function (result) {
                    console.log(result);
                    if(result != null && result.trim() != ""){
                        vm.fnVerifDoublon(result);
                    }
                }
            });
        };
        
        vm.fnVerifDoublon = function(keyword) {
            $http({
                method: 'GET',
                params: {mode:1, keyword:keyword},
                url: 'api/v1/langueCRUD.php'
            }).then(function successCallback(response) {

                console.log(response.data);
                if(response.data == 1) {
                    bootbox.prompt({
                        title: "Mot clé existe déjà, veuillez renseigner un autre",
                        inputType: 'text',
                        callback: function (result) {
                            console.log(result);
                            if(result !=  null && result.trim() != ""){
                                vm.fnVerifDoublon(result);
                            }
                        }
                    });
                }
                else{
                    vm.fnInit();
                }
            }, function errorCallback(error) {
                console.log(error);
            });
        }

        vm.fnInit = function() {
            $http({
                method: 'GET',
                params: {mode:0},
                url: 'api/v1/langueCRUD.php'
            }).then(function successCallback(response) {

                console.log(response.data);
                vm.arrDataOrig = angular.copy(response.data);
                vm.arrData = response.data;
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnValider = function(obj) {
            console.log(obj);

            $http({
                method: 'GET',
                params: {mode:2, obj:JSON.stringify(obj)},
                url: 'api/v1/langueCRUD.php'
            }).then(function successCallback(response) {

                console.log(response.data);
                //vm.arrDataOrig = angular.copy(response.data);
                //vm.arrData = response.data;
                var text_msg = "<b> Ligne "+obj.key_identifier+" a été modifié et sauvegardé </b>";
                vm.message += text_msg+" <br>";
            }, function errorCallback(error) {
                console.log(error);
            });
            
        };

        vm.fnInitialiser = function(obj) {
            var objOrig = {};
            angular.forEach(vm.arrDataOrig, function(value) {
               if(value.id == obj.id) {
                   objOrig = value;
               }
            });
            angular.forEach(vm.arrData, function(value) {
                if(value.id == obj.id) {
                    console.log(value, objOrig);
                    value.english = objOrig.english;
                    value.french = objOrig.french;
                    value.spanish = objOrig.spanish;
                    value.german = objOrig.german;
                    value.italien = objOrig.italien;
                }
            });
        };
        
        vm.fnInit();
        
        $(document).keydown(function(e){
            //tab
            if(e.keyCode == 9 ){
                //vm.fnNew();
            }
        });
    });
