angular
    .module('adminApp')
    .controller('legaleController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {
        console.log("legaleController controller");

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        $scope.header = "Mentions légales";
        vm.title = "";
        vm.contenu = "";
        vm.id=0;

        vm.fnInit = function() {
            $http({
                method: 'GET',
                params: {mode:3, type:4},
                url: 'api/v1/metierCRUD.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                vm.id=response.data.id;
                vm.title = response.data.title;
                vm.contenu = response.data.description;
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnValid = function() {
            console.log(vm.title, "title");
            console.log(vm.contenu , " contenu");
            if(vm.title.trim() == "" || vm.contenu.trim() == "") {
                bootbox.alert("<div style='text-align: center'> <h4>Veuilez renseigner tous les champs svp.</h4></div>")
                return;
            }
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
                                params: {mode:4, id:vm.id,type:'legale', title:vm.title, contenu:vm.contenu},
                                url: 'api/v1/metierCRUD.php'
                            }).then(function successCallback(response) {
                                console.log(response.data);
                                vm.fnInit();
                            }, function errorCallback(error) {
                                console.log(error);
                            });
                        }
                    }
                }
            });
        };

        vm.fnInit();
    });
