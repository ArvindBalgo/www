
angular
    .module('myApp')
    .controller('checkoutController', function($scope, $location, $timeout, messages, $http, Data) {
        var vm = this;
        vm.title = "";
        vm.contenu = "";
        vm.id=0;
        vm.arrContents = [];
        vm.isFrance = false;
        vm.montants = {frais_livr: 0, prix_total_ht: 0, tax: 0, prix_ttc: 0, montant_net: 0};
        vm.arrProduits = [];
        vm.userDetails = [];
        vm.lang = sessionStorage.getItem("LANG");
        if (vm.lang == "" || vm.lang == null) {
            vm.lang = "FR";
        }
        if(vm.lang == 'AL') {
            vm.lang = 'DE'
        }
console.clear();
        console.log(vm.lang);
        vm.fnInit = function() {
            var param = sessionStorage.getItem('LANG');
            if(param == "") {
                param = "FR";
            }
        };


        vm.fnGetInfo = function() {
            vm.arrProduits = [];
            var count = Number(sessionStorage.getItem("produitCount"));
            var arrProds = JSON.parse(sessionStorage.getItem("arrProds"));
            if (arrProds != null) {
                angular.forEach(arrProds, function (value) {
                    vm.arrProduits.push(JSON.parse(sessionStorage.getItem(value)));
                });
            }

            var arrKeysDL = [];
            angular.forEach(vm.arrProduits, function (value) {
                arrKeysDL.push({'idprod': value.idProduit, 'qte': value.qte, 'dimension': value.dimension});
            });

            $http({
                method: 'GET',
                params: {mode: 19, data: JSON.stringify(arrKeysDL)},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                //console.clear();
                console.log(vm.arrProduits);
                console.log(response.data);
                var arrFraisLivr = response.data;

                vm.montants.frais_livr = 0;
                vm.montants.prix_total_ht = 0;
                vm.montants.tax = 0;
                vm.montants.valTax = 0;
                vm.montants.prix_ttc = 0;
                vm.montants.montant_net = 0;

                angular.forEach(vm.arrProduits, function (value) {
                    angular.forEach(arrFraisLivr.frais_livraison, function (item) {
                        if (item.qte.trim() == value.qte.trim() && item.dimension.trim() == value.dimension.trim()) {
                            vm.montants.frais_livr += Number(item.price);
                        }
                    });
                    vm.montants.prix_total_ht += Number(value.unitprix) * Number(value.qte);
                });
                vm.montants.frais_livr = (vm.montants.frais_livr).toFixed(2);
                vm.montants.prix_total_ht = vm.montants.prix_total_ht.toFixed(2);
                vm.montants.tax = ((Number(arrFraisLivr.tax) / 100) * vm.montants.prix_total_ht).toFixed(2);
                vm.montants.taxLivr = ((Number(arrFraisLivr.tax) / 100) * vm.montants.frais_livr).toFixed(2);
                vm.montants.valTax = (1 + (Number(arrFraisLivr.tax) / 100));
                vm.montants.prix_ttc = Number(vm.montants.prix_total_ht) + Number(vm.montants.tax);
                vm.montants.prix_ttc = (vm.montants.prix_ttc).toFixed(2);
                vm.montants.montant_net = Number((vm.montants.prix_ttc)) + Number((vm.montants.frais_livr)) + Number(vm.montants.taxLivr);
                vm.montants.montant_net = vm.montants.montant_net;

                console.log("************************************************");
                console.log(vm.montants);
                console.log(vm.arrProduits);
                console.log(arrFraisLivr);
                console.log("************************************************");

            }, function errorCallback(error) {
                console.log(error);
            });
        }

        vm.getInfoUser = function() {
            Data.get('session.php').then(function (results) {
                console.log(results, "  DATA results");
                if (results.uid) {
                    console.log(results, "info results");
                    vm.userDetails = results;
                }
                $scope.sessionInfo = results;
                });
        }

        vm.fnPay = function () {
            vm.lang = sessionStorage.getItem("LANG");
            if (vm.lang == "" || vm.lang == null) {
                vm.lang = "FR";
            }
            if(vm.lang == 'AL') {
                vm.lang = 'DE'
            }
            console.log(vm.lang , " ======");
          //  document.getElementById("knp-form").submit();
        };

        var lang = sessionStorage.getItem("LANG");
        $http({
            method: 'GET',
            params: {mode:3, lang:lang},
            url: 'api/v1/langueCRUD.php'
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.langue = angular.copy(response.data);
            vm.fnInit();
        });

        if(lang =='FR') {
            vm.isFrance = true;
        }

        $scope.$watch('isActualLang', function(ov, nv) {
            vm.fnInit();
        });


        $(document).ready(function(){
            $('.modal-backdrop').remove();
            vm.getInfoUser();
            vm.fnGetInfo();
        })
    });
