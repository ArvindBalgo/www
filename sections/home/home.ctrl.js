angular
    .module('myApp')
    .controller('HomeController', function ($scope, $location, $http, Data, messages, $timeout, $translate) {
        //Setup view model object
        console.log('HOME CONTROLLER');
        // spinnerService.show('spin');
        toastr.options.positionClass = 'toast-top-full-width';

        var vm = this;

        //angular translate
        $scope.setLang = function (langKey) {
            // You can change the language during runtime
            $translate.use(langKey);
        };
        // end angular translate
        //document.getElementById("loader").style.display = "none";
        vm.btnMetierOrig = [];
        vm.btnMetier = [];
        vm.sampleMetier = [];
        vm.listProduits = [];
        vm.currentCategory = {};
        vm.currentSCategory = {};
        vm.globalVal = '';
        vm.activeId = "";
        vm.message = "";
        vm.origModels = [];
        vm.activeTabId = 1;
        vm.arrProds = [];
        vm.arrGabarits = [];
        $scope.isFiche = false;
        vm.isFrance = false;
        $scope.langue = [];
        vm.scat = {};
        vm.linkmonpanier = "../assets/carts/mon_panier.png";


        Data.get('session.php').then(function (results) {
            $scope.sessionInfo = results;
            if (results.uid) {
                $scope.isLogged = true;
                $scope.utilisateur = results.name;
            }
            $scope.sessionInfo = results;

            if (sessionStorage.getItem('LANG') == "" || sessionStorage.getItem('LANG') == null) {
                document.getElementById("myNav").style.width = "100%";

                $timeout(function () {
                    $(document).ready(function () {

                        // CSSMap;
                        $("#map-europe").CSSMap({
                            "size": 250,
                            "cities": true,
                            "tooltips": "floating-top-center",
                            "responsive": "auto",
                            "mapStyle": "vintage"
                        });
                        // END OF THE CSSMap;
                    });
                    $("#map-europe").removeClass("cssmap-250");
                    $("#map-europe").addClass("cssmap-650");
                }, 5);

                document.getElementById("panier_btn").style.display = "none";
                $('body').css({
                    'overflow': 'hidden'
                });
                vm.isFrance = false;
            }
            else {

                $translate.use(sessionStorage.getItem('LANG'));
                if (sessionStorage.getItem('LANG') == 'FR') {
                    vm.isFrance = true;
                }
                $http({
                    method: 'GET',
                    params: {mode: 3, lang: sessionStorage.getItem('LANG')},
                    url: 'api/v1/langueCRUD.php'
                }).then(function successCallback(response) {
                    $scope.langue = angular.copy(response.data);
                    document.getElementById("myNav").style.width = "0%";
                    document.getElementById("panier_btn").style.display = "block";
                    $('body').css({
                        'overflow': 'auto'
                    });
                    //toastr.success($scope.langue.welcome_msg);
                }, function errorCallback(error) {
                    console.log(error);
                });
            }
            //$( document ).width("1382");


        });

        vm.instructions = [];

        vm.description = "";
        vm.fnImgClick = function (data) {
            $('body').addClass("spinner");
            vm.description = data.description;
            vm.src = data.src;
            vm.currentCategory = angular.copy(data);

            $http({
                method: 'GET',
                params: {mode: 11, id: data.id},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                vm.sampleMetier = angular.copy(response.data);
                $('#myModel').on('show.bs.modal', function () {
                    $('.modal-body').css('height', $(window).innerHeight() * 0.75);
                });
                $('#myModel').modal();
                //$('#myModel').modal();
                document.body.style.overflow = "hidden";
                $('body').removeClass("spinner");
            }, function errorCallback(error) {
                $('body').removeClass("spinner");
            });

            //$location.path('fichetech');
        };

        vm.fnImgClick2 = function (data) {
            $('body').addClass("spinner");
            vm.description = vm.currentCategory.description + " - " + data.description;
            vm.src = data.src;
            vm.message = data.message;
            $http({
                method: 'GET',
                params: {mode: 12, id: data.id},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                $('body').removeClass("spinner");
                vm.arrProds = [];
                vm.arrGabarits = [];
                angular.forEach(response.data, function (value) {
                    if (value.gabarit == 0) {
                        vm.arrProds.push(value);
                    }
                    else {
                        vm.arrGabarits.push(value);
                    }
                });
                vm.listProduits = angular.copy(response.data);
                vm.scat = data;
                $('#myModel').modal('hide');
                $('#produits').modal();
                document.body.style.overflow = "hidden";
            }, function errorCallback(error) {
                $('body').removeClass("spinner");
            });
        };

        vm.fnImgClient = function (produit) {
            bootbox.alert("<img style='width: 100%;height: 100%' src='" + produit.base64_image + "'>");
        }

        vm.fnDelClient = function (produit) {
            bootbox.dialog({
                message: "Confirmez vous la suppression?",
                title: "Suppression",
                buttons: {
                    annuler: {
                        label: "Non",
                        className: "btn-secondary",
                        callback: function () {
                        }
                    },
                    valider: {
                        label: "Oui",
                        className: "btn-danger",
                        callback: function () {
                            sessionStorage.removeItem(produit.idn_key);
                            var arrProds = JSON.parse(sessionStorage.getItem("arrProds"));
                            arrProds.splice(arrProds.indexOf(produit.idn_key), 1);
                            sessionStorage.setItem("arrProds", JSON.stringify(arrProds));
                            angular.forEach(vm.arrProduits, function (value, key) {
                                if (value.idn_key == produit.idn_key) {
                                    vm.arrProduits.splice(key, 1);
                                }
                            });
                            $scope.$apply();
                        }
                    }
                }
            });
        }


        vm.fnRetourCategory = function () {
            $('#produits').modal('hide');
            vm.fnImgClick(vm.currentCategory);
        };

        //WEBSERVICE
        vm.fnRecupMetier = function () {
            $('body').addClass("spinner");
            $http({
                method: 'GET',
                params: {mode: 0},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                $('body').removeClass("spinner");
                vm.btnMetierOrig = angular.copy(response.data);
                vm.btnMetier = response.data;
                vm.activeId = response.data[0].id;
                vm.fnModelMetierAll();
            }, function errorCallback(error) {
                //console.log(error);
                $('body').removeClass("spinner");
            });
        };

        vm.fnInsertMetier = function (libelle, sub_libelle) {
            $http({
                method: 'GET',
                params: {mode: 1, desig: libelle, sub_desig: sub_libelle},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(error);
            });
        };

        vm.fnModelMetierAll = function () {
            $('body').addClass("spinner");
            $http({
                method: 'GET',
                params: {mode: 2},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                vm.fnLoadPub();
                $('body').removeClass("spinner");
                vm.origModels = angular.copy(response.data);
                // vm.metier = response.data;
                var arrModels = [];
                angular.forEach(response.data, function (value) {
                    if (value.category == vm.activeId) {
                        arrModels.push(value);
                    }
                });
                vm.metier = angular.copy(arrModels);
            }, function errorCallback(error) {

                $('body').removeClass("spinner");
            });
        };

        vm.fnModelClick = function ($id, $id_modelMetier, $id_cata, $id_metier) {
            //$('#myModel').modal('hide');
            vm.fnRemoveModal();
            sessionStorage.setItem("id_model", $id_cata);
            sessionStorage.setItem("idModelMetier", $id_modelMetier);
            sessionStorage.setItem("idMetier", $id_metier);
            $location.path('fichetech/' + $id_cata);
        };

        vm.fnClickBtn = function ($obj) {
            vm.activeId = $obj.id;
            var arrModels = [];
            if ($obj.libelle == "Tous les produits") {
                vm.metier = angular.copy(vm.origModels);
                return;
            }
            angular.forEach(vm.origModels, function (value) {
                if (value.category == $obj.id) {
                    arrModels.push(value);
                }
            });
            vm.metier = angular.copy(arrModels);
        };

        $scope.fnSignUp = function () {
            $('#myModal').modal('hide');
            $('#signup').modal();
        };

        vm.fnInstructions = function () {
            var param = sessionStorage.getItem('LANG');
            if (param == "") {
                param = "FR";
            }
            $http({
                method: 'GET',
                params: {mode: 11, param: param},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                vm.instructions = response.data;
                vm.fnRecupMetier();
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnRemoveModal = function () {
            $('#produits').modal('hide');
            $('#myModel').modal('hide');
            document.body.style.overflow = "scroll";
        };

        vm.fnClickLang = function ($lang) {
            sessionStorage.setItem("LANG", $lang);
            $translate.use($lang);
            $http({
                method: 'GET',
                params: {mode: 3, lang: $lang},
                url: 'api/v1/langueCRUD.php'
            }).then(function successCallback(response) {
                $scope.langue = angular.copy(response.data);
                document.getElementById("myNav").style.width = "0%";
                document.getElementById("panier_btn").style.display = "block";
                $('body').css({
                    'overflow': 'auto'
                });
                //toastr.success("Bienvenue chez Exakom, nous sommes à votre disposition si vous avez besoin d'aide");
                $scope.fnClickTest();
                vm.fnInstructions();
                vm.fnSetBtnMetiers();
                vm.fnLoadPub();
            }, function errorCallback(error) {
                console.log(error);
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
        }

        vm.fnClickTabs = function (tabVal) {
            vm.activeTabId = tabVal;
            vm.isShow = tabVal;
        };

        vm.fnSetBtnMetiers = function () {
            var lang_sel = sessionStorage.getItem('LANG');
            vm.btnMetier = angular.copy(vm.btnMetierOrig);
            if (lang_sel == "FR") {
                vm.isFrance = true;
                vm.linkmonpanier = "../assets/carts/mon_panier.png";
            }
            else {
                vm.isFrance = false;
            }
            if (lang_sel == 'EN') {
                /*angular.forEach(vm.btnMetier, function(value) {
                 value.libelle = value.libelle_en;
                 });*/
                vm.linkmonpanier = "../assets/carts/cart_english.png";
            }
            else if (lang_sel == 'AL') {
                /*angular.forEach(vm.btnMetier, function(value) {
                 value.libelle = value.libelle_al;
                 });*/
                vm.linkmonpanier = "../assets/carts/warenkorb_deutch.png";
            }
            else if (lang_sel == 'ES') {
                /*angular.forEach(vm.btnMetier, function(value) {
                 value.libelle = value.libelle_es;
                 });*/
                vm.linkmonpanier = "../assets/carts/cesta_espagnol.png";
            }
            else if (lang_sel == 'IT') {
                /*angular.forEach(vm.btnMetier, function(value) {
                 value.libelle = value.libelle_it;
                 });*/
                vm.linkmonpanier = "../assets/carts/carrello_italiano.png";
            }
        };

        vm.fnClickPanier = function () {
            vm.arrProduits = [];
            /*var count = Number(sessionStorage.getItem("produitCount"));
             var arrProds = JSON.parse(sessionStorage.getItem("arrProds"));
             if(arrProds != null) {
             angular.forEach(arrProds, function(value){
             vm.arrProduits.push(JSON.parse(sessionStorage.getItem(value)));
             });
             }*/
            /*$http({
                method: 'POST',
                data: $.param({mode: 1}),
                url: 'api/v1/recupTempProd.php',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                vm.arrProduits = response.data;
            }, function errorCallback(error) {
                console.log(error);
            });*/
            vm.arrProduits = [];
            var count = Number(sessionStorage.getItem("produitCount"));
            var arrProds = JSON.parse(sessionStorage.getItem("arrProds"));
            if (arrProds != null) {
                angular.forEach(arrProds, function (value) {
                    vm.arrProduits.push(JSON.parse(sessionStorage.getItem(value)));
                });
            }
            $("#modalPanier").modal();
        };

        vm.fnInfoAll = function () {
            var param = sessionStorage.getItem('LANG');
            if (param == "") {
                param = "FR";
            }
            $http({
                method: 'POST',
                data: $.param({mode: 16, param: param}),
                url: 'api/v1/metierCRUDPOST.php',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
            }, function errorCallback(error) {
                console.log(error);
            });
        }
        vm.fnAlertCommentaire = function (text) {
            if (text != "" && typeof text !== 'undefined') {
                bootbox.alert("<div style='text-align: center'>" + text + "</div>");
            }
        };

        vm.fnCheckout = function () {
            Data.get('session.php').then(function (results) {
                if (results.uid) {
                    $scope.isLogged = true;
                    $scope.utilisateur = results.name;
                    $location.path('/checkout');
                }
                else if (!results.uid) {
                    $scope.alertMsg = "Veuillez vous connecter ou vous enregistrer pour pouvoir continuer svp.";
                }
                $scope.sessionInfo = results;
                //$location();
            })
        }

        vm.fnShowButtonComm = function (text) {
            if (text != "" && typeof text !== 'undefined') {
                return true;
            }
            else {
                return false;
            }
        };

        $scope.$watch('isActualLang', function (ov, nv) {
            $scope.setLang(sessionStorage.getItem("LANG"));
        });

        $scope.fnValidLang = function () {
            if ($('#fr').prop('checked')) {
                sessionStorage.setItem('LANG', 'FR');
                $scope.isActualLang = "FRANCAIS";
            }
            if ($('#en').prop('checked')) {

                sessionStorage.setItem('LANG', 'EN');
                $scope.isActualLang = "ENGLISH";
            }
            if ($('#es').prop('checked')) {

                sessionStorage.setItem('LANG', 'ES');
                $scope.isActualLang = "ESPAÑOL";
            }
            if ($('#al').prop('checked')) {

                sessionStorage.setItem('LANG', 'AL');
                $scope.isActualLang = "DEUTSCH";
            }
            if ($('#it').prop('checked')) {

                sessionStorage.setItem('LANG', 'IT');
                $scope.isActualLang = "ITALIANO";
            }
            $translate.use(sessionStorage.getItem('LANG'));
            $('#modalLanguage').modal('hide');
            vm.fnInstructions();
            vm.fnSetBtnMetiers();
            vm.fnLoadPub();
        };

        vm.fnInstructions();
        /*vm.fnRecupMetier();
         vm.fnModelMetierAll();
         vm.fnLoadPub();*/
        //  vm.fnInfoAll();

    });
