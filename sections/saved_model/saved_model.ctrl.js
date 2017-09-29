angular
    .module('myApp')
    .controller('savedModelController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, $routeParams, $translate) {
        Data.get('session.php').then(function (results) {
            if (results.uid) {
                $scope.isCommercial = false;
                if (results.salesman == 1) {
                    $scope.isCommercial = true;
                }
            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        vm.id  = $routeParams.id;
        $scope.header = "Produit Client";
        vm.currentProd = $routeParams.idCommDetail;
        vm.infoProd = [];

        vm.produit = [{titre: "", commentaire: ''}];
        console.log(vm.currentProd, "current produit");


        vm.productsDesign = [];

        vm.fnInit = function (idprod) {
            console.log("**************************************");
            console.log(localStorage.idModelMetier);
            console.log(vm.currentProd);
            console.log(idprod);
            console.log("**************************************");
            var lang = sessionStorage.getItem("LANG");
            var urlLang = "";
            if (lang == 'FR') {
                urlLang = "lang/fr.json";
            }
            else if (lang == 'ES') {
                urlLang = "lang/es.json";
            }
            else if (lang == 'AL') {
                urlLang = "lang/al.json";
            }
            else if (lang == 'IT') {
                urlLang = "lang/it.json";
            }
            else if (lang == 'EN') {
                urlLang = "lang/en.json";
            }
            urlLang = "lang/fr.json";
            var lang = sessionStorage.getItem("LANG");
            /*
             set imgs Mon panier and ajouter au panier
             */
            vm.linkMonPanier = "../assets/carts/mon_panier.png";
            vm.linkAjoutPanier = "../assets/carts/ajouter_panier.png";
            vm.linkSaveProd = "../assets/carts/model_sauvegarde/francais.png";
            if (lang == "FR") {
                vm.linkMonPanier = "../assets/carts/mon_panier.png";
                vm.linkAjoutPanier = "../assets/carts/ajouter_panier.png";
                vm.linkSaveProd = "../assets/carts/model_sauvegarde/francais.png";
            }
            else if (lang == "ES") {
                vm.linkMonPanier = "../assets/carts/cesta_espagnol.png";
                vm.linkAjoutPanier = "../assets/carts/cart_espagnol.png";
                vm.linkSaveProd = "../assets/carts/model_sauvegarde/espagnol.png";
            }
            else if (lang == "EN") {
                vm.linkMonPanier = "../assets/carts/cart_english.png";
                vm.linkAjoutPanier = "../assets/carts/add_cart_english.png";
                vm.linkSaveProd = "../assets/carts/model_sauvegarde/eng.png";
            }
            else if (lang == "AL") {
                vm.linkMonPanier = "../assets/carts/warenkorb_deutch.png";
                vm.linkAjoutPanier = "../assets/carts/cart_deutch.png";
                vm.linkSaveProd = "../assets/carts/model_sauvegarde/allemand.png";
            }
            else if (lang == "IT") {
                vm.linkMonPanier = "../assets/carts/carrello_italiano.png";
                vm.linkAjoutPanier = "../assets/carts/cart_italien.png";
                vm.linkSaveProd = "../assets/carts/model_sauvegarde/italien.png";
            }
            if (lang == "" || lang == null) {
                lang = "FR";
            }
            $translate.use(sessionStorage.getItem('LANG'));
            $http({
                method: 'GET',
                params: {mode: 3, lang: lang},
                url: 'api/v1/langueCRUD.php'
            }).then(function successCallback(response) {
                $scope.langue = angular.copy(response.data);
            });
            vm.setLang = function (langKey) {
                // You can change the language during runtime
                $translate.use(langKey);
            };

            $scope.$watch('isActualLang', function (ov, nv) {
                vm.setLang(sessionStorage.getItem("LANG"));
                var lang = sessionStorage.getItem("LANG");

                vm.linkMonPanier = "../assets/carts/mon_panier.png";
                vm.linkAjoutPanier = "../assets/carts/ajouter_panier.png";
                vm.linkSaveProd = "../assets/carts/model_sauvegarde/francais.png";
                if (lang == "FR") {
                    vm.linkMonPanier = "../assets/carts/mon_panier.png";
                    vm.linkAjoutPanier = "../assets/carts/ajouter_panier.png";
                    vm.linkSaveProd = "../assets/carts/model_sauvegarde/francais.png";
                }
                else if (lang == "ES") {
                    vm.linkMonPanier = "../assets/carts/cesta_espagnol.png";
                    vm.linkAjoutPanier = "../assets/carts/cart_espagnol.png";
                    vm.linkSaveProd = "../assets/carts/model_sauvegarde/espagnol.png";
                }
                else if (lang == "EN") {
                    vm.linkMonPanier = "../assets/carts/cart_english.png";
                    vm.linkAjoutPanier = "../assets/carts/add_cart_english.png";
                    vm.linkSaveProd = "../assets/carts/model_sauvegarde/eng.png";
                }
                else if (lang == "AL") {
                    vm.linkMonPanier = "../assets/carts/warenkorb_deutch.png";
                    vm.linkAjoutPanier = "../assets/carts/cart_deutch.png";
                    vm.linkSaveProd = "../assets/carts/model_sauvegarde/allemand.png";
                }
                else if (lang == "IT") {
                    vm.linkMonPanier = "../assets/carts/carrello_italiano.png";
                    vm.linkAjoutPanier = "../assets/carts/cart_italien.png";
                    vm.linkSaveProd = "../assets/carts/model_sauvegarde/italien.png";
                }

            });

            $http({
                method: "POST",
                url: "/api/v1/metierCRUDPOST.php",
                data: $.param({mode:19, id:vm.id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    console.log(data, "++++++++");
                    vm.infoProd = data;
                    var result = JSON.parse(vm.infoProd.data);
                    console.log((result));
                    var arrDimensions = vm.infoProd.dimensions.split(',');
                    var arrQte = vm.infoProd.qte.split(',');
                    var arrDataDims = [];
                    var arrDataQte = [];
                    var arrPapier = [];
                    angular.forEach(vm.infoProd.type_support, function (value) {
                        arrPapier.push({id: value.id, text: value.description});
                    });
                    angular.forEach(arrDimensions, function (value, key) {
                        arrDataDims.push({id: key, text: value});
                    });
                    angular.forEach(arrQte, function (value, key) {
                        arrDataQte.push({id: key, text: value});
                    });

                    vm.arrCurrentDims = arrDataDims;
                    vm.arrCurrentQtes = arrDataQte;

                    // clear all option
                    $('.sel_papier').html('').select2({data: [{id: '', text: ''}]});

                    // clear and add new option
                    $(".sel_papier").html('').select2({data: arrPapier});

                    // clear all option
                    $('.sel_dimensions').html('').select2({data: [{id: '', text: ''}]});

                    // clear and add new option
                    $(".sel_dimensions").html('').select2({data: arrDataDims});

                    $('.sel_qte').html('').select2({data: [{id: '', text: ''}]});

                    // clear and add new option
                    $(".sel_qte").html('').select2({data: arrDataQte});

                    $(".sel_papier").on("select2:select", function (e) {
                        vm.fnCalcPrixVente();
                    });
                    $(".sel_dimensions").on("select2:select", function (e) {
                        vm.fnCalcPrixVente();
                    });

                    $(".sel_qte").on("select2:select", function (e) {
                        vm.fnCalcPrixVente();
                    });
                    //******************************************************
                    if (arrPapier.length > 0 && typeof $('.sel_papier').select2('data') != 'undefined') {
                        var idSupport = $('.sel_papier').select2('data')[0].id;
                    }
                    var qte_commander = Number($('.sel_qte').select2('data')[0].text);
                    var coeff_dimension = 0;
                    var coeff_support = 0;
                    var coeff_qte = 0;
                    angular.forEach(vm.infoProd.coeff_dims, function (value) {
                        if (value.dimension.trim() == $('.sel_dimensions').select2('data')[0].text.trim()) {
                            coeff_dimension = Number(value.coeff);
                        }
                    });
                    if (vm.infoProd.type_tarif > -1) {
                        angular.forEach(vm.infoProd.info_prix, function (value) {
                            if (value.id_support == idSupport && Number(value.qte) == qte_commander) {
                                coeff_support = Number(value.coeff_prix);
                                coeff_qte = Number(value.coeff_qte);
                            }
                        });
                        vm.unitprix = ((coeff_dimension * coeff_qte * coeff_support) / qte_commander).toFixed(3);
                        vm.prixvente = (coeff_dimension * coeff_qte * coeff_support).toFixed(2);

                    }
                    else {
                        angular.forEach(vm.infoProd.tarifManuel, function (value) {
                            if (value.lib_dim == $('.sel_dimensions').select2('data')[0].text.trim() && Number(value.qte) == qte_commander && value.id_support == idSupport) {
                                vm.unitprix = ((value.prix_vente) / Number(value.qte)).toFixed(3);
                                vm.prixvente = Number(value.prix_vente).toFixed(2);
                            }
                        })
                    }

                    $('#aucun').prop('checked', true);
                    $('#aucunEscargot').prop('checked', true);
                    $('#cmdBonTirer').prop('checked', true);

                    $timeout(function () {
                        $("#imgScroll").endlessScroll({
                            width: '100%',
                            height: '250px',
                            steps: -2,
                            speed: 40,
                            mousestop: true
                        });

                        var $yourDesigner = $('#model'),
                            pluginOpts = {
                                mainBarModules: ['images', 'text'],
                                stageWidth: 2000,
                                stageHeight: 1000,
                                editorMode: true,
                                langJSON: urlLang,
                                lazyLoad: true,
                                improvedResizeQuality: true,
                                loadFirstProductInStage: true,
                                fonts: vm.fonts,
                                customTextParameters: {
                                    colors: true,
                                    removable: true,
                                    resizable: true,
                                    draggable: true,
                                    rotatable: true,
                                    autoCenter: true,
                                    boundingBox: "Base",
                                    curvable: true,
                                    curveReverse: true
                                },
                                customImageParameters: {
                                    draggable: true,
                                    removable: true,
                                    resizable: true,
                                    rotatable: true,
                                    colors: '#000',
                                    autoCenter: true,
                                    boundingBox: "Base"
                                },
                                customAdds: {
                                    uploads: true
                                },
                                customImageAjaxSettings: {
                                    data: {
                                        saveOnServer: 1,
                                        uploadsDir: '../test',
                                        uploadsDirURL: "./test"
                                    },
                                    url: 'api/imageUpload.php'
                                },
                                imageParameters: {
                                    availableFilters: ['grayscale', 'sepia', 'sepia2'],
                                    filter: true
                                },
                                actions: {
                                    /*'top': ['download','print', 'snap', 'preview-lightbox'],
                                     'right': ['magnify-glass', 'zoom', 'reset-product', 'qr-code', 'ruler'],
                                     'bottom': ['undo','redo'],
                                     'left': ['manage-layers','info','save','load']*/
                                    'top': [],
                                    'right': ['zoom', 'reset-product', 'undo', 'redo']
                                }
                            },
                            yourDesigner = new FancyProductDesigner($yourDesigner, pluginOpts);

                        var data = (result);
                        var arrProducts = [];
                        var arrFront = [];
                        var arrBack = [];
                        console.log(data, " -----")
                        angular.forEach(data[0].elements, function (value1) {
                            console.log(value1, '====' );
                            var flag = false;

                            if (value1.parameters.fill != "false") {
                                flag = value1.parameters.fill;
                            }
                            if (value1.parameters.flipX == "false") {
                                value1.parameters.flipX = false;
                            }
                            else {
                                value1.parameters.flipX = true;
                            }

                            if (value1.parameters.flipY == "false") {
                                value1.parameters.flipY = false;
                            }
                            else {
                                value1.parameters.flipY = true;
                            }
                            if (value1.parameters.autoCenter == "false") {
                                value1.parameters.autoCenter = false;
                            }
                            else {
                                value1.parameters.autoCenter = true;
                            }

                            if (value1.parameters.autoSelect == "false") {
                                value1.parameters.autoSelect = false;
                            }
                            else {
                                value1.parameters.autoSelect = true;
                            }

                            if (value1.parameters.colorLinkGroup == "false") {
                                value1.parameters.colorLinkGroup = false;
                            }
                            else {
                                value1.parameters.colorLinkGroup = true;
                            }

                            if (value1.parameters.copyable == "false") {
                                value1.parameters.copyable = false;
                            }
                            else {
                                value1.parameters.copyable = true;
                            }

                            if (value1.parameters.cornerSize == "false") {
                                value1.parameters.cornerSize = false;
                            }
                            else if (value1.parameters.cornerSize == "true") {
                                value1.parameters.cornerSize = true;
                            }
                            else {
                                value1.parameters.cornerSize = parseInt(value1.parameters.cornerSize);
                            }


                            if (value1.parameters.draggable == "false") {
                                value1.parameters.draggable = false;
                            }
                            else {
                                value1.parameters.draggable = true;
                            }

                            if (value1.parameters.evented == "false") {
                                value1.parameters.evented = false;
                            }
                            else {
                                value1.parameters.evented = true;
                            }

                            if (value1.parameters.filter == "false") {
                                value1.parameters.filter = false;
                            }
                            else {
                                value1.parameters.filter = true;
                            }

                            if (value1.parameters.isCustom == "false") {
                                value1.parameters.isCustom = false;
                            }
                            else {
                                value1.parameters.isCustom = true;
                            }

                            if (value1.parameters.isEditable == "false") {
                                value1.parameters.isEditable = false;
                            }
                            else {
                                value1.parameters.isEditable = true;
                            }

                            if (value1.parameters.lockUniScaling == "false") {
                                value1.parameters.lockUniScaling = false;
                            }
                            else {
                                value1.parameters.lockUniScaling = true;
                            }

                            if (value1.parameters.removable == "false") {
                                value1.parameters.removable = false;
                            }
                            else {
                                value1.parameters.removable = true;
                            }

                            if (value1.parameters.replaceInAllViews == "false") {
                                value1.parameters.replaceInAllViews = false;
                            }
                            else {
                                value1.parameters.replaceInAllViews = true;
                            }

                            if (value1.parameters.resizable == "false") {
                                value1.parameters.resizable = false;
                            }
                            else {
                                value1.parameters.resizable = true;
                            }

                            if (value1.parameters.rotatable == "false") {
                                value1.parameters.rotatable = false;
                            }
                            else {
                                value1.parameters.rotatable = true;
                            }

                            if (value1.parameters.topped == "false") {
                                value1.parameters.topped = false;
                            }
                            else {
                                value1.parameters.topped = true;
                            }

                            if (value1.parameters.uniScalingUnlockable == "false") {
                                value1.parameters.uniScalingUnlockable = false;
                            }
                            else {
                                value1.parameters.uniScalingUnlockable = true;
                            }

                            if (value1.parameters.uploadZone == "false") {
                                value1.parameters.uploadZone = false;
                            }
                            else {
                                value1.parameters.uploadZone = true;
                            }

                            if (value1.parameters.zChangeable == "false") {
                                value1.parameters.zChangeable = false;
                            }

                            else {
                                value1.parameters.zChangeable = true;
                            }

                            if (value1.parameters.curvable == "false") {
                                value1.parameters.curvable = false;
                            }
                            else {
                                value1.parameters.curvable = true;
                            }

                            if (value1.parameters.curved == "false") {
                                value1.parameters.curved = false;
                            }
                            else {
                                value1.parameters.curved = true;
                            }
                            if (value1.parameters.curveReverse == "false") {
                                value1.parameters.curveReverse = false;
                            }
                            else if (value1.parameters.curveReverse == "true") {
                                value1.parameters.curveReverse = true;
                            }

                            if (value1.parameters.curveRadius == "false") {
                                value1.parameters.curveRadius = false;
                            }
                            else if (value1.parameters.curveRadius == "true") {
                                value1.parameters.curveRadius = true;
                            }

                            if (value1.parameters.editable == "false") {
                                value1.parameters.editable = false;
                            }
                            else {
                                value1.parameters.editable = true;
                            }

                            if (value1.parameters.colors == "false") {
                                value1.parameters.colors = false;
                            }
                            else if (value1.parameters.colors == "true") {
                                value1.parameters.colors = true;
                            }

                            if (value1.parameters.numberPlaceholder == "false") {
                                value1.parameters.numberPlaceholder = false;
                            }
                            else if (value1.parameters.numberPlaceholder == "true") {
                                value1.parameters.numberPlaceholder = true;
                            }

                            if (value1.parameters.textBox == "false") {
                                value1.parameters.textBox = false;
                            }
                            else if (value1.parameters.textBox == "true") {
                                value1.parameters.textBox = true;
                            }

                            if (value1.type == 'image') {
                                arrFront.push({
                                    source: value1.source, title: value1.title, type: value1.type, parameters: {
                                        "left": parseFloat(value1.parameters.left),
                                        "top": parseFloat(value1.parameters.top),
                                        "fill": flag,
                                        "angle": parseInt(value1.parameters.angle),
                                        "autoCenter": value1.parameters.autoCenter,
                                        "autoSelect": value1.parameters.autoSelect,
                                        "boundingBox": value1.parameters.boundingBox,
                                        "boundingBoxMode": value1.parameters.boundingBoxMode,
                                        "colorLinkGroup": value1.parameters.colorLinkGroup,
                                        "cornerSize": value1.parameters.cornerSize,
                                        "copyable": value1.parameters.copyable,
                                        "curvable": value1.parameters.curvable,
                                        "curveRadius": value1.parameters.curveRadius,
                                        "curveReverse": value1.parameters.curveReverse,
                                        "curved": value1.parameters.curved,
                                        "colors": value1.parameters.colors,
                                        "availableFilters": new Array("grayscale", "sepia", "sepia2"),
                                        "draggable": value1.parameters.draggable,
                                        "editable": value1.parameters.editable,
                                        "evented": value1.parameters.evented,
                                        "filter": value1.parameters.filter,
                                        "flipX": value1.parameters.flipX,
                                        "flipY": value1.parameters.flipY,
                                        "height": parseInt(value1.parameters.height),
                                        "isCustom": value1.parameters.isCustom,
                                        "isEditable": value1.parameters.isEditable,
                                        "lockUniScaling": value1.parameters.lockUniScaling,
                                        "opacity": parseInt(value1.parameters.opacity),
                                        "originX": value1.parameters.originX,
                                        "originY": value1.parameters.originY,
                                        "padding": parseInt(value1.parameters.padding),
                                        "removable": value1.parameters.removable,
                                        "replace": value1.parameters.replace,
                                        "replaceInAllViews": value1.parameters.replaceInAllViews,
                                        "resizable": value1.parameters.resizable,
                                        "rotatable": value1.parameters.rotatable,
                                        "scaleX": parseFloat(value1.parameters.scaleX),
                                        "scaleY": parseFloat(value1.parameters.scaleY),
                                        "toppped": value1.parameters.topped,
                                        "uniScalingUnlockable": value1.parameters.uniScalingUnlockable,
                                        "uploadZone": value1.parameters.uploadZone,
                                        "width": parseFloat(value1.parameters.width),
                                        "uploadZoneScaleMode": value1.parameters.uploadZoneScaleMode,
                                        "z": value1.parameters.z,
                                        "zChangeable": value1.parameters.zChangeable
                                    }
                                })
                            }
                            else if (value1.type == 'text') {
                                arrFront.push({
                                    source: value1.source, title: value1.title, type: value1.type, parameters: {
                                        "left": parseInt(value1.parameters.left),
                                        "top": parseInt(value1.parameters.top),
                                        "fill": flag,
                                        "angle": parseInt(value1.parameters.angle),
                                        "autoCenter": value1.parameters.autoCenter,
                                        "autoSelect": value1.parameters.autoSelect,
                                        "boundingBox": value1.parameters.boundingBox,
                                        "boundingBoxMode": value1.parameters.boundingBoxMode,
                                        "colorLinkGroup": value1.parameters.colorLinkGroup,
                                        "cornerSize": value1.parameters.cornerSize,
                                        "curvable": value1.parameters.curvable,
                                        "colors": value1.parameters.colors,
                                        "curveRadius": value1.parameters.curveRadius,
                                        "curveReverse": value1.parameters.curveReverse,
                                        "curveSpacing": parseInt(value1.parameters.curveSpacing),
                                        "curved": value1.parameters.curved,
                                        "copyable": value1.parameters.copyable,
                                        "draggable": value1.parameters.draggable,
                                        "editable": value1.parameters.editable,
                                        "evented": value1.parameters.evented,
                                        "flipX": value1.parameters.flipX,
                                        "flipY": value1.parameters.flipY,
                                        "fontFamily": value1.parameters.fontFamily,
                                        "fontSize": parseInt(value1.parameters.fontSize),
                                        "fontStyle": value1.parameters.fontStyle,
                                        "fontWeight": value1.parameters.fontWeight,
                                        "height": parseFloat(value1.parameters.height),
                                        "isCustom": value1.parameters.isCustom,
                                        "isEditable": value1.parameters.isEditable,
                                        "lineHeight": parseInt(value1.parameters.lineHeight),
                                        "lockUniScaling": value1.parameters.lockUniScaling,
                                        "maxLength": parseInt(value1.parameters.maxLength),
                                        "maxLines": parseInt(value1.parameters.maxLines),
                                        "numberPlaceholder": value1.parameters.numberPlaceholder,
                                        "opacity": parseInt(value1.parameters.opacity),
                                        "originX": value1.parameters.originX,
                                        "originY": value1.parameters.originY,
                                        "padding": parseInt(value1.parameters.padding),
                                        "removable": value1.parameters.removable,
                                        "replace": value1.parameters.replace,
                                        "replaceInAllViews": value1.parameters.replaceInAllViews,
                                        "resizable": value1.parameters.resizable,
                                        "rotatable": value1.parameters.rotatable,
                                        "scaleX": parseFloat(value1.parameters.scaleX),
                                        "scaleY": parseFloat(value1.parameters.scaleY),
                                        "stroke": value1.parameters.stroke,
                                        "strokeWidth": parseInt(value1.parameters.strokeWidth),
                                        "text": value1.parameters.text,
                                        "textAlign": value1.parameters.textAlign,
                                        "textBox": (value1.parameters.textBox),
                                        "textDecoration": value1.parameters.textDecoration,
                                        "toppped": value1.parameters.topped,
                                        "uniScalingUnlockable": value1.parameters.uniScalingUnlockable,
                                        "uploadZone": value1.parameters.uploadZone,
                                        "width": parseFloat(value1.parameters.width),
                                        "z": parseInt(value1.parameters.z),
                                        "zChangeable": value1.parameters.zChangeable
                                    }
                                })
                            }
                        });

                        angular.forEach(data[1].elements, function (value1) {
                            var flag = false;
                            if (value1.parameters.fill != "false") {
                                flag = value1.parameters.fill;
                            }
                            if (value1.parameters.flipX == "false") {
                                value1.parameters.flipX = false;
                            }
                            else {
                                value1.parameters.flipX = true;
                            }

                            if (value1.parameters.flipY == "false") {
                                value1.parameters.flipY = false;
                            }
                            else {
                                value1.parameters.flipY = true;
                            }
                            if (value1.parameters.autoCenter == "false") {
                                value1.parameters.autoCenter = false;
                            }
                            else {
                                value1.parameters.autoCenter = true;
                            }

                            if (value1.parameters.autoSelect == "false") {
                                value1.parameters.autoSelect = false;
                            }
                            else {
                                value1.parameters.autoSelect = true;
                            }

                            if (value1.parameters.colorLinkGroup == "false") {
                                value1.parameters.colorLinkGroup = false;
                            }
                            else {
                                value1.parameters.colorLinkGroup = true;
                            }

                            if (value1.parameters.copyable == "false") {
                                value1.parameters.copyable = false;
                            }
                            else {
                                value1.parameters.copyable = true;
                            }

                            if (value1.parameters.cornerSize == "false") {
                                value1.parameters.cornerSize = false;
                            }
                            else if (value1.parameters.cornerSize == "true") {
                                value1.parameters.cornerSize = true;
                            }

                            else {
                                value1.parameters.cornerSize = parseInt(value1.parameters.cornerSize);
                            }


                            if (value1.parameters.draggable == "false") {
                                value1.parameters.draggable = false;
                            }
                            else {
                                value1.parameters.draggable = true;
                            }

                            if (value1.parameters.evented == "false") {
                                value1.parameters.evented = false;
                            }
                            else {
                                value1.parameters.evented = true;
                            }

                            if (value1.parameters.filter == "false") {
                                value1.parameters.filter = false;
                            }
                            else {
                                value1.parameters.filter = true;
                            }

                            if (value1.parameters.isCustom == "false") {
                                value1.parameters.isCustom = false;
                            }
                            else {
                                value1.parameters.isCustom = true;
                            }

                            if (value1.parameters.isEditable == "false") {
                                value1.parameters.isEditable = false;
                            }
                            else {
                                value1.parameters.isEditable = true;
                            }

                            if (value1.parameters.lockUniScaling == "false") {
                                value1.parameters.lockUniScaling = false;
                            }
                            else {
                                value1.parameters.lockUniScaling = true;
                            }

                            if (value1.parameters.removable == "false") {
                                value1.parameters.removable = false;
                            }
                            else {
                                value1.parameters.removable = true;
                            }

                            if (value1.parameters.replaceInAllViews == "false") {
                                value1.parameters.replaceInAllViews = false;
                            }
                            else {
                                value1.parameters.replaceInAllViews = true;
                            }

                            if (value1.parameters.resizable == "false") {
                                value1.parameters.resizable = false;
                            }
                            else {
                                value1.parameters.resizable = true;
                            }

                            if (value1.parameters.rotatable == "false") {
                                value1.parameters.rotatable = false;
                            }
                            else {
                                value1.parameters.rotatable = true;
                            }

                            if (value1.parameters.topped == "false") {
                                value1.parameters.topped = false;
                            }
                            else {
                                value1.parameters.topped = true;
                            }

                            if (value1.parameters.uniScalingUnlockable == "false") {
                                value1.parameters.uniScalingUnlockable = false;
                            }
                            else {
                                value1.parameters.uniScalingUnlockable = true;
                            }

                            if (value1.parameters.uploadZone == "false") {
                                value1.parameters.uploadZone = false;
                            }
                            else {
                                value1.parameters.uploadZone = true;
                            }

                            if (value1.parameters.zChangeable == "false") {
                                value1.parameters.zChangeable = false;
                            }

                            else {
                                value1.parameters.zChangeable = true;
                            }

                            if (value1.parameters.curvable == "false") {
                                value1.parameters.curvable = false;
                            }
                            else {
                                value1.parameters.curvable = true;
                            }

                            if (value1.parameters.curved == "false") {
                                value1.parameters.curved = false;
                            }
                            else {
                                value1.parameters.curved = true;
                            }

                            if (value1.parameters.curveRadius == "false") {
                                value1.parameters.curveRadius = false;
                            }
                            else if (value1.parameters.curveRadius == "true") {
                                value1.parameters.curveRadius = true;
                            }
                            if (value1.parameters.curveReverse == "false") {
                                value1.parameters.curveReverse = false;
                            }
                            else {
                                value1.parameters.curveReverse = true;
                            }
                            if (value1.parameters.editable == "false") {
                                value1.parameters.editable = false;
                            }
                            else {
                                value1.parameters.editable = true;
                            }
                            if (value1.parameters.colors == "false") {
                                value1.parameters.colors = false;
                            }
                            else if (value1.parameters.colors == "true") {
                                value1.parameters.colors = true;
                            }

                            if (value1.type == 'image') {
                                arrBack.push({
                                    source: value1.source, title: value1.title, type: value1.type, parameters: {
                                        "left": parseFloat(value1.parameters.left),
                                        "top": parseFloat(value1.parameters.top),
                                        "fill": flag,
                                        "angle": parseInt(value1.parameters.angle),
                                        "autoCenter": value1.parameters.autoCenter,
                                        "autoSelect": value1.parameters.autoSelect,
                                        "boundingBox": value1.parameters.boundingBox,
                                        "boundingBoxMode": value1.parameters.boundingBoxMode,
                                        "colorLinkGroup": value1.parameters.colorLinkGroup,
                                        "cornerSize": value1.parameters.cornerSize,
                                        "copyable": value1.parameters.copyable,
                                        "colors": value1.parameters.colors,
                                        "availableFilters": new Array("grayscale", "sepia", "sepia2"),
                                        "draggable": value1.parameters.draggable,
                                        "evented": value1.parameters.evented,
                                        "filter": value1.parameters.filter,
                                        "flipX": value1.parameters.flipX,
                                        "flipY": value1.parameters.flipY,
                                        "height": parseInt(value1.parameters.height),
                                        "isCustom": value1.parameters.isCustom,
                                        "isEditable": value1.parameters.isEditable,
                                        "lockUniScaling": value1.parameters.lockUniScaling,
                                        "opacity": parseInt(value1.parameters.opacity),
                                        "originX": value1.parameters.originX,
                                        "originY": value1.parameters.originY,
                                        "padding": parseInt(value1.parameters.padding),
                                        "removable": value1.parameters.removable,
                                        "replace": value1.parameters.replace,
                                        "replaceInAllViews": value1.parameters.replaceInAllViews,
                                        "resizable": value1.parameters.resizable,
                                        "rotatable": value1.parameters.rotatable,
                                        "scaleX": parseFloat(value1.parameters.scaleX),
                                        "scaleY": parseFloat(value1.parameters.scaleY),
                                        "toppped": value1.parameters.topped,
                                        "uniScalingUnlockable": value1.parameters.uniScalingUnlockable,
                                        "uploadZone": value1.parameters.uploadZone,
                                        "width": parseFloat(value1.parameters.width),
                                        "uploadZoneScaleMode": value1.parameters.uploadZoneScaleMode,
                                        "z": value1.parameters.z,
                                        "zChangeable": value1.parameters.zChangeable
                                    }
                                })
                            }
                            else if (value1.type == 'text') {
                                arrBack.push({
                                    source: value1.source, title: value1.title, type: value1.type, parameters: {
                                        "left": parseInt(value1.parameters.left),
                                        "top": parseInt(value1.parameters.top),
                                        "fill": flag,
                                        "angle": parseInt(value1.parameters.angle),
                                        "autoCenter": value1.parameters.autoCenter,
                                        "autoSelect": value1.parameters.autoSelect,
                                        "boundingBox": value1.parameters.boundingBox,
                                        "boundingBoxMode": value1.parameters.boundingBoxMode,
                                        "colorLinkGroup": value1.parameters.colorLinkGroup,
                                        "cornerSize": value1.parameters.cornerSize,
                                        "curvable": value1.parameters.curvable,
                                        "colors": value1.parameters.colors,
                                        "curveRadius": value1.parameters.curveRadius,
                                        "curveReverse": value1.parameters.curveReverse,
                                        "curveSpacing": parseInt(value1.parameters.curveSpacing),
                                        "curved": value1.parameters.curved,
                                        "copyable": value1.parameters.copyable,
                                        "draggable": value1.parameters.draggable,
                                        "editable": value1.parameters.editable,
                                        "evented": value1.parameters.evented,
                                        "flipX": value1.parameters.flipX,
                                        "flipY": value1.parameters.flipY,
                                        "fontFamily": value1.parameters.fontFamily,
                                        "fontSize": parseInt(value1.parameters.fontSize),
                                        "fontStyle": value1.parameters.fontStyle,
                                        "fontWeight": value1.parameters.fontWeight,
                                        "height": parseFloat(value1.parameters.height),
                                        "isCustom": value1.parameters.isCustom,
                                        "isEditable": value1.parameters.isEditable,
                                        "lineHeight": parseInt(value1.parameters.lineHeight),
                                        "lockUniScaling": value1.parameters.lockUniScaling,
                                        "maxLength": parseInt(value1.parameters.maxLength),
                                        "maxLines": parseInt(value1.parameters.maxLines),
                                        "opacity": parseInt(value1.parameters.opacity),
                                        "originX": value1.parameters.originX,
                                        "originY": value1.parameters.originY,
                                        "padding": parseInt(value1.parameters.padding),
                                        "removable": value1.parameters.removable,
                                        "replace": value1.parameters.replace,
                                        "replaceInAllViews": value1.parameters.replaceInAllViews,
                                        "resizable": value1.parameters.resizable,
                                        "rotatable": value1.parameters.rotatable,
                                        "scaleX": parseFloat(value1.parameters.scaleX),
                                        "scaleY": parseFloat(value1.parameters.scaleY),
                                        "stroke": value1.parameters.stroke,
                                        "strokeWidth": parseInt(value1.parameters.strokeWidth),
                                        "text": value1.parameters.text,
                                        "textAlign": value1.parameters.textAlign,
                                        "textBox": parseInt(value1.parameters.textBox),
                                        "textDecoration": value1.parameters.textDecoration,
                                        "toppped": value1.parameters.topped,
                                        "width": parseFloat(value1.parameters.width),
                                        "z": parseInt(value1.parameters.z),
                                        "zChangeable": value1.parameters.zChangeable
                                    }
                                })
                            }
                        })

                        arrProducts.push({title: 'Recto', thumbnail: 'images/gallery/simple1.jpg', elements: arrFront});
                        arrProducts.push({
                            title: 'Recto Verso',
                            thumbnail: 'images/gallery/simple2.jpg',
                            elements: arrBack
                        });
                        console.log(arrProducts)
                        yourDesigner.addProduct(arrProducts);

                        // yourDesigner.loadProduct((data));
                        vm.fnAddBasket = function () {
                            if (typeof vm.produit.titre == 'undefined' || (vm.produit.titre).trim() == "") {
                                bootbox.alert("<div style='text-align: center'><b>Veuillez renseigner le titre s'il-vous-plait.</b></div>");
                                return;
                            }
                            /*if (vm.prodEnCours.length != 0) {
                                bootbox.dialog({
                                    message: $scope.langue["message_modifprod"],
                                    title: $scope.langue["entete_modifprod"],
                                    buttons: {
                                        annuler: {
                                            label: $scope.langue["label_modifprod_new"],
                                            className: "btn-secondary",
                                            callback: function () {
                                                var countProduit = 0;
                                                var arrProds = [];
                                                if (sessionStorage.produitCount) {
                                                    countProduit = Number(sessionStorage.produitCount) + 1;
                                                }
                                                var obj = {};
                                                yourDesigner.getProductDataURL(function (dataURL) {

                                                    //obj.base64_image    = dataURL;
                                                    obj.title = vm.produit.titre;
                                                    obj.commentaire = vm.produit.commentaire;
                                                    obj.opt = $('input[name="optradio"]:checked').val();
                                                    obj.contours = vm.infoProd.contours;
                                                    obj.liserai = vm.infoProd.liserai;
                                                    obj.escargot = vm.infoProd.escargot;
                                                    obj.escargot_val = $('input[name="optescargot"]:checked').val();
                                                    obj.id_dimension = $('.sel_dimensions').select2('data')[0].id;
                                                    obj.dimension = $('.sel_dimensions').select2('data')[0].text;
                                                    obj.id_qte = $('.sel_qte').select2('data')[0].id;
                                                    obj.qte = $('.sel_qte').select2('data')[0].text;
                                                    obj.bonrepli = $('input[name="optcommande"]:checked').val();
                                                    obj.prix = vm.prixvente;
                                                    obj.idsupport = $('.sel_papier').select2('data')[0].id;
                                                    obj.support = $('.sel_papier').select2('data')[0].text;
                                                    obj.unitprix = vm.unitprix;
                                                    obj.idn_key = "produit" + countProduit;
                                                    obj.random_str = Math.random().toString(36).substring(7);
                                                    obj.arrDims = vm.arrCurrentDims;
                                                    obj.arrQtes = vm.arrCurrentQtes;
                                                    obj.idProduit = vm.infoProd.idCata;

                                                    if (typeof vm.produit.commentaire == 'undefined') {
                                                        vm.produit.commentaire = " ";
                                                    }
                                                    $.ajax({
                                                        url: 'api/v1/temp_produit.php',
                                                        type: 'post',
                                                        dataType: 'json',
                                                        success: function (data) {
                                                        },
                                                        data: {
                                                            modified: false,
                                                            base64_image: dataURL,
                                                            title: vm.produit.titre,
                                                            comm: vm.produit.commentaire,
                                                            opt: $('input[name="optradio"]:checked').val(),
                                                            contours: vm.infoProd.contours,
                                                            liserai: vm.infoProd.liserai,
                                                            escargot: vm.infoProd.escargot,
                                                            idmodelmetier: vm.infoProd.idmodelmetier,
                                                            idproduit: vm.infoProd.idCata,
                                                            escargot_val: $('input[name="optescargot"]:checked').val(),
                                                            dimension: $('.sel_dimensions').select2('data')[0].text,
                                                            id_dimension: $('.sel_dimensions').select2('data')[0].id,
                                                            qte: $('.sel_qte').select2('data')[0].text,
                                                            id_qte: $('.sel_qte').select2('data')[0].id,
                                                            bonrepli: $('input[name="optcommande"]:checked').val(),
                                                            data: yourDesigner.getProduct(),
                                                            prix: vm.prixvente,
                                                            idsupport: $('.sel_papier').select2('data')[0].id,
                                                            support: $('.sel_papier').select2('data')[0].text,
                                                            unitprix: vm.unitprix,
                                                            random_str: obj.random_str,
                                                            idn_key: "produit" + countProduit
                                                        }
                                                    }).done(function (data) {
                                                    });

                                                    sessionStorage.setItem("produitCount", countProduit);

                                                    arrProds = JSON.parse(sessionStorage.getItem("arrProds"));
                                                    if (arrProds == null) {
                                                        arrProds = [];
                                                    }
                                                    arrProds.push("produit" + countProduit);
                                                    sessionStorage.setItem("arrProds", JSON.stringify(arrProds));
                                                    vm.prodEnCours = obj;
                                                    sessionStorage.setItem("produit" + countProduit, JSON.stringify(obj));
                                                    vm.arrProduits = [];
                                                });
                                                toastr.options.positionClass = 'toast-top-right';
                                                toastr.success($scope.langue["produit_rajoute"]);
                                            }
                                        },
                                        valider: {
                                            label: $scope.langue["label_modifprod_valider"],
                                            className: "btn-success",
                                            callback: function () {
                                                var countProduit = 0;
                                                var arrProds = [];

                                                if (sessionStorage.produitCount) {
                                                    countProduit = Number(sessionStorage.produitCount) + 1;
                                                }
                                                var obj = {};
                                                yourDesigner.getProductDataURL(function (dataURL) {

                                                    //obj.base64_image    = dataURL;
                                                    obj.title = vm.produit.titre;
                                                    obj.commentaire = vm.produit.commentaire;
                                                    obj.opt = $('input[name="optradio"]:checked').val();
                                                    obj.contours = vm.infoProd.contours;
                                                    obj.liserai = vm.infoProd.liserai;
                                                    obj.escargot = vm.infoProd.escargot;
                                                    obj.escargot_val = $('input[name="optescargot"]:checked').val();

                                                    obj.id_dimension = $('.sel_dimensions').select2('data')[0].id;
                                                    obj.dimension = $('.sel_dimensions').select2('data')[0].text;
                                                    obj.id_qte = $('.sel_qte').select2('data')[0].id;
                                                    obj.qte = $('.sel_qte').select2('data')[0].text;
                                                    obj.bonrepli = $('input[name="optcommande"]:checked').val();
                                                    obj.prix = vm.prixvente;
                                                    obj.idsupport = $('.sel_papier').select2('data')[0].id;
                                                    obj.support = $('.sel_papier').select2('data')[0].text;
                                                    obj.unitprix = vm.unitprix;
                                                    obj.idn_key = vm.prodEnCours.idn_key;
                                                    obj.random_str = vm.prodEnCours.random_str;
                                                    obj.arrDims = vm.arrCurrentDims;
                                                    obj.arrQtes = vm.arrCurrentQtes;
                                                    obj.idProduit = vm.infoProd.idCata;

                                                    if (typeof vm.produit.commentaire == 'undefined') {
                                                        vm.produit.commentaire = " ";
                                                    }
                                                    $.ajax({
                                                        url: 'api/v1/temp_produit.php',
                                                        type: 'post',
                                                        dataType: 'json',
                                                        success: function (data) {

                                                        },
                                                        data: {
                                                            modified: true,
                                                            base64_image: dataURL,
                                                            title: vm.produit.titre,
                                                            comm: vm.produit.commentaire,
                                                            opt: $('input[name="optradio"]:checked').val(),
                                                            contours: vm.infoProd.contours,
                                                            liserai: vm.infoProd.liserai,
                                                            escargot: vm.infoProd.escargot,
                                                            escargot_val: $('input[name="optescargot"]:checked').val(),
                                                            idmodelmetier: vm.infoProd.idmodelmetier,
                                                            idproduit: vm.infoProd.idCata,
                                                            dimension: $('.sel_dimensions').select2('data')[0].text,
                                                            id_dimension: $('.sel_dimensions').select2('data')[0].id,
                                                            qte: $('.sel_qte').select2('data')[0].text,
                                                            id_qte: $('.sel_qte').select2('data')[0].id,
                                                            bonrepli: $('input[name="optcommande"]:checked').val(),
                                                            data: yourDesigner.getProduct(),
                                                            prix: vm.prixvente,
                                                            idsupport: $('.sel_papier').select2('data')[0].id,
                                                            support: $('.sel_papier').select2('data')[0].text,
                                                            unitprix: vm.unitprix,
                                                            random_str: obj.random_str,
                                                            idn_key: vm.prodEnCours.idn_key
                                                        }
                                                    }).done(function (data) {
                                                    });

                                                    sessionStorage.setItem("produitCount", countProduit);

                                                    if (arrProds == null) {
                                                        arrProds = [];
                                                    }
                                                    vm.prodEnCours = obj;
                                                    sessionStorage.setItem(vm.prodEnCours.idn_key, JSON.stringify(obj));
                                                    vm.arrProduits = [];
                                                });
                                                toastr.options.positionClass = 'toast-top-right';
                                                toastr.success($scope.langue["produit_rajoute"]);
                                            }
                                        }
                                    }
                                });
                            }*/
                           // else {
                                yourDesigner.getProductDataURL(function (dataURL) {
                                    var randomStr = Math.random().toString(36);

                                    $http({
                                        method: 'POST',
                                        data: $.param({base64_image: dataURL, randomStr: randomStr}),
                                        url: 'api/v1/save_img.php',
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                    }).then(function successCallback(response) {

                                    }, function errorCallback(error) {
                                        console.log(error);
                                    });

                                    var countProduit = 0;
                                    var arrProds = [];
                                    if (sessionStorage.produitCount) {
                                        countProduit = Number(sessionStorage.produitCount) + 1;
                                    }
                                    var obj = {};
                                    obj.title = vm.produit.titre;
                                    obj.commentaire = vm.produit.commentaire;
                                    obj.opt = $('input[name="optradio"]:checked').val();
                                    obj.contours = vm.infoProd.contours;
                                    obj.liserai = vm.infoProd.liserai;
                                    obj.escargot = vm.infoProd.escargot;
                                    obj.escargot_val = $('input[name="optescargot"]:checked').val();
                                    obj.id_dimension = $('.sel_dimensions').select2('data')[0].id;
                                    obj.dimension = $('.sel_dimensions').select2('data')[0].text;
                                    obj.id_qte = $('.sel_qte').select2('data')[0].id;
                                    obj.qte = $('.sel_qte').select2('data')[0].text;
                                    obj.bonrepli = $('input[name="optcommande"]:checked').val();
                                    obj.prix = vm.prixvente;
                                    obj.idsupport = $('.sel_papier').select2('data')[0].id;
                                    obj.support = $('.sel_papier').select2('data')[0].text;
                                    obj.unitprix = vm.unitprix;
                                    obj.idn_key = "produit" + countProduit;
                                    obj.random_str = Math.random().toString(36).substring(7);
                                    obj.arrDims = vm.arrCurrentDims;
                                    obj.arrQtes = vm.arrCurrentQtes;
                                    obj.idProduit = vm.infoProd.idCata;


                                    if (typeof vm.produit.commentaire == 'undefined') {
                                        vm.produit.commentaire = " ";
                                    }

                                    $http({
                                        method: 'POST',
                                        data: $.param({
                                            modified: false,
                                            base64_image: randomStr,
                                            title: vm.produit.titre,
                                            comm: vm.produit.commentaire,
                                            opt: $('input[name="optradio"]:checked').val(),
                                            contours: vm.infoProd.contours,
                                            liserai: vm.infoProd.liserai,
                                            escargot: vm.infoProd.escargot,
                                            escargot_val: $('input[name="optescargot"]:checked').val(),
                                            dimension: $('.sel_dimensions').select2('data')[0].text,
                                            id_dimension: $('.sel_dimensions').select2('data')[0].id,
                                            idmodelmetier: vm.infoProd.idmodelmetier,
                                            idproduit: vm.infoProd.idCata,
                                            qte: $('.sel_qte').select2('data')[0].text,
                                            id_qte: $('.sel_qte').select2('data')[0].id,
                                            bonrepli: $('input[name="optcommande"]:checked').val(),
                                            prix: vm.prixvente,
                                            idsupport: $('.sel_papier').select2('data')[0].id,
                                            support: $('.sel_papier').select2('data')[0].text,
                                            unitprix: vm.unitprix,
                                            random_str: obj.random_str,
                                            idn_key: "produit" + countProduit,
                                            data: yourDesigner.getProduct()
                                        }),
                                        url: 'api/v1/temp_produit.php',
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                    }).then(function successCallback(response) {
                                        sessionStorage.setItem("produitCount", countProduit);
                                        arrProds = JSON.parse(sessionStorage.getItem("arrProds"));
                                        if (arrProds == null) {
                                            arrProds = [];
                                        }
                                        arrProds.push("produit" + countProduit);
                                        vm.prodEnCours = obj;
                                        sessionStorage.setItem("arrProds", JSON.stringify(arrProds));
                                        sessionStorage.setItem("produit" + countProduit, JSON.stringify(obj));
                                        vm.arrProduits = [];
                                        toastr.options.positionClass = 'toast-top-right';
                                        toastr.success($scope.langue["produit_rajoute"]);
                                    }, function errorCallback(error) {
                                        sessionStorage.setItem("produitCount", countProduit);
                                        arrProds = JSON.parse(sessionStorage.getItem("arrProds"));
                                        if (arrProds == null) {
                                            arrProds = [];
                                        }
                                        arrProds.push("produit" + countProduit);
                                        vm.prodEnCours = obj;
                                        sessionStorage.setItem("arrProds", JSON.stringify(arrProds));
                                        sessionStorage.setItem("produit" + countProduit, JSON.stringify(obj));
                                        vm.arrProduits = [];
                                        toastr.options.positionClass = 'toast-top-right';
                                        toastr.success($scope.langue["produit_rajoute"]);
                                    });

                                });
                           // }
                            return;

                        };

                        vm.saveProdCommercial = function () {
                            if (typeof vm.produit.titre == 'undefined' || (vm.produit.titre).trim() == "") {
                                bootbox.alert("<div style='text-align: center'><b>Veuillez renseigner le titre s'il-vous-plait.</b></div>");
                                return;
                            }

                            yourDesigner.getProductDataURL(function (dataURL) {
                                // var randomStr = Math.random().toString(36);
                                var d = new Date();
                                var randomStr = d.getTime();

                                $http({
                                    method: 'POST',
                                    data: $.param({base64_image: dataURL, randomStr: randomStr}),
                                    url: 'api/v1/save_img.php',
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                }).then(function successCallback(response) {

                                }, function errorCallback(error) {
                                    console.log(error);
                                });

                                $http({
                                    method: 'POST',
                                    data: $.param({
                                        mode: 17,
                                        title: vm.produit.titre,
                                        id_cata: vm.infoProd.idCata,
                                        image_url:randomStr,
                                        data: yourDesigner.getProduct()
                                    }),
                                    url: 'api/v1/metierCRUDPOST.php',
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                }).then(function successCallback(response) {
                                    toastr.options.positionClass = 'toast-top-right';
                                    toastr.success($scope.langue["produit_save"]);
                                }, function errorCallback(error) {
                                });
                            });



                        };
                    }, 0);




                })
                .error(function (data, status, headers, config) {
                });

            vm.fnClickPanier = function () {
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
            vm.fnShowButtonComm = function (text) {
                if (text != "" && typeof text !== 'undefined') {
                    return true;
                }
                else {
                    return false;
                }
            };

            vm.fnAlertCommentaire = function (text) {
                if (text != "" && typeof text !== 'undefined') {
                    bootbox.alert("<div style='text-align: center'>" + text + "</div>");
                }
            };

            vm.fnImgClient = function (produit) {
                $('body').addClass("spinner");
                $http({
                    method: 'POST',
                    data: $.param({mode: 2, key_prod: produit.idn_key}),
                    url: 'api/v1/recupTempProd.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                        bootbox.alert("<img style='width: 400px;height: 400px' src='../../api/imgs_temp/" + response.data + "'>");

                        $('body').removeClass("spinner");
                        vm.arrProduits = response.data;
                    },
                    function errorCallback(error) {
                        console.log(error);
                    });

                //bootbox.alert("<img style='width: 100%;height: 100%' src='"+produit.base64_image+"'>");
            };

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
            };

            vm.fnCheckOut = function () {
                vm.fnValidMaquette();
            }

            vm.fnValidMaquette = function () {
                Data.get('session.php').then(function (results) {
                    if (results.uid) {
                        $scope.isLogged = true;
                        $scope.isCommercial = false;
                        if (results.salesman == 1) {
                            $scope.isCommercial = true;
                        }
                        $scope.utilisateur = results.name;
                        vm.fnGetFraisLivr();
                    }
                    else if (!results.uid) {
                        $scope.alertMsg = "Veuillez vous connecter ou vous enregistrer pour pouvoir continuer svp.";
                        $('#modalPanier').modal('hide');
                        $('#myModal').modal();
                    }
                    $scope.sessionInfo = results;
                    //$location();
                })
            };

            vm.fnGetFraisLivr = function () {
                $('#modalPanier').modal('hide');
                $location.path('/checkout');
                return;
            };

        };



        vm.fnInit();

    });
