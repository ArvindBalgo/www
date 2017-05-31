angular
    .module('myApp')
    .controller('ficheController', function ($scope, $location, $timeout, messages, $http, Data, $translate, $routeParams) {
        console.log('fiche controller');
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        var vm = this;
        vm.currentProd = $routeParams.idcata;
        vm.models = [];
        vm.gabarits = [];
        vm.modelsTous = [];
        vm.listMetier = [];
        vm.libMetier = [];
        vm.arrProduits = [];
        vm.activeId = 1;
        vm.isShow = 1;
        vm.produit = [{titre: "", commentaire: ''}];
        vm.unitprix = 0;
        vm.prixvente = 0;
        vm.imagesList = [];
        vm.arrCurrentDims = [];// to be used ro regenerate the array
        vm.arrCurrentQtes = [];// to be used ro regenerate the array
        vm.modifEnCoursProd = {};
        vm.prodEnCours = [];
        $('body').addClass("spinner");
        $scope.alertMsg = "";
        $scope.isFiche = true;
        vm.login = {email: "", password: ""};
        vm.montants = {frais_livr: 0, prix_total_ht: 0, tax: 0, prix_ttc: 0, montant_net: 0};

        vm.currentMetier = "";
        $(function () {
            $('[data-toggle="popover"]').popover()
        });

        //console.log("FACT VALUE:: ", messages.list);
        vm.arrProduits = [];
        var count = Number(sessionStorage.getItem("produitCount"));
        if (count) {
            for (i = 0; i <= count; i++) {
                vm.arrProduits.push(JSON.parse(sessionStorage.getItem("produit" + count)));
            }
        }

        if (vm.arrProduits == null) {
            vm.arrProduits = [];
            sessionStorage.setItem("produits", JSON.stringify(vm.arrProduits));
        }

        //vm.countProds = (JSON.parse(localStorage.getItem("produits"))).length;
        vm.countProds = 0;

        $(".sel_trait").select2({
            tags: true,
            allowClear: true,
            data: [],
            "language": {
                "noResults": function () {
                    return "Pas de résutat";
                }
            }
        });

        $(".sel_dimensions").select2({
            tags: true,
            allowClear: true,
            data: [],
            "language": {
                "noResults": function () {
                    return "Pas de résutat";
                }
            }
        });
        $(".sel_qte").select2({
            tags: true,
            allowClear: true,
            data: [],
            "language": {
                "noResults": function () {
                    return "Pas de résutat";
                }
            }
        });
        $(".sel_papier").select2({
            tags: true,
            allowClear: true,
            data: [],
            "language": {
                "noResults": function () {
                    return "Pas de résutat";
                }
            }
        });

        vm.productsDesign = [];

        vm.fnInit = function (idprod) {
            console.log("**************************************");
            console.log(localStorage.idModelMetier);
            console.log(vm.currentProd);
            console.log(idprod);
            console.log("**************************************");
            $http({
                method: 'GET',
                params: {mode: 9, metier: localStorage.idModelMetier, id_model: idprod},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                vm.productList = response.data;
                var arrDimensions = vm.productList[0].dimensions.split(',');
                var arrQte = vm.productList[0].qte.split(',');
                var arrDataDims = [];
                var arrDataQte = [];
                var arrPapier = [];

                angular.forEach(vm.productList[0].type_support, function (value) {
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
                angular.forEach(vm.productList[0].coeff_dims, function (value) {
                    if (value.dimension.trim() == $('.sel_dimensions').select2('data')[0].text.trim()) {
                        coeff_dimension = Number(value.coeff);
                    }
                });
                if (vm.productList[0].type_tarif > -1) {
                    angular.forEach(vm.productList[0].info_prix, function (value) {
                        if (value.id_support == idSupport && Number(value.qte) == qte_commander) {
                            coeff_support = Number(value.coeff_prix);
                            coeff_qte = Number(value.coeff_qte);
                        }
                    });
                    vm.unitprix = ((coeff_dimension * coeff_qte * coeff_support) / qte_commander).toFixed(3);
                    vm.prixvente = (coeff_dimension * coeff_qte * coeff_support).toFixed(2);

                }
                else {
                    angular.forEach(vm.productList[0].tarifManuel, function (value) {
                        if (value.lib_dim == $('.sel_dimensions').select2('data')[0].text.trim() && Number(value.qte) == qte_commander && value.id_support == idSupport) {
                            vm.unitprix = ((value.prix_vente) / Number(value.qte)).toFixed(3);
                            vm.prixvente = Number(value.prix_vente).toFixed(2);
                        }
                    })
                }
                var lang = localStorage.getItem("LANG");
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
                //******************************************************
                //selection produit
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
                            fonts: [
                                {name: 'Helvetica'},
                                {name: 'Times New Roman'},
                                {name: 'Arial'},
                                {name: 'ADAGESCRIPTJF', url: '/fonts/adagescriptjf.ttf'},
                                {name: 'AKAFRIVOLITY', url: '/fonts/akaFrivolity.ttf'},
                                {name: 'ALADDINREGULAR', url: '/fonts/AladdinRegular.ttf'},
                                {name: 'ALANDEN', url: '/fonts/Alanden_.ttf'},
                                {name: 'ALGER', url: '/fonts/ALGER.ttf'},
                                {name: 'AMAZONEBT', url: '/fonts/AmazoneBT.ttf'},
                                {name: 'AMIENNEBOLD', url: '/fonts/amiennebold.ttf'},
                                {name: 'ANDESIT', url: '/fonts/ANDESIT.ttf'},
                                {name: 'ARISTOCRAT-LET', url: '/fonts/aristocrat-let.ttf'},
                                {name: 'ASHTONSHAND', url: '/fonts/ashtonshand.ttf'},
                                {name: 'AYUMA', url: '/fonts/AYUMA.TTF'},
                                {name: 'BAMBOO', url: '/fonts/bamboo.ttf'},
                                {name: 'BAUHAUS DEMI', url: '/fonts/bauhaus_demi.otf'},
                                {name: 'BELLEROSE', url: '/fonts/Bellerose.ttf'},
                                {name: 'BERGELL LET', url: '/fonts/Bergell LET.ttf'},
                                {name: 'BERNHARDFASD', url: '/fonts/BernhardFasd__.ttf'},
                                {name: 'BIFFO-MT', url: '/fonts/biffo-mt.otf'},
                                {name: 'BLACKJAR', url: '/fonts/BLACKJAR.TTF'},
                                {name: 'BORDEAUX_LT_RM', url: '/fonts/bordeaux_LT_Rm.otf'},
                                {name: 'BRODYD', url: '/fonts/BrodyD.ttf'},
                                {name: 'BRUSH SCRIPT MT', url: '/fonts/Brush_Script_MT.ttf'},
                                {name: 'BRUSHSCRIPT', url: '/fonts/BrushScript.ttf'},
                                {name: 'BUSORAMA BD BT', url: '/fonts/busorama_Bd_BT.ttf'},
                                {name: 'CACPINAFORE', url: '/fonts/CACPINAFORE.TTF'},
                                {name: 'CALLIGRAPHYFLF', url: '/fonts/CalligraphyFLF.ttf'},
                                {name: 'CARLISL', url: '/fonts/CARLISL.ttf'},
                                {name: 'CARMINE', url: '/fonts/CARMINE.TTF'},
                                {name: 'CASCADE-SCRIPT', url: '/fonts/cascade-script.ttf'},
                                {name: 'CHAMPAGNE', url: '/fonts/Champagne.ttf'},
                                {name: 'CHARME', url: '/fonts/CHARME.ttf'},
                                {name: 'CLASSIC SCRIPT MN-1', url: '/fonts/Classic_Script_MN-1.ttf'},
                                {name: 'COMIC-SANS-MS', url: '/fonts/comic-sans-ms.ttf'},
                                {name: 'COMMERCIALSCRT', url: '/fonts/CommercialScrT.ttf'},
                                {name: 'COOPERBLAD', url: '/fonts/CooperBlaD.ttf'},
                                {name: 'CORONI', url: '/fonts/CoronI.ttf'},
                                {name: 'CURLZ MT', url: '/fonts/Curlz_MT.ttf'},
                                {name: 'DANIELBD', url: '/fonts/danielbd.ttf'},
                                {name: 'DESYREL', url: '/fonts/DESYREL_.ttf'},
                                {name: 'DISKUSDMED', url: '/fonts/DiskusDMed.ttf'},
                                {name: 'DOMCASUAL', url: '/fonts/domcasual.ttf'},
                                {name: 'ELGARRETT', url: '/fonts/Elgarrett.ttf'},
                                {name: 'ENGLISH', url: '/fonts/English.ttf'},
                                {name: 'ENVIROSCD', url: '/fonts/EnviroSCD.ttf'},
                                {name: 'FAITHFUL-FLY-LET', url: '/fonts/faithful-fly-Let.otf'},
                                {name: 'FELTTIP', url: '/fonts/FELTTIP.ttf'},
                                {name: 'FELY', url: '/fonts/Fely.ttf'},
                                {name: 'FLORALIE', url: '/fonts/FLORALIE.ttf'},
                                {name: 'FONTDINERDOTCOM', url: '/fonts/Fontdinerdotcom.ttf'},
                                {name: 'FONTLERO', url: '/fonts/FONTLERO.TTF'},
                                {name: 'FREEHAN1', url: '/fonts/freehan1.TTF'},
                                {name: 'FREEHAN4-3', url: '/fonts/freehan4-3.TTF'},
                                {name: 'FREESTYLESCRIPTITC-NORMAL', url: '/fonts/FreestyleScriptITC-Normal.ttf'},
                                {name: 'FRESHSCRIPT', url: '/fonts/freshscript.ttf'},
                                {name: 'FUNSTUFF', url: '/fonts/Funstuff.ttf'},
                                {name: 'FUTURA BOLD-OBLIQUE', url: '/fonts/futura_bold-oblique.ttf'},
                                {name: 'FUTURA BOOK ITALIC', url: '/fonts/Futura_book_italic.ttf'},
                                {name: 'FUTURA BOOK-OBLIQUE', url: '/fonts/futura_book-oblique.ttf'},
                                {name: 'FUTURA BOOK', url: '/fonts/Futura_book.TTF'},
                                {name: 'FUTURA MEDIUM', url: '/fonts/futura_medium.ttf'},
                                {name: 'FUTURA-BOOK', url: '/fonts/futura-book.ttf'},
                                {name: 'HANSHAND', url: '/fonts/hanshand.TTF'},
                                {name: 'HARINGTON', url: '/fonts/Harington.ttf'},
                                {name: 'HELVETICA-BLACK-SEMIBOLD', url: '/fonts/helvetica-black-semibold.ttf'},
                                {name: 'HELVETICA-BOLD-OBLIQUE', url: '/fonts/helvetica-bold-oblique.ttf'},
                                {name: 'HELVETICA-BOLD', url: '/fonts/helvetica-bold.ttf'},
                                {name: 'HELVETICA-CONDENSED-BLACK', url: '/fonts/helvetica-condensed-black.ttf'},
                                {name: 'HELVETICA-CONDENSED-THIN', url: '/fonts/helvetica-condensed-thin.ttf'},
                                {name: 'HELVETICA-LIGHT-ITALIC', url: '/fonts/helvetica-light-italic.ttf'},
                                {name: 'HELVETICA-NORMAL', url: '/fonts/helvetica-normal.ttf'},
                                {name: 'HOBOBT', url: '/fonts/HoboBT.ttf'},
                                {name: 'HOGARSCRD', url: '/fonts/HogarScrD.ttf'},
                                {name: 'HOLLYWOOD_HILLS', url: '/fonts/HOLLYWOOD_hills.ttf'},
                                {name: 'IMPULSBT', url: '/fonts/ImpulsBT.ttf'},
                                {name: 'ISADORA BOLD', url: '/fonts/isadora_bold.ttf'},
                                {name: 'ITC TIFFANY STD DEMI', url: '/fonts/ITC_Tiffany_Std_Demi.ttf'},
                                {name: 'ITC TIFFANY STD HEAVY ITALIC', url: '/fonts/ITC_Tiffany_Std_Heavy_italic.ttf'},
                                {name: 'KIDPRINT', url: '/fonts/Kidprint.ttf'},
                                {name: 'KON_TIKI_ENCHANTED_JF', url: '/fonts/Kon_Tiki_Enchanted_JF.ttf'},
                                {name: 'KUENSTLER', url: '/fonts/KUENSTLER.ttf'},
                                {name: 'KUENSTLERSCRIPT BLACK', url: '/fonts/kuenstlerScript_black.ttf'},
                                {name: 'LUCIDA CALLIGRAPHY ITALIC', url: '/fonts/Lucida_Calligraphy_Italic.ttf'},
                                {name: 'LUCIDA HANDWRITING', url: '/fonts/Lucida_Handwriting.ttf'},
                                {name: 'MAIANDRA', url: '/fonts/maiandra.TTF'},
                                {name: 'MANDASCD', url: '/fonts/MandaSCD.ttf'},
                                {name: 'MATISSE_ITC', url: '/fonts/Matisse_ITC.ttf'},
                                {name: 'MILANO', url: '/fonts/milano.TTF'},
                                {name: 'MISTRAL', url: '/fonts/Mistral.ttf'},
                                {name: 'MONTEREY-BT', url: '/fonts/monterey-bt.ttf'},
                                {name: 'MURRAYHILLBOLDREGULAR', url: '/fonts/murrayhillboldregular.ttf'},
                                {name: 'NEVISONCASD', url: '/fonts/NevisonCasD.ttf'},
                                {name: 'NUPTIAL-BT', url: '/fonts/nuptial-bt.ttf'},
                                {name: 'ODIN-ROUNDED', url: '/fonts/odin-rounded.otf'},
                                {name: 'OLD-ENGLISH-TEXT', url: '/fonts/old-english-text.ttf'},
                                {name: 'OPTIBERNHARD-BOLDCURSIVE', url: '/fonts/optibernhard-boldcursive.otf'},
                                {name: 'OPTIMALTSTD-BOLDITALIC', url: '/fonts/optimaltstd-bolditalic.ttf'},
                                {name: 'OPTIMALTSTD-DEMIBOLD', url: '/fonts/optimaltstd-demibold.ttf'},
                                {name: 'PARADE', url: '/fonts/PARADE.ttf'},
                                {name: 'PARISIAN', url: '/fonts/parisian.ttf'},
                                {name: 'PARK AVENUE-2', url: '/fonts/Park_Avenue-2.ttf'},
                                {name: 'PHYLLD', url: '/fonts/PhyllD.ttf'},
                                {name: 'PRESENT BOLD', url: '/fonts/PRESENT_Bold.TTF'},
                                {name: 'PRESENT_SCRIPT-THIN', url: '/fonts/Present_Script-thin.TTF'},
                                {name: 'PROVIDENCEBOLD', url: '/fonts/ProvidenceBold.ttf'},
                                {name: 'SANDBUREAU', url: '/fonts/SandBureau.ttf'},
                                {name: 'SCRIPTINA', url: '/fonts/SCRIPTINA.ttf'},
                                {name: 'SNELL-ROUNDHAND-BOLD', url: '/fonts/snell-roundhand-bold.ttf'},
                                {name: 'TANGERINE_BOLD', url: '/fonts/Tangerine_Bold.ttf'},
                                {name: 'TEMPUS SANS ITC', url: '/fonts/Tempus_Sans_ITC.ttf'},
                                {name: 'TEXTILE', url: '/fonts/Textile.ttf'},
                                {name: 'TIMES ITALIC', url: '/fonts/Times_Italic.ttf'},
                                {name: 'TIMES', url: '/fonts/Times.ttf'},
                                {name: 'TIMESBOLD', url: '/fonts/TimesBold.ttf'},
                                {name: 'TIMESBOLDITALIC', url: '/fonts/TimesBoldItalic.ttf'},
                                {name: 'TIMESCRDMED', url: '/fonts/timescrdmed.ttf'},
                                {name: 'VAN-DIJK-LET-PLAIN', url: '/fonts/van-dijk-let-plain.ttf'},
                                {name: 'VIVALDI', url: '/fonts/Vivaldi.ttf'},
                                {name: 'WALTOGRAPH', url: '/fonts/waltograph.ttf'},
                                {name: 'ZAPFDINGBATS', url: '/fonts/ZapfDingbats.ttf'},
                                {name: 'ZAPFINO', url: '/fonts/Zapfino.dfont'},
                                {name: 'ZF CHANCERY BOLD', url: '/fonts/Zf_Chancery_bold.ttf'},
                                {name: 'ZF CHANCERY MEDIUM', url: '/fonts/Zf_Chancery_medium.ttf'}
                            ],
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

                    angular.forEach(vm.productList, function (value) {
                        var arrProducts = [];
                        var arrFront = [];
                        var arrBack = [];

                        angular.forEach(value.elemfront.params, function (value1) {
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

                        angular.forEach(value.elemback.params, function (value1) {
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
                        yourDesigner.addProduct(arrProducts);
                    });

                    //print button
                    $('#print-button').click(function () {
                        // yourDesigner.print();
                        yourDesigner.addCustomImage('images/gallery/TEST/Picture2.png', ' Arvind');
                        return false;
                    });

                    //create an image
                    $('#image-button').click(function () {
                        var image = yourDesigner.createImage();
                        console.log(image);
                        return false;
                    });


                    //checkout button with getProduct()
                    $('#checkout-button').click(function () {
                        var product = yourDesigner.getProduct();
                        console.log(product);
                        return;
                        $http({
                            method: 'GET',
                            params: {mode: 2, data: product},
                            url: 'api/v1/sampleControl.php'
                        }).then(function successCallback(response) {
                            console.log(response.data, "  ::data");
                        }, function errorCallback(error) {
                            console.log(error);
                        });
                        return false;
                    });

                    //event handler when the price is changing
                    $yourDesigner.on('priceChange', function (evt, price, currentPrice) {
                        $('#thsirt-price').text(currentPrice);
                    });

                    $yourDesigner.on('ready', function (evt, price, currentPrice) {

                    });

                    //save image on webserver
                    $('#save-image-php').click(function () {

                        yourDesigner.getProductDataURL(function (dataURL) {
                            $.post("php/save_image.php", {base64_image: dataURL});
                        });

                    });

                    //send image via mail
                    $('#send-image-mail-php').click(function () {

                        yourDesigner.getProductDataURL(function (dataURL) {
                            $.post("php/send_image_via_mail.php", {base64_image: dataURL});
                        });

                    });
                    vm.fnNouveau = function () {
                        console.log("NOUVEAU");
                        $http({
                            method: 'GET',
                            params: {mode: 1, type: 0},
                            url: 'api/v1/sampleControl.php'
                        }).then(function successCallback(response) {
                            console.log(response);
                        }, function errorCallback(error) {
                            console.log(error);
                        });
                    };

                    vm.fnOpenModal = function () {
                        $scope.product = yourDesigner.getProduct();
                        console.log($scope.product);
                        $('#myModel').modal();
                    }

                    vm.fnQuitter = function () {
                        console.log("annuler");
                        $('#myModel').modal('hide');
                    };

                    vm.fnValider = function () {

                        yourDesigner.getProductDataURL(function (dataURL) {
                            console.log("LIBELLE:: ", vm.libelle);
                            console.log("DEscription:: ", vm.description);
                            console.log("Reference:: ", vm.reference);
                            console.log("selected: ", $(".selObj").select2().val());
                            console.log("valider", yourDesigner.getProduct());

                            if (vm.libelle == '' || vm.description == '' || $(".selObj").select2().val() == '' || $(".selObj").select2().val() == null) {
                                bootbox.alert("Toutes les informations sont obligatoire");
                                return;
                            }

                            $.post("api/save_image.php", {
                                base64_image: dataURL,
                                ref: vm.reference,
                                libelle: vm.libelle,
                                description: vm.description,
                                metiers: $(".selObj").select2().val(),
                                data: yourDesigner.getProduct()
                            });

                        });
                        $('#myModel').modal('hide');

                    }

                    vm.fnSauvegarde = function () {
                        var product = yourDesigner.getProduct();
                        console.log("SAUVEGARDE");
                        $http({
                            method: 'GET',
                            params: {mode: 2, data: product},
                            url: 'api/v1/sampleControl.php'
                        }).then(function successCallback(response) {
                            console.log(response.data, "  ::data");
                        }, function errorCallback(error) {
                            console.log(error);
                        });
                        console.log(product);
                        console.log("*******************");
                    };

                    vm.fnImage = function () {
                        yourDesigner.getProductDataURL(function (dataURL) {
                            $.post("api/save_image.php", {base64_image: dataURL}).success(function (data) {
                                // console.log(data);
                                console.log("TESTING ISSUE ");
                            })
                        });
                    };

                    vm.fnModelClick = function (id, id_model_metier) {
                        //console.clear();
                        console.log("***********************************");
                        console.log(id, id_model_metier);
                        console.log("************************************");
                        vm.prodEnCours = [];
                        vm.produit.titre = "";
                        vm.produit.commentaire = "";
                        $('input[name="optescargot"]').val([0]);
                        $('input[name="optradio"]').val([0]);
                        $('input[name="optcommande"]').val([0]);
                        $http({
                            method: 'GET',
                            params: {mode: 5, id: id},
                            url: 'api/v1/sampleControl.php'
                        }).then(function successCallback(response) {

                            var data = angular.copy(response.data);
                            vm.productList = data;
                            var arrDimensions = vm.productList[0].dimensions.split(',');
                            var arrQte = vm.productList[0].qte.split(',');
                            var arrDataDims = [];
                            var arrDataQte = [];
                            angular.forEach(arrDimensions, function (value, key) {
                                arrDataDims.push({id: key, text: value});
                            });
                            angular.forEach(arrQte, function (value, key) {
                                arrDataQte.push({id: key, text: value});
                            });

                            vm.arrCurrentDims = arrDataDims;
                            vm.arrCurrentQtes = arrDataQte;

                            // clear all option
                            $('.sel_dimensions').html('').select2({data: [{id: '', text: ''}]});

                            // clear and add new option
                            $(".sel_dimensions").html('').select2({data: arrDataDims});
                            console.log(arrDimensions, "  array of dimensions");

                            $('.sel_qte').html('').select2({data: [{id: '', text: ''}]});

                            // clear and add new option
                            $(".sel_qte").html('').select2({data: arrDataQte});
                            //selection produit
                            $('#aucun').prop('checked', true);
                            $('#aucunEscargot').prop('checked', true);
                            $('#cmdBonTirer').prop('checked', true);
                            //vm.fnCalcPrixVente(1);
                            angular.forEach(response.data, function (value) {
                                var arrProducts = [];
                                var arrFront = [];
                                var arrBack = [];

                                angular.forEach(value.elemfront.params, function (value1) {
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

                                angular.forEach(value.elemback.params, function (value1) {
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
                                    else {
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

                                if (arrFront.length > 0) {
                                    arrProducts.push({
                                        id: value.id,
                                        title: value.title,
                                        thumbnail: value.thumbnail_src,
                                        elements: arrFront
                                    });
                                }
                                if (arrBack.length > 0) {
                                    arrProducts.push({
                                        id: value.id,
                                        title: value.title,
                                        thumbnail: value.thumbnail_src,
                                        elements: arrBack
                                    });
                                }

                                yourDesigner.loadProduct(arrProducts);

                                $('#galleryModal').modal('hide');
                            });

                            vm.fnInit(id);
                        }, function errorCallback(error) {
                            console.log(error);
                        });
                    }

                    vm.fnValidMaquette = function () {
                        Data.get('session.php').then(function (results) {
                            console.log(results, "  DATA results");
                            if (results.uid) {
                                $scope.isLogged = true;
                                $scope.utilisateur = results.name;
                                console.log(vm.arrProduits, " array produits");
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
                    }

                    vm.fnSaveProduit = function () {
                        console.clear();
                        console.log(vm.arrProduits);
                        var arrListCheckoutProds = new Array();
                        angular.forEach(vm.arrProduits, function (value, key) {
                            arrListCheckoutProds[key] = {};
                            arrListCheckoutProds[key][value.idn_key] = value.random_str;
                            // arrListCheckoutProds.push(value.random_str);
                        });
                        console.log(JSON.stringify(arrListCheckoutProds));
                        $http({
                            method: 'GET',
                            params: {mode: 20, list: JSON.stringify(arrListCheckoutProds)},
                            url: 'api/v1/sampleControl.php'
                        }).then(function successCallback(response) {
                                vm.arrProduits = [];
                                sessionStorage.clear();
                                $('#modalMaquette').modal('hide');
                                $('#modalPanier').modal('hide');
                                toastr.success("Order Confirmed");
                            }
                            , function errorCallback(error) {
                                console.log(error);
                            });


                        /* bootbox.alert('Votre Schèma a été enregistré.');
                         toastr.options.positionClass = 'toast-top-right';
                         toastr.success("Enregistrement terminé");
                         //localStorage.setItem("id_model", $id_cata);



                         $("#modalMaquette").modal('hide');*/
                    };

                    vm.fnGetFraisLivr = function () {
                        console.log(vm.arrProduits);
                        var arrKeysDL = [];
                        angular.forEach(vm.arrProduits, function (value) {
                            arrKeysDL.push({'idprod': value.idProduit, 'qte': value.qte, 'dimension': value.dimension});
                        });
                        console.log(arrKeysDL);

                        $http({
                            method: 'GET',
                            params: {mode: 19, data: JSON.stringify(arrKeysDL)},
                            url: 'api/v1/sampleControl.php'
                        }).then(function successCallback(response) {
                            console.clear();
                            console.log(vm.arrProduits);
                            console.log(response.data);
                            var arrFraisLivr = response.data;

                            vm.montants.frais_livr = 0;
                            vm.montants.prix_total_ht = 0;
                            vm.montants.tax = 0;
                            vm.montants.valTax = 0;
                            vm.montants.prix_ttc = 0;
                            vm.montants.montant_net = 0;
                            //var arrProduits = JSON.parse(sessionStorage.getItem("arrProds"));
                            //console.log(arrProduits)
                            /*console.log(vm.arrProduits, " array of data")
                             angular.forEach(vm.arrProduits, function(value){
                             angular.forEach(value.fraisLivr, function(ligne){
                             if(Number(value.qte) == Number(ligne.qte)){
                             vm.montants.frais_livr += Number(ligne.price);
                             }
                             });
                             console.log(value.prix, " -- ", Number(value.prix));
                             vm.montants.prix_total_ht += Number(value.unitprix)*Number(value.qte);
                             });
                             console.log(vm.montants, " montants");
                             vm.montants.tax = 0.2 * (vm.montants.prix_total_ht + vm.montants.frais_livr);
                             vm.montants.prix_ttc = vm.montants.prix_total_ht + vm.montants.tax;
                             vm.montants.montant_net = vm.montants.prix_ttc;

                             vm.montants.frais_livr    = vm.montants.frais_livr.toFixed(2);
                             vm.montants.prix_total_ht = vm.montants.prix_total_ht.toFixed(2);
                             vm.montants.tax = vm.montants.tax.toFixed(2);
                             vm.montants.prix_ttc = vm.montants.prix_ttc.toFixed(2);
                             vm.montants.montant_net = vm.montants.montant_net.toFixed(2);*/

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
                            console.log(vm.montants.valTax, " tax value");
                            vm.montants.prix_ttc = Number(vm.montants.prix_total_ht) + Number(vm.montants.tax);
                            vm.montants.prix_ttc = (vm.montants.prix_ttc).toFixed(2);
                            vm.montants.montant_net = Number((vm.montants.prix_ttc)) + Number((vm.montants.frais_livr)) + Number(vm.montants.taxLivr);
                            vm.montants.montant_net = vm.montants.montant_net;

                            $('#modalMaquette').modal();
                            $('#modalPanier').modal('hide');
                        }, function errorCallback(error) {
                            console.log(error);
                        });


                    }

                    vm.fnAddBasket = function () {
                        if (typeof vm.produit.titre == 'undefined' || (vm.produit.titre).trim() == "") {
                            bootbox.alert("<div style='text-align: center'><b>Veuillez renseigner le titre s'il-vous-plait.</b></div>");
                            return;
                        }
                        // console.clear();
                        console.log("vois si produit en cour de modifs", vm.prodEnCours);
                        if (vm.prodEnCours.length != 0) {

                            bootbox.dialog({
                                message: "Cette produit est issue d'une produit déjà dans le panier. Souhaitez-vouz modifier l'existant ou le rajouter comme nouveau",
                                title: "Modification/Ajout Produit",
                                buttons: {
                                    annuler: {
                                        label: "Nouveau Produit",
                                        className: "btn-secondary",
                                        callback: function () {
                                            var countProduit = 0;
                                            var arrProds = [];

                                            console.log(vm.arrCurrentQtes, vm.arrCurrentDims, " -----");
                                            if (sessionStorage.produitCount) {
                                                countProduit = Number(sessionStorage.produitCount) + 1;
                                            }
                                            var obj = {};
                                            yourDesigner.getProductDataURL(function (dataURL) {

                                                //obj.base64_image    = dataURL;
                                                obj.title = vm.produit.titre;
                                                obj.commentaire = vm.produit.commentaire;
                                                obj.opt = $('input[name="optradio"]:checked').val();
                                                obj.contours = vm.productList[0].contours;
                                                obj.liserai = vm.productList[0].liserai;
                                                obj.escargot = vm.productList[0].escargot;
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
                                                obj.idProduit = vm.productList[0].id;

                                                if (typeof vm.produit.commentaire == 'undefined') {
                                                    vm.produit.commentaire = " ";
                                                }
                                                $.ajax({
                                                    url: 'api/v1/temp_produit.php',
                                                    type: 'post',
                                                    dataType: 'json',
                                                    success: function (data) {
                                                        console.log("data");
                                                    },
                                                    data: {
                                                        modified: false,
                                                        base64_image: dataURL,
                                                        title: vm.produit.titre,
                                                        comm: vm.produit.commentaire,
                                                        opt: $('input[name="optradio"]:checked').val(),
                                                        contours: vm.productList[0].contours,
                                                        liserai: vm.productList[0].liserai,
                                                        escargot: vm.productList[0].escargot,
                                                        idmodelmetier: vm.productList[0].idmodelmetier,
                                                        idproduit: vm.productList[0].id,
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
                                            toastr.success('Produit rajouté');
                                        }
                                    },
                                    valider: {
                                        label: "Modifier Existant",
                                        className: "btn-success",
                                        callback: function () {
                                            var countProduit = 0;
                                            var arrProds = [];

                                            console.log(vm.arrCurrentQtes, vm.arrCurrentDims, " -----");
                                            if (sessionStorage.produitCount) {
                                                countProduit = Number(sessionStorage.produitCount) + 1;
                                            }
                                            var obj = {};
                                            yourDesigner.getProductDataURL(function (dataURL) {

                                                //obj.base64_image    = dataURL;
                                                obj.title = vm.produit.titre;
                                                obj.commentaire = vm.produit.commentaire;
                                                obj.opt = $('input[name="optradio"]:checked').val();
                                                obj.contours = vm.productList[0].contours;
                                                obj.liserai = vm.productList[0].liserai;
                                                obj.escargot = vm.productList[0].escargot;
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
                                                obj.idProduit = vm.productList[0].id;

                                                if (typeof vm.produit.commentaire == 'undefined') {
                                                    vm.produit.commentaire = " ";
                                                }
                                                $.ajax({
                                                    url: 'api/v1/temp_produit.php',
                                                    type: 'post',
                                                    dataType: 'json',
                                                    success: function (data) {
                                                        console.log("data");
                                                    },
                                                    data: {
                                                        modified: true,
                                                        base64_image: dataURL,
                                                        title: vm.produit.titre,
                                                        comm: vm.produit.commentaire,
                                                        opt: $('input[name="optradio"]:checked').val(),
                                                        contours: vm.productList[0].contours,
                                                        liserai: vm.productList[0].liserai,
                                                        escargot: vm.productList[0].escargot,
                                                        escargot_val: $('input[name="optescargot"]:checked').val(),
                                                        idmodelmetier: vm.productList[0].idmodelmetier,
                                                        idproduit: vm.productList[0].id,
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
                                            toastr.success('Produit rajouté');
                                        }
                                    }
                                }
                            });
                            return;
                        }
                        var countProduit = 0;
                        var arrProds = [];

                        console.log(vm.productList[0], " <<<<===");
                        if (sessionStorage.produitCount) {
                            countProduit = Number(sessionStorage.produitCount) + 1;
                        }
                        var obj = {};
                        yourDesigner.getProductDataURL(function (dataURL) {

                            //obj.base64_image    = dataURL;
                            obj.title = vm.produit.titre;
                            obj.commentaire = vm.produit.commentaire;
                            obj.opt = $('input[name="optradio"]:checked').val();
                            obj.contours = vm.productList[0].contours;
                            obj.liserai = vm.productList[0].liserai;
                            obj.escargot = vm.productList[0].escargot;
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
                            obj.idProduit = vm.productList[0].id;

                            if (typeof vm.produit.commentaire == 'undefined') {
                                vm.produit.commentaire = " ";
                            }
                            $.ajax({
                                url: 'api/v1/temp_produit.php',
                                type: 'post',
                                dataType: 'json',
                                success: function (data) {
                                    console.log("data");
                                },
                                data: {
                                    modified: false,
                                    base64_image: dataURL,
                                    title: vm.produit.titre,
                                    comm: vm.produit.commentaire,
                                    opt: $('input[name="optradio"]:checked').val(),
                                    contours: vm.productList[0].contours,
                                    liserai: vm.productList[0].liserai,
                                    escargot: vm.productList[0].escargot,
                                    escargot_val: $('input[name="optescargot"]:checked').val(),
                                    dimension: $('.sel_dimensions').select2('data')[0].text,
                                    id_dimension: $('.sel_dimensions').select2('data')[0].id,
                                    idmodelmetier: vm.productList[0].idmodelmetier,
                                    idproduit: vm.productList[0].id,
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
                            vm.prodEnCours = obj;
                            sessionStorage.setItem("arrProds", JSON.stringify(arrProds));
                            sessionStorage.setItem("produit" + countProduit, JSON.stringify(obj));
                            vm.arrProduits = [];
                        });
                        toastr.options.positionClass = 'toast-top-right';
                        toastr.success('Produit rajouté');

                    };

                    vm.fnClickPanier = function () {
                        vm.arrProduits = [];
                        var count = Number(sessionStorage.getItem("produitCount"));
                        var arrProds = JSON.parse(sessionStorage.getItem("arrProds"));
                        if (arrProds != null) {
                            angular.forEach(arrProds, function (value) {
                                vm.arrProduits.push(JSON.parse(sessionStorage.getItem(value)));
                            });
                        }

                        console.log(vm.arrProduits, " arrr produits local");
                        //POST data http

                        /*$http({
                         method: 'POST',
                         data: $.param({mode:1}),
                         url: 'api/v1/recupTempProd.php',
                         headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                         }).then(function successCallback(response) {
                         console.log(response.data);
                         vm.arrProduits = response.data;
                         }, function errorCallback(error) {
                         console.log(error);
                         });
                         */
                        $("#modalPanier").modal();
                    };

                    vm.fnAlertCommentaire = function (text) {
                        if (text != "" && typeof text !== 'undefined') {
                            bootbox.alert("<div style='text-align: center'>" + text + "</div>");
                        }
                    };

                    vm.fnShowButtonComm = function (text) {
                        if (text != "" && typeof text !== 'undefined') {
                            return true;
                        }
                        else {
                            return false;
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
                                bootbox.alert("<img style='width: 400px;height: 400px' src='" + response.data + "'>");

                                $('body').removeClass("spinner");
                                vm.arrProduits = response.data;
                            },
                            function errorCallback(error) {
                                console.log(error);
                            });

                        //bootbox.alert("<img style='width: 100%;height: 100%' src='"+produit.base64_image+"'>");
                    };

                    vm.fnEditClient = function (produit) {
                        $("#modalPanier").modal('hide');
                        $('body').addClass("spinner");
                        console.log(produit, " produit par fn");
                        vm.prodEnCours = produit;
                        $http({
                            method: 'POST',
                            data: $.param({mode: 3, key_prod: produit.idn_key}),
                            url: 'api/v1/recupTempProd.php',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).then(function successCallback(response) {

                                $('body').removeClass("spinner");
                                var ligne = response.data;
                                console.log(ligne);
                                ligne.data = JSON.parse(ligne.data);
                                vm.productList[0] = ligne;
                                $('input[name="optescargot"]').val([vm.productList[0].escargot_val]);
                                $('input[name="optradio"]').val([vm.productList[0].opt]);
                                $('input[name="optcommande"]').val([vm.productList[0].bonrepli]);
                                $(".sel_papier").val(vm.productList[0].idsupport).change();

                                $('.sel_dimensions').html('').select2({data: [{id: '', text: ''}]});

                                // clear and add new option
                                $(".sel_dimensions").html('').select2({data: produit.arrDims});
                                console.log(arrDimensions, "  array of dimensions");

                                $('.sel_qte').html('').select2({data: [{id: '', text: ''}]});

                                // clear and add new option
                                $(".sel_qte").html('').select2({data: produit.arrQtes});

                                $(".sel_dimensions").val(vm.productList[0].id_dimension).change();
                                $(".sel_qte").val(vm.productList[0].id_qte).change();

                                console.log(ligne, " current prod selected");
                                vm.produit.titre = produit.title;
                                vm.produit.commentaire = ligne.commentaire;
                                angular.forEach(ligne.data, function (value) {
                                    angular.forEach(value.elements, function (value1) {
                                        var flag = false;

                                        value1.parameters.angle = Number(value1.parameters.angle);
                                        value1.parameters.height = Number(value1.parameters.height);
                                        value1.parameters.left = Number(value1.parameters.left);
                                        value1.parameters.opacity = Number(value1.parameters.opacity);
                                        value1.parameters.padding = Number(value1.parameters.padding);
                                        value1.parameters.top = Number(value1.parameters.top);
                                        value1.parameters.scaleX = Number(value1.parameters.scaleX);
                                        value1.parameters.scaleY = Number(value1.parameters.scaleY);
                                        value1.parameters.width = Number(value1.parameters.width);

                                        if (value1.parameters.fill == "false") {
                                            value1.parameters.fill = false;
                                        }

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
                                    })
                                });
                                vm.modifEnCoursProd = ligne;
                                yourDesigner.loadProduct((ligne.data));
                            },
                            function errorCallback(error) {
                                console.log(error);
                            });


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
                                        console.log("Annulation");
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

                    vm.fnCalcPrixVente = function (flag) {
                        var idSupport = $('.sel_papier').select2('data')[0].id;
                        var qte_commander = Number($('.sel_qte').select2('data')[0].text);
                        var coeff_dimension = 0;
                        var coeff_support = 0;
                        var coeff_qte = 0;

                        angular.forEach(vm.productList[0].coeff_dims, function (value) {
                            if (value.dimension.trim() == $('.sel_dimensions').select2('data')[0].text.trim()) {
                                coeff_dimension = Number(value.coeff);
                            }
                        });
                        if (vm.productList[0].type_tarif > -1) {
                            angular.forEach(vm.productList[0].info_prix, function (value) {
                                if (value.id_support == idSupport && Number(value.qte) == qte_commander) {
                                    coeff_support = Number(value.coeff_prix);
                                    coeff_qte = Number(value.coeff_qte);
                                }
                            });

                            vm.unitprix = ((coeff_dimension * coeff_qte * coeff_support) / qte_commander).toFixed(3);
                            vm.prixvente = (coeff_dimension * coeff_qte * coeff_support).toFixed(2);
                        }
                        else {
                            angular.forEach(vm.productList[0].tarifManuel, function (value) {
                                if (value.lib_dim == $('.sel_dimensions').select2('data')[0].text.trim() && Number(value.qte) == qte_commander && value.id_support == idSupport) {
                                    vm.unitprix = ((value.prix_vente) / Number(value.qte)).toFixed(3);
                                    vm.prixvente = Number(value.prix_vente).toFixed(2);
                                }
                            })
                        }
                        console.log(vm.unitprix, " :: ", vm.prixvente);
                        if (flag != 1) {
                            $scope.$apply();
                        }

                    }

                    vm.loadCustomImg = function () {
                        console.log("adkj");
                        yourDesigner.addCustomImage('images/gallery/TEST/Picture2.png', ' Arvind');
                    };

                    vm.loadModalImgs = function () {
                        $('#imagesModal').modal();
                    };

                    vm.fnImagesLoad = function (ligne) {
                        vm.imagesList = ligne.data;
                        console.log(vm.imagesList, "  images list care");
                        $('#imagesListModal').modal();
                    }

                    vm.fnUploadImg = function (image) {
                        yourDesigner.addCustomImage(image.src, image.libelle);
                    }

                }, 0);
                $('body').removeClass("spinner");
            }, function errorCallback(error) {
                $('body').removeClass("spinner");
            });
        };

        $http({
            method: 'GET',
            params: {mode: 6},
            url: 'api/v1/imageInfo.php'
        }).then(function successCallback(response) {
            console.log(response.data, " liste of images");
            vm.productsDesign = response.data;
            vm.fnInit(vm.currentProd);
        }, function errorCallback(error) {
            console.log(error);
        });

        vm.fnGallery = function () {
            $http({
                method: 'GET',
                params: {mode: 0, id: localStorage.idMetier},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                //console.log(response.data);
                //vm.models = response.data;
                // console.log(vm.models);
                vm.models = [];
                vm.gabarits = [];

                vm.modelsTous = response.data;
                angular.forEach(vm.modelsTous, function (value) {
                    if (value.gabarit == 0) {
                        vm.models.push(value);
                    }
                    else {
                        vm.gabarits.push(value);
                    }
                });

                $('#galleryModal').on('show.bs.modal', function () {
                    $('.modal-body').css('height', $(window).height() * 0.75);
                });
                $('#galleryModal').modal();
                //$("#galleryModal").modal();
                console.log(vm.listMetier);
                $(".sel_metier").select2({
                    theme: "classic",
                    data: vm.listMetier.metier
                });

                $(".sel_metier").select2().val(localStorage.idMetier).trigger("change");

                $(".sel_model_metier").select2({
                    theme: "classic",
                    data: vm.listMetier.modelsmetier
                });

                $(".sel_model_metier").select2().val(localStorage.idModelMetier).trigger("change");

                /*$(".sel_metier").on("select2:select", function (e) {
                 vm.rechModels($(".sel_metier").select2().val() , $(".sel_model_metier").select2().val());
                 });*/

                $(".sel_model_metier").on("select2:select", function (e) {
                    //  vm.rechModels($(".sel_metier").select2().val() , $(".sel_model_metier").select2().val());
                    vm.rechModels($(".sel_model_metier").select2().val());
                });

            }, function errorCallback(error) {
                console.log(error);
            });
        }

        vm.rechModels = function (id_model) {
            $http({
                method: 'GET',
                params: {mode: 14, id: id_model},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                //console.log(response.data);
                // vm.models = response.data;
                vm.modelsTous = response.data;
                vm.models = [];
                vm.gabarits = [];
                angular.forEach(vm.modelsTous, function (value) {
                    if (value.gabarit == 0) {
                        vm.models.push(value);
                    }
                    else {
                        vm.gabarits.push(value);
                    }
                })

                console.log(vm.models);
            }, function errorCallback(error) {
                console.log(error);
            });
        }

        vm.fnMetierList = function () {
            $http({
                method: 'GET',
                params: {mode: 8},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                //console.log(response.data);
                //console.clear();
                console.log(response.data);
                var id_metier = localStorage.idMetier;
                console.log(id_metier, " metier ");
                vm.listMetier = response.data;

                vm.fnGallery();
            }, function errorCallback(error) {
                console.log(error);
            });
        }

        vm.fnClickTabs = function (tabVal) {
            vm.activeId = tabVal;
            vm.isShow = tabVal;
        };

        $scope.fnSignUp = function () {
            $('#myModal').modal('hide');
            $('#modalPanier').modal('hide');
            $('#signupFiche').modal();
        };

        $scope.doLogin = function (customer) {
            console.log("FICHE CONTROL");
            Data.post('loginClient.php', {
                customer: customer
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    console.log($location.path(), " lcoation path");
                    if (results.uid) {
                        if ($location.path().indexOf('fichetech') == -1) {
                            $location.path('home');
                        }

                        $scope.isLogged = true;
                        $scope.utilisateur = results.name;

                        $timeout(function () {
                            $scope.isLogged = true;
                            $scope.utilisateur = results.name;
                        }, 0);

                        console.log($scope.isLogged, " logging dunction");
                    }

                    toastr.options.positionClass = 'toast-top-right';
                    toastr.success('Bienvenue ' + results.name);

                }
                else {

                    bootbox.alert("Les parametres de connection ne correspond pas à un utilisateur.", function () {
                        $scope.loginModal();
                    })
                }
            });
        };

        vm.fnRegister = function (client) {
            Data.post('signupClient.php', {
                customer: client
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    //$location.path('home');
                    console.log("REGISTRATION SUCCESFULL : ", results);
                    $('#myModal').modal('hide');
                    $('#signupFiche').modal('hide');
                    //vm.fnValidMaquette();
                }
            });
        };

        vm.fnCheckOut = function () {
            console.clear();
            console.log($scope.sessionInfo);
            vm.fnValidMaquette();
        }

        vm.doLogin = function (login) {
            console.clear();
            console.log(login);
            console.log(vm.login);
        };

        var lang = localStorage.getItem("LANG");
        /*
         set imgs Mon panier and ajouter au panier
         */
        vm.linkMonPanier = "../assets/carts/mon_panier.png";
        vm.linkAjoutPanier = "../assets/carts/ajouter_panier.png";
        if (lang == "FR") {
            vm.linkMonPanier = "../assets/carts/mon_panier.png";
            vm.linkAjoutPanier = "../assets/carts/ajouter_panier.png";
        }
        else if (lang == "ES") {
            vm.linkMonPanier = "../assets/carts/cesta_espagnol.png";
            vm.linkAjoutPanier = "../assets/carts/cart_espagnol.png";
        }
        else if (lang == "EN") {
            vm.linkMonPanier = "../assets/carts/cart_english.png";
            vm.linkAjoutPanier = "../assets/carts/add_cart_english.png";
        }
        else if (lang == "AL") {
            vm.linkMonPanier = "../assets/carts/warenkorb_deutch.png";
            vm.linkAjoutPanier = "../assets/carts/cart_deutch.png";
        }
        else if (lang == "IT") {
            vm.linkMonPanier = "../assets/carts/carrello_italiano.png";
            vm.linkAjoutPanier = "../assets/carts/cart_italien.png";
        }
        if (lang == "" || lang == null) {
            lang = "FR";
        }
        console.log(lang, " this is the lang")

        $translate.use(localStorage.getItem('LANG'));
        $http({
            method: 'GET',
            params: {mode: 3, lang: lang},
            url: 'api/v1/langueCRUD.php'
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.langue = angular.copy(response.data);
        });
        vm.setLang = function (langKey) {
            // You can change the language during runtime
            $translate.use(langKey);
        };

        $scope.$watch('isActualLang', function (ov, nv) {
            console.log(ov, nv, " module fichier");
            vm.setLang(localStorage.getItem("LANG"));
            var lang = localStorage.getItem("LANG");

            vm.linkMonPanier = "../assets/carts/mon_panier.png";
            vm.linkAjoutPanier = "../assets/carts/ajouter_panier.png";
            if (lang == "FR") {
                vm.linkMonPanier = "../assets/carts/mon_panier.png";
                vm.linkAjoutPanier = "../assets/carts/ajouter_panier.png";
            }
            else if (lang == "ES") {
                vm.linkMonPanier = "../assets/carts/cesta_espagnol.png";
                vm.linkAjoutPanier = "../assets/carts/cart_espagnol.png";
            }
            else if (lang == "EN") {
                vm.linkMonPanier = "../assets/carts/cart_english.png";
                vm.linkAjoutPanier = "../assets/carts/add_cart_english.png";
            }
            else if (lang == "AL") {
                vm.linkMonPanier = "../assets/carts/warenkorb_deutch.png";
                vm.linkAjoutPanier = "../assets/carts/cart_deutch.png";
            }
            else if (lang == "IT") {
                vm.linkMonPanier = "../assets/carts/carrello_italiano.png";
                vm.linkAjoutPanier = "../assets/carts/cart_italien.png";
            }

        });
    });
