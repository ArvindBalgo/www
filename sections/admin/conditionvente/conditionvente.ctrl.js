angular
    .module('adminApp')
    .controller('conditionventeController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {
        console.log("conditionventeController controller");

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        $scope.header = "Conditions de vente";
        vm.title = "";
        vm.contenu = "";
        vm.id=0;
        vm.objconditionvente = [];

        vm.fnInit = function() {
            var selPays = "";
            selPays = $('input[name=selLang]:checked').val();
            $http({
                method: 'GET',
                params: {mode:10, type:2, param:selPays},
                url: 'api/v1/metierCRUD.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                vm.title = response.data.title;
                vm.dataText = response.data.data;
                vm.objconditionvente = angular.copy(response.data);
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
                params: {mode:11, type:2, param:selPays},
                url: 'api/v1/metierCRUD.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                vm.title = response.data.title;
                vm.dataText = response.data.data;
                vm.objconditionvente = angular.copy(response.data);
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
            console.log(vm.objconditionvente);
            /*if(vm.title.trim() == "" || vm.contenu.trim() == "") {
             bootbox.alert("<div style='text-align: center'> <h4>Veuilez renseigner tous les champs svp.</h4></div>")
             return;
             }*/
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
                            var selPays = "";
                            selPays = $('input[name=selLang]:checked').val();

                            $http({
                                method: 'GET',
                                params: {mode:6, contenu:JSON.stringify(vm.objconditionvente), param:selPays},
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
            console.log(objLigne , " objligne  <== ");
            var selPays = "";
            selPays = $('input[name=selLang]:checked').val();

            $http({
                method: 'GET',
                params: {mode:12, contenu:JSON.stringify(objLigne), param: selPays},
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
                params: {mode:13, id:objLigne.id, param:selPays},
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
                params: {mode:14,  contenu:JSON.stringify(vm.objconditionvente), param:selPays},
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
