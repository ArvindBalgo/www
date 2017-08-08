angular
    .module('myApp')
    .controller('checkoutController', function ($scope, $location, $timeout, messages, $http, Data) {
        var vm = this;
        vm.title = "";
        vm.contenu = "";
        vm.id = 0;
        vm.arrContents = [];
        vm.isFrance = false;
        vm.montants = {frais_livr: 0, prix_total_ht: 0, tax: 0, prix_ttc: 0, montant_net: 0, montant_net_orig: 0};
        vm.arrProduits = [];
        vm.userDetails = [];
        vm.discountCode = "";
        vm.strMsgCode = "Verification Code";

        vm.lang = sessionStorage.getItem("LANG");
        if (vm.lang == "" || vm.lang == null) {
            vm.lang = "FR";
        }
        if (vm.lang == 'AL') {
            vm.lang = 'DE'
        }
        vm.fnInit = function () {
            var param = sessionStorage.getItem('LANG');
            if (param == "") {
                param = "FR";
            }
        };


        vm.fnGetInfo = function () {
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
                vm.montants.montant_net_orig = Number((vm.montants.prix_ttc)) + Number((vm.montants.frais_livr)) + Number(vm.montants.taxLivr);
                vm.montants.montant_net = vm.montants.montant_net.toFixed(2);

            }, function errorCallback(error) {
                console.log(error);
            });
        }

        vm.fnCheckCode = function () {
            if (vm.discountCode == "") {
                vm.isDiscountChecked = true;
                vm.strMsgCode = "Code Invalid";
                sessionStorage.removeItem("coupon");
                vm.montants.montant_net = vm.montants.montant_net_orig.toFixed(2);
                return;
            }
            sessionStorage.removeItem("coupon");
            vm.isDiscountChecked = true;
            vm.strMsgCode = "Verification Code";
            $http({
                method: 'GET',
                params: {mode: 17, code: vm.discountCode},
                url: 'api/v1/metierCRUD.php'
            }).then(function successCallback(response) {
                if (response.data.authentificate == 'NOTVALID') {
                    vm.strMsgCode = "Code Invalid";
                    sessionStorage.removeItem("coupon");
                }
                else {
                    vm.strMsgCode = "Remise: " + response.data.montant + " %";
                    vm.montants.montant_net = (vm.montants.montant_net_orig * (1 - (response.data.montant / 100))).toFixed(2);
                    vm.montants.montant_net_orig = vm.montants.montant_net.toFixed(2);
                    sessionStorage.setItem("coupon", response.data.id);
                }
            }, function errorCallback(error) {
                console.log(error);
            });

        };

        vm.getInfoUser = function () {
            Data.get('session.php').then(function (results) {
                if (results.uid) {
                    vm.userDetails = results;
                }
                $scope.sessionInfo = results;
            });
        };

        vm.fnPay = function () {
            vm.lang = sessionStorage.getItem("LANG");
            if (vm.lang == "" || vm.lang == null) {
                vm.lang = "FR";
            }
            if (vm.lang == 'AL') {
                vm.lang = 'DE'
            }

            vm.arrProduits = [];
            var count = Number(sessionStorage.getItem("produitCount"));
            var arrProds = JSON.parse(sessionStorage.getItem("arrProds"));
            if (arrProds != null) {
                angular.forEach(arrProds, function (value) {
                    vm.arrProduits.push(JSON.parse(sessionStorage.getItem(value)));
                });
            }

            var arrListCheckoutProds = new Array();
            angular.forEach(vm.arrProduits, function (value, key) {
                arrListCheckoutProds[key] = {};
                arrListCheckoutProds[key][value.idn_key] = value.random_str;
                // arrListCheckoutProds.push(value.random_str);
            });

            var valCoupon = sessionStorage.getItem("coupon");
            if (!valCoupon) {
                valCoupon = "";
            }
            $http({
                method: 'GET',
                params: {mode: 20, list: JSON.stringify(arrListCheckoutProds), coupon: valCoupon},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                    vm.arrProduits = [];
                    //sessionStorage.clear();
                    toastr.success("Order Confirmed");
                }
                , function errorCallback(error) {
                    console.log(error);
                });

            /*
             To submit to kliknpay
             document.getElementById("knp-form").submit();
             */
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


        $(document).ready(function () {
            $('.modal-backdrop').remove();
            vm.getInfoUser();
            vm.fnGetInfo();
        })
    });
