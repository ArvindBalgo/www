angular
    .module('adminApp')
    .controller('utilisationController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        $scope.header = "Mentions d'utilisation";
        vm.title = "";
        vm.contenu = "";
        vm.id=0;

        vm.fnInit = function() {
            var selPays = "";
            selPays = $('input[name=selLang]:checked').val();
            $http({
                method: 'GET',
                params: {mode:3, type:3, param:selPays},
                url: 'api/v1/metierCRUD.php'
            }).then(function successCallback(response) {
                vm.id=response.data.id;
                vm.title = response.data.title;
                vm.contenu = response.data.description;
            }, function errorCallback(error) {
            });
        };

        vm.fnValid = function() {
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
                                params: {mode:4, id:vm.id,type:'utilisation', title:vm.title, contenu:vm.contenu, param:selPays},
                                url: 'api/v1/metierCRUD.php'
                            }).then(function successCallback(response) {
                                vm.fnInit();
                            }, function errorCallback(error) {
                            });
                        }
                    }
                }
            });
        };

        vm.fnRadioPays = function(pays) {
            vm.fnInit();
        };

        vm.fnInit();
    });
