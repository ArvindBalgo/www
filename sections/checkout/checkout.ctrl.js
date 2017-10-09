angular
    .module('myApp')
    .controller('checkoutController', function ($scope, $location, $timeout, messages, $http, Data) {
        var vm = this;
        vm.title = "";
        vm.contenu = "";
        vm.id = 0;
        vm.arrContents = [];
        vm.isFrance = false;
        vm.montants = {frais_livr: 0, prix_total_ht: 0, tax: 0, prix_ttc: 0, montant_net: 0, montant_net_orig: 0, tax_ttc:0};
        vm.arrProduits = [];
        vm.userDetails = [];
        vm.discountCode = "";
        vm.strMsgCode = "Verification Code";
        vm.userState = '';
        vm.states = [];
        vm.xfois = "2FOIS";
        vm.orderNum = 0;
        vm.xmois = 1;
        vm.isSalesman = 0;
        vm.percDiscount = 0;
        vm.strMsgDiscount = "";
        vm.listClients = [];
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

            $http({
                method: 'GET',
                params: {mode: 21, lang: param},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                vm.states = [];
                angular.forEach(response.data, function (value) {
                    vm.states.push(value);
                })
                vm.userState = 0;
                vm.fnLoadPub();
            });
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
                vm.fnGetListClients();
                var arrFraisLivr = response.data;

                vm.montants.frais_livr = 0;
                vm.montants.prix_total_ht = 0;
                vm.montants.tax = 0;
                vm.montants.valTax = 0;
                vm.montants.prix_ttc = 0;
                vm.montants.montant_net = 0;
                vm.montants.tax_ttc = 0;

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
                vm.montants.tax_ttc = ((Number(arrFraisLivr.tax) / 100) * vm.montants.prix_total_ht) + ((Number(arrFraisLivr.tax) / 100) * vm.montants.frais_livr);
                vm.montants.valTax = (1 + (Number(arrFraisLivr.tax) / 100));
                vm.montants.prix_ttc = Number(vm.montants.prix_total_ht) + Number(vm.montants.tax);
                vm.montants.prix_ttc = (vm.montants.prix_ttc).toFixed(2);
                vm.montants.montant_net = Number((vm.montants.prix_ttc)) + Number((vm.montants.frais_livr)) + Number(vm.montants.taxLivr);
                vm.montants.montant_net_orig = angular.copy(Number((vm.montants.prix_ttc)) + Number((vm.montants.frais_livr)) + Number(vm.montants.taxLivr));
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
                    //vm.montants.montant_net_orig = vm.montants.montant_net;
                    sessionStorage.setItem("coupon", response.data.id);
                }
            }, function errorCallback(error) {
                console.log(error);
            });

        };

        vm.fnCheckXmois = function () {
            console.log(vm.xmois, " setup of xmois ");
            if (vm.xmois > 6) {
                vm.xmois = 6;
            }
            if (vm.xmois < 1) {
                vm.xmois = 1;
            }
        }

        vm.getInfoUser = function () {
            Data.get('session.php').then(function (results) {
                if (results.uid) {
                    //vm.userDetails = results;
                    console.log(results);
                    vm.isSalesman = results.salesman;
                    vm.getUserDetails();
                    vm.getSalesmanDetails(results.uid);
                }
                $scope.sessionInfo = results;
            });
        };

        vm.getUserDetails = function () {
            $http({
                method: 'GET',
                params: {mode: 1},
                url: 'api/v1/user_crud.php'
            }).then(function successCallback(response) {
                vm.userDetails = response.data;
                console.log(vm.userDetails, " ==>");
            }, function errorCallback(error) {

            });
        };

        vm.getSalesmanDetails = function (uid) {
            $http({
                method: 'GET',
                params: {mode: 3, id:uid},
                url: 'api/v1/user_crud.php'
            }).then(function successCallback(response) {
                vm.salesmanDetails = response.data;
                console.log(vm.salesmanDetails, " ==>");
            }, function errorCallback(error) {

            });
        };


        vm.fnLoadPub = function () {
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
            }, function errorCallback(error) {

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
            });

            var valCoupon = sessionStorage.getItem("coupon");
            if (!valCoupon) {
                valCoupon = "";
            }
            $('body').addClass("spinner");
            $http({
                method: 'GET',
                params: {mode: 20, list: JSON.stringify(arrListCheckoutProds), coupon: valCoupon},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                    vm.arrProduits = [];
                    //sessionStorage.clear();
                    // toastr.success("Order Confirmed");
                    // To submit to kliknpay
                    vm.orderNum = response.data.id;
                    $("#dp_retourvok1").val(response.data.id);
                    $("#dp_retourvok").val(response.data.id);
                    $("#dp_retourvhs").val(response.data.id);
                    $("#dp_retourvhs1").val(response.data.id);
                    $("#id_xfois").val(vm.userState + 1 + "FOIS");

                    $('body').removeClass("spinner");
                    if (vm.userState >= 1) {
                      //  vm.xfois = vm.userState + 1 + "FOIS";

                        document.getElementById("knp-form_xfois").submit();
                    }
                    else {
                        document.getElementById("knp-form").submit();
                    }
                    //document.getElementById("knp-form").submit();
                }
                , function errorCallback(error) {
                    console.log(error);
                    $('body').removeClass("spinner");
                });
        };

        vm.fnPayCommercial = function () {
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
            });

            var valCoupon = sessionStorage.getItem("coupon");
            if (!valCoupon) {
                valCoupon = "";
            }
            $('body').addClass("spinner");
            $http({
                method: 'GET',
                params: {mode: 22, list: JSON.stringify(arrListCheckoutProds), coupon: valCoupon, id_user:vm.selectedClient.uid, percent_disc:vm.percDiscount},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                    vm.arrProduits = [];
                    sessionStorage.clear();
                    // toastr.success("Order Confirmed");
                    // To submit to kliknpay
                    vm.orderNum = response.data.id;
                    $location.path('/client');
                    $('body').removeClass("spinner");
                }
                , function errorCallback(error) {
                    console.log(error);
                    $('body').removeClass("spinner");
                });
        };

        vm.fnCalcDisc = function() {
            if(parseInt(vm.percDiscount) < parseInt(vm.salesmanDetails.minval) || parseInt(vm.percDiscount) > parseInt(vm.salesmanDetails.maxval)) {
                vm.montants.montant_net = (vm.montants.montant_net_orig).toFixed(2);
                vm.strMsgDiscount = "% hors limit.";
                vm.percDiscount = 0;
                return;
            }
            vm.montants.montant_net = (vm.montants.montant_net_orig * (1 - (vm.percDiscount / 100))).toFixed(2);
            vm.strMsgDiscount = (vm.montants.montant_net_orig - vm.montants.montant_net).toFixed(2) + " Euro";
        };

        vm.fnGetListClients = function(){
            $http({
                method: 'GET',
                params: {mode: 4},
                url: 'api/v1/user_crud.php'
            }).then(function successCallback(response) {
               console.log(response.data);
               vm.listClients = response.data;
               vm.selClient = "";
            });
        };

        vm.test = function() {
            vm.selectedClient = JSON.parse(vm.selClient);
        }


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
