angular
    .module('adminApp')
    .controller('aproposController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {
        console.log("apropos controller");

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        $scope.header = "Qui sommes nous?";
        vm.title = "";
        vm.contenu = "";
        vm.dataText=[];
        vm.id=0;
        vm.objApropos = [];
        var selPays = "";
        selPays = $('input[name=selLang]:checked').val();
        vm.fnInit = function() {

            $http({
                method: 'GET',
                params: {mode:3, type:1, param:selPays},
                url: 'api/v1/metierCRUD.php'
            }).then(function successCallback(response) {
                console.clear();
                console.log(response.data);
                vm.title = response.data.title;
                vm.dataText = response.data.data;
                vm.objApropos = angular.copy(response.data);
                //vm.id=response.data.id;
               // vm.title = response.data.title;
                //vm.contenu = response.data.description;
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnNew = function() {
            //vm.dataText.push({id:0 , description:''});
            var selPays = "";
            selPays = $('input[name=selLang]:checked').val();
            $http({
                method: 'GET',
                params: {mode:5, type:1, param:selPays},
                url: 'api/v1/metierCRUD.php'
            }).then(function successCallback(response) {
                console.clear();
                console.log(response.data);
                vm.title = response.data.title;
                vm.dataText = response.data.data;
                vm.objApropos = angular.copy(response.data);
                //vm.id=response.data.id;
                // vm.title = response.data.title;
                //vm.contenu = response.data.description;
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnValid = function() {
            //console.log(vm.title, "title");
            //console.log(vm.contenu , " contenu");
            console.log(vm.objApropos);
            /*if(vm.title.trim() == "" || vm.contenu.trim() == "") {
                bootbox.alert("<div style='text-align: center'> <h4>Veuilez renseigner tous les champs svp.</h4></div>")
                return;
            }*/
            var selPays = "";
            selPays = $('input[name=selLang]:checked').val();
            bootbox.dialog({
                message: "Confirmez-vous la sauvegarde?",
                title: "Sauvegarde",
                buttons: {
                    annuler: {
                        label: "Non",
                        className: "btn-secondary",
                        callback: function() {
                            console.log("Annulation");
                        }
                    },
                    valider: {
                        label: "Oui",
                        className: "btn-success",
                        callback: function() {
                            $http({
                                method: 'GET',
                                params: {mode:6, contenu:JSON.stringify(vm.objApropos), param:selPays},
                                url: 'api/v1/metierCRUD.php'
                            }).then(function successCallback(response) {
                                console.log(response.data);
                                //vm.fnInit();
                            }, function errorCallback(error) {
                                console.log(error);
                            });
                        }
                    }
                }
            });
        };

        vm.fnValidLigne = function(objLigne){
            var selPays = "";
            selPays = $('input[name=selLang]:checked').val();
            $http({
                method: 'GET',
                params: {mode:7, contenu:JSON.stringify(objLigne), param:selPays},
                url: 'api/v1/metierCRUD.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                bootbox.alert("Sauvegarde terminer");
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnDelLigne  = function (objLigne) {
            var selPays = "";
            selPays = $('input[name=selLang]:checked').val();

            $http({
                method: 'GET',
                params: {mode:8, id:objLigne.id, param:selPays},
                url: 'api/v1/metierCRUD.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                bootbox.alert("Suppression terminer");
                vm.fnInit();
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnValidHeader = function(){
            var selPays = "";
            selPays = $('input[name=selLang]:checked').val();

            $http({
                method: 'GET',
                params: {mode:9,  contenu:JSON.stringify(vm.objApropos), param:selPays},
                url: 'api/v1/metierCRUD.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                bootbox.alert("Sauvegarde terminer");
                vm.fnInit();
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnRadioPays = function(pays) {
            vm.fnInit();
        };

        vm.fnInit();
    });
