
angular
    .module('myApp')
    .controller('ficheController', function($scope, $location, $timeout, messages, $http, Data, $translate, $routeParams) {
        console.log('fiche controller');
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        var vm = this;
        vm.currentProd = $routeParams.idcata;
        vm.models = [];
        vm.gabarits = [];
        vm.modelsTous=[];
        vm.listMetier = [];
        vm.libMetier = [];
        vm.arrProduits = [];
        vm.activeId = 1;
        vm.isShow = 1;
        vm.produit = [{titre:"", commentaire:''}];
        vm.unitprix = 0;
        vm.prixvente = 0;
        vm.imagesList= [];
        vm.modifEnCoursProd = {};
        $('body').addClass("spinner");
        $scope.alertMsg = "";
        $scope.isFiche = true;

        vm.currentMetier = "";
        $(function () {
            $('[data-toggle="popover"]').popover()
        })

        //console.log("FACT VALUE:: ", messages.list);
        vm.arrProduits = [];
        var count = Number(sessionStorage.getItem("produitCount"));
        if(count){
            for(i=0;i<=count; i++) {
                vm.arrProduits.push(JSON.parse(sessionStorage.getItem("produit"+count)));
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
            data:[],
            "language": {
                "noResults": function(){
                    return "Pas de résutat";
                }
            }
        });

        $(".sel_dimensions").select2({
            tags: true,
            allowClear: true,
            data:[],
            "language": {
                "noResults": function(){
                    return "Pas de résutat";
                }
            }
        });
        $(".sel_qte").select2({
            tags: true,
            allowClear: true,
            data:[],
            "language": {
                "noResults": function(){
                    return "Pas de résutat";
                }
            }
        });
        $(".sel_papier").select2({
            tags: true,
            allowClear: true,
            data:[],
            "language": {
                "noResults": function(){
                    return "Pas de résutat";
                }
            }
        });

        vm.productsDesign = [];

        vm.fnInit = function(idprod) {
            $http({
                method: 'GET',
                params: {mode:9,metier: localStorage.idModelMetier, id_model:idprod},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                    vm.productList=response.data;
                    var arrDimensions = vm.productList[0].dimensions.split(',');
                    var arrQte = vm.productList[0].qte.split(',');
                    var arrDataDims = [];
                    var arrDataQte = [];
                    var arrPapier = [];

                    angular.forEach(vm.productList[0].type_support, function(value){
                       arrPapier.push({id:value.id, text:value.description});
                    });
                    angular.forEach(arrDimensions, function(value, key){
                        arrDataDims.push({id:key , text:value});
                    });
                    angular.forEach(arrQte, function(value, key){
                        arrDataQte.push({id:key , text:value});
                    });

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
                if(arrPapier.length > 0) {
                    var idSupport = $('.sel_papier').select2('data')[0].id;
                }
                var qte_commander = Number($('.sel_qte').select2('data')[0].text);
                var coeff_dimension = 0;
                var coeff_support = 0;
                var coeff_qte = 0;
                angular.forEach(vm.productList[0].coeff_dims, function(value) {
                   if(value.dimension.trim() == $('.sel_dimensions').select2('data')[0].text.trim()){
                       coeff_dimension=Number(value.coeff);
                   }
                });
                if(vm.productList[0].type_tarif > -1) {
                    angular.forEach(vm.productList[0].info_prix, function(value) {
                        if(value.id_support == idSupport && Number(value.qte) == qte_commander) {
                            coeff_support = Number(value.coeff_prix);
                            coeff_qte  = Number(value.coeff_qte);
                        }
                    });
                    vm.unitprix = ((coeff_dimension*coeff_qte*coeff_support) / qte_commander).toFixed(3);
                    vm.prixvente = (coeff_dimension*coeff_qte*coeff_support).toFixed(2);

                }
                else {
                    angular.forEach(vm.productList[0].tarifManuel, function(value) {
                        if(value.lib_dim == $('.sel_dimensions').select2('data')[0].text.trim() && Number(value.qte) == qte_commander && value.id_support == idSupport){
                            vm.unitprix = ((value.prix_vente)/Number(value.qte)).toFixed(3);
                            vm.prixvente = Number(value.prix_vente).toFixed(2);
                        }
                    })
                }
                var lang = localStorage.getItem("LANG");
                var urlLang = "";
                if(lang == 'FR') {
                    urlLang = "lang/fr.json";
                }
                else if(lang == 'ES') {
                    urlLang = "lang/es.json";
                }
                else if(lang == 'AL') {
                    urlLang = "lang/al.json";
                }
                else if(lang == 'IT') {
                    urlLang = "lang/it.json";
                }
                else if(lang == 'EN') {
                    urlLang = "lang/en.json";
                }
                //******************************************************
                    //selection produit
                    $('#aucun').prop('checked', true);
                    $('#aucunEscargot').prop('checked', true);
                    $('#cmdBonTirer').prop('checked', true);
                    $timeout(function() {
                        $("#imgScroll").endlessScroll({ width: '100%',height: '250px', steps: -2, speed: 40, mousestop: true });

                        var $yourDesigner = $('#model'),
                            pluginOpts = {
                                mainBarModules: ['images', 'text'],
                                stageWidth: 2000,
                                stageHeight:1000,
                                editorMode: true,
                                langJSON : urlLang,
                                lazyLoad:true,
                                improvedResizeQuality:true,
                                loadFirstProductInStage:true,
                                fonts: ['Arial', 'Fearless', 'Helvetica', 'Times New Roman', 'Verdana', 'Geneva', 'Gorditas','Amerika Sans'],
                                customTextParameters: {
                                    colors: true,
                                    removable: true,
                                    resizable: true,
                                    draggable: true,
                                    rotatable: true,
                                    autoCenter: true,
                                    boundingBox: "Base",
                                    curvable:true,
                                    curveReverse:true
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
                                customAdds:{
                                    uploads:true
                                },
                                customImageAjaxSettings:{
                                    data:{
                                        saveOnServer:1,
                                        uploadsDir:'../test',
                                        uploadsDirURL:"./test"
                                    },
                                    url:'api/imageUpload.php'
                                },
                                imageParameters : {
                                    availableFilters: ['grayscale', 'sepia', 'sepia2'],
                                    filter:true
                                },
                                actions:  {
                                    /*'top': ['download','print', 'snap', 'preview-lightbox'],
                                    'right': ['magnify-glass', 'zoom', 'reset-product', 'qr-code', 'ruler'],
                                    'bottom': ['undo','redo'],
                                    'left': ['manage-layers','info','save','load']*/
                                    'top':[],
                                     'right': ['zoom', 'reset-product','undo','redo']
                                }
                            },
                            yourDesigner = new FancyProductDesigner($yourDesigner, pluginOpts);

                        angular.forEach(vm.productList, function(value){
                            var arrProducts     = [];
                            var arrFront        = [];
                            var arrBack         = [];

                            angular.forEach(value.elemfront.params, function(value1){
                                var flag = false;

                                if(value1.parameters.fill != "false"){
                                    flag = value1.parameters.fill;
                                }
                                if(value1.parameters.flipX == "false"){
                                    value1.parameters.flipX = false;
                                }
                                else{
                                    value1.parameters.flipX = true;
                                }

                                if(value1.parameters.flipY == "false"){
                                    value1.parameters.flipY = false;
                                }
                                else{
                                    value1.parameters.flipY = true;
                                }
                                if(value1.parameters.autoCenter == "false"){
                                    value1.parameters.autoCenter = false;
                                }
                                else{
                                    value1.parameters.autoCenter = true;
                                }

                                if(value1.parameters.autoSelect == "false"){
                                    value1.parameters.autoSelect = false;
                                }
                                else{
                                    value1.parameters.autoSelect = true;
                                }

                                if(value1.parameters.colorLinkGroup == "false"){
                                    value1.parameters.colorLinkGroup = false;
                                }
                                else{
                                    value1.parameters.colorLinkGroup = true;
                                }

                                if(value1.parameters.copyable == "false"){
                                    value1.parameters.copyable = false;
                                }
                                else{
                                    value1.parameters.copyable = true;
                                }

                                if(value1.parameters.cornerSize == "false"){
                                    value1.parameters.cornerSize = false;
                                }
                                else if(value1.parameters.cornerSize == "true"){
                                    value1.parameters.cornerSize = true;
                                }
                                else{
                                    value1.parameters.cornerSize = parseInt(value1.parameters.cornerSize);
                                }


                                if(value1.parameters.draggable == "false"){
                                    value1.parameters.draggable = false;
                                }
                                else{
                                    value1.parameters.draggable = true;
                                }

                                if(value1.parameters.evented == "false"){
                                    value1.parameters.evented = false;
                                }
                                else{
                                    value1.parameters.evented = true;
                                }

                                if(value1.parameters.filter == "false"){
                                    value1.parameters.filter = false;
                                }
                                else{
                                    value1.parameters.filter = true;
                                }

                                if(value1.parameters.isCustom == "false"){
                                    value1.parameters.isCustom = false;
                                }
                                else{
                                    value1.parameters.isCustom = true;
                                }

                                if(value1.parameters.isEditable == "false"){
                                    value1.parameters.isEditable = false;
                                }
                                else{
                                    value1.parameters.isEditable = true;
                                }

                                if(value1.parameters.lockUniScaling == "false"){
                                    value1.parameters.lockUniScaling = false;
                                }
                                else{
                                    value1.parameters.lockUniScaling = true;
                                }

                                if(value1.parameters.removable == "false"){
                                    value1.parameters.removable = false;
                                }
                                else{
                                    value1.parameters.removable = true;
                                }

                                if(value1.parameters.replaceInAllViews == "false"){
                                    value1.parameters.replaceInAllViews = false;
                                }
                                else{
                                    value1.parameters.replaceInAllViews = true;
                                }

                                if(value1.parameters.resizable == "false"){
                                    value1.parameters.resizable = false;
                                }
                                else{
                                    value1.parameters.resizable = true;
                                }

                                if(value1.parameters.rotatable == "false"){
                                    value1.parameters.rotatable = false;
                                }
                                else{
                                    value1.parameters.rotatable = true;
                                }

                                if(value1.parameters.topped == "false"){
                                    value1.parameters.topped = false;
                                }
                                else{
                                    value1.parameters.topped = true;
                                }

                                if(value1.parameters.uniScalingUnlockable == "false"){
                                    value1.parameters.uniScalingUnlockable = false;
                                }
                                else{
                                    value1.parameters.uniScalingUnlockable = true;
                                }

                                if(value1.parameters.uploadZone == "false"){
                                    value1.parameters.uploadZone = false;
                                }
                                else{
                                    value1.parameters.uploadZone = true;
                                }

                                if(value1.parameters.zChangeable == "false"){
                                    value1.parameters.zChangeable = false;
                                }

                                else{
                                    value1.parameters.zChangeable = true;
                                }

                                if(value1.parameters.curvable == "false"){
                                    value1.parameters.curvable = false;
                                }
                                else{
                                    value1.parameters.curvable = true;
                                }

                                if(value1.parameters.curved == "false"){
                                    value1.parameters.curved = false;
                                }
                                else{
                                    value1.parameters.curved = true;
                                }
                                if(value1.parameters.curveReverse == "false"){
                                    value1.parameters.curveReverse = false;
                                }
                                else if(value1.parameters.curveReverse == "true"){
                                    value1.parameters.curveReverse = true;
                                }

                                if(value1.parameters.curveRadius == "false"){
                                    value1.parameters.curveRadius = false;
                                }
                                else if(value1.parameters.curveRadius == "true"){
                                    value1.parameters.curveRadius = true;
                                }

                                if(value1.parameters.editable == "false"){
                                    value1.parameters.editable = false;
                                }
                                else{
                                    value1.parameters.editable = true;
                                }

                                if(value1.parameters.colors == "false"){
                                    value1.parameters.colors = false;
                                }
                                else if(value1.parameters.colors == "true"){
                                    value1.parameters.colors = true;
                                }

                                if(value1.parameters.numberPlaceholder == "false"){
                                    value1.parameters.numberPlaceholder = false;
                                }
                                else if(value1.parameters.numberPlaceholder == "true"){
                                    value1.parameters.numberPlaceholder = true;
                                }

                                if(value1.parameters.textBox == "false"){
                                    value1.parameters.textBox = false;
                                }
                                else if(value1.parameters.textBox == "true"){
                                    value1.parameters.textBox = true;
                                }

                                if(value1.type == 'image'){
                                    arrFront.push({source:value1.source, title:value1.title, type:value1.type,parameters:{
                                        "left"  :   parseFloat(value1.parameters.left),
                                        "top"   :   parseFloat(value1.parameters.top),
                                        "fill"  :   flag,
                                        "angle" :   parseInt(value1.parameters.angle),
                                        "autoCenter":value1.parameters.autoCenter,
                                        "autoSelect":value1.parameters.autoSelect,
                                        "boundingBox":value1.parameters.boundingBox,
                                        "boundingBoxMode":value1.parameters.boundingBoxMode,
                                        "colorLinkGroup":value1.parameters.colorLinkGroup,
                                        "cornerSize":value1.parameters.cornerSize,
                                        "copyable":value1.parameters.copyable,
                                        "curvable":value1.parameters.curvable,
                                        "curveRadius":value1.parameters.curveRadius,
                                        "curveReverse":value1.parameters.curveReverse,
                                        "curved":value1.parameters.curved,
                                        "colors":value1.parameters.colors,
                                        "availableFilters":new Array("grayscale", "sepia", "sepia2"),
                                        "draggable":value1.parameters.draggable,
                                        "editable":value1.parameters.editable,
                                        "evented":value1.parameters.evented,
                                        "filter":value1.parameters.filter,
                                        "flipX":value1.parameters.flipX,
                                        "flipY":value1.parameters.flipY,
                                        "height":parseInt(value1.parameters.height),
                                        "isCustom":value1.parameters.isCustom,
                                        "isEditable":value1.parameters.isEditable,
                                        "lockUniScaling":value1.parameters.lockUniScaling,
                                        "opacity":parseInt(value1.parameters.opacity),
                                        "originX":value1.parameters.originX,
                                        "originY":value1.parameters.originY,
                                        "padding":parseInt(value1.parameters.padding),
                                        "removable":value1.parameters.removable,
                                        "replace":value1.parameters.replace,
                                        "replaceInAllViews":value1.parameters.replaceInAllViews,
                                        "resizable":value1.parameters.resizable,
                                        "rotatable":value1.parameters.rotatable,
                                        "scaleX":parseFloat(value1.parameters.scaleX),
                                        "scaleY":parseFloat(value1.parameters.scaleY),
                                        "toppped":value1.parameters.topped,
                                        "uniScalingUnlockable":value1.parameters.uniScalingUnlockable,
                                        "uploadZone":value1.parameters.uploadZone,
                                        "width":parseFloat(value1.parameters.width),
                                        "uploadZoneScaleMode":value1.parameters.uploadZoneScaleMode,
                                        "z":value1.parameters.z,
                                        "zChangeable":value1.parameters.zChangeable
                                    }})
                                }
                                else if(value1.type == 'text'){
                                    arrFront.push({source:value1.source, title:value1.title, type:value1.type,parameters:{
                                        "left"  :   parseInt(value1.parameters.left),
                                        "top"   :   parseInt(value1.parameters.top),
                                        "fill"  :   flag,
                                        "angle" :   parseInt(value1.parameters.angle),
                                        "autoCenter":value1.parameters.autoCenter,
                                        "autoSelect":value1.parameters.autoSelect,
                                        "boundingBox":value1.parameters.boundingBox,
                                        "boundingBoxMode":value1.parameters.boundingBoxMode,
                                        "colorLinkGroup":value1.parameters.colorLinkGroup,
                                        "cornerSize":value1.parameters.cornerSize,
                                        "curvable":value1.parameters.curvable,
                                        "colors":value1.parameters.colors,
                                        "curveRadius":value1.parameters.curveRadius,
                                        "curveReverse":value1.parameters.curveReverse,
                                        "curveSpacing":parseInt(value1.parameters.curveSpacing),
                                        "curved":value1.parameters.curved,
                                        "copyable":value1.parameters.copyable,
                                        "draggable":value1.parameters.draggable,
                                        "editable":value1.parameters.editable,
                                        "evented":value1.parameters.evented,
                                        "flipX":value1.parameters.flipX,
                                        "flipY":value1.parameters.flipY,
                                        "fontFamily":value1.parameters.fontFamily,
                                        "fontSize":parseInt(value1.parameters.fontSize),
                                        "fontStyle":value1.parameters.fontStyle,
                                        "fontWeight":value1.parameters.fontWeight,
                                        "height":parseFloat(value1.parameters.height),
                                        "isCustom":value1.parameters.isCustom,
                                        "isEditable":value1.parameters.isEditable,
                                        "lineHeight":parseInt(value1.parameters.lineHeight),
                                        "lockUniScaling":value1.parameters.lockUniScaling,
                                        "maxLength":parseInt(value1.parameters.maxLength),
                                        "maxLines":parseInt(value1.parameters.maxLines),
                                        "numberPlaceholder":value1.parameters.numberPlaceholder,
                                        "opacity":parseInt(value1.parameters.opacity),
                                        "originX":value1.parameters.originX,
                                        "originY":value1.parameters.originY,
                                        "padding":parseInt(value1.parameters.padding),
                                        "removable":value1.parameters.removable,
                                        "replace":value1.parameters.replace,
                                        "replaceInAllViews":value1.parameters.replaceInAllViews,
                                        "resizable":value1.parameters.resizable,
                                        "rotatable":value1.parameters.rotatable,
                                        "scaleX":parseFloat(value1.parameters.scaleX),
                                        "scaleY":parseFloat(value1.parameters.scaleY),
                                        "stroke":value1.parameters.stroke,
                                        "strokeWidth":parseInt(value1.parameters.strokeWidth),
                                        "text":value1.parameters.text,
                                        "textAlign":value1.parameters.textAlign,
                                        "textBox":(value1.parameters.textBox),
                                        "textDecoration":value1.parameters.textDecoration,
                                        "toppped":value1.parameters.topped,
                                        "uniScalingUnlockable" : value1.parameters.uniScalingUnlockable,
                                        "uploadZone": value1.parameters.uploadZone,
                                        "width":parseFloat(value1.parameters.width),
                                        "z":parseInt(value1.parameters.z),
                                        "zChangeable":value1.parameters.zChangeable
                                    }})
                                }
                            });

                            angular.forEach(value.elemback.params, function(value1){
                                var flag = false;
                                if(value1.parameters.fill != "false"){
                                    flag = value1.parameters.fill;
                                }
                                if(value1.parameters.flipX == "false"){
                                    value1.parameters.flipX = false;
                                }
                                else{
                                    value1.parameters.flipX = true;
                                }

                                if(value1.parameters.flipY == "false"){
                                    value1.parameters.flipY = false;
                                }
                                else{
                                    value1.parameters.flipY = true;
                                }
                                if(value1.parameters.autoCenter == "false"){
                                    value1.parameters.autoCenter = false;
                                }
                                else{
                                    value1.parameters.autoCenter = true;
                                }

                                if(value1.parameters.autoSelect == "false"){
                                    value1.parameters.autoSelect = false;
                                }
                                else{
                                    value1.parameters.autoSelect = true;
                                }

                                if(value1.parameters.colorLinkGroup == "false"){
                                    value1.parameters.colorLinkGroup = false;
                                }
                                else{
                                    value1.parameters.colorLinkGroup = true;
                                }

                                if(value1.parameters.copyable == "false"){
                                    value1.parameters.copyable = false;
                                }
                                else{
                                    value1.parameters.copyable = true;
                                }

                                if(value1.parameters.cornerSize == "false"){
                                    value1.parameters.cornerSize = false;
                                }
                                else if(value1.parameters.cornerSize == "true"){
                                    value1.parameters.cornerSize = true;
                                }

                                else{
                                    value1.parameters.cornerSize = parseInt(value1.parameters.cornerSize);
                                }


                                if(value1.parameters.draggable == "false"){
                                    value1.parameters.draggable = false;
                                }
                                else{
                                    value1.parameters.draggable = true;
                                }

                                if(value1.parameters.evented == "false"){
                                    value1.parameters.evented = false;
                                }
                                else{
                                    value1.parameters.evented = true;
                                }

                                if(value1.parameters.filter == "false"){
                                    value1.parameters.filter = false;
                                }
                                else{
                                    value1.parameters.filter = true;
                                }

                                if(value1.parameters.isCustom == "false"){
                                    value1.parameters.isCustom = false;
                                }
                                else{
                                    value1.parameters.isCustom = true;
                                }

                                if(value1.parameters.isEditable == "false"){
                                    value1.parameters.isEditable = false;
                                }
                                else{
                                    value1.parameters.isEditable = true;
                                }

                                if(value1.parameters.lockUniScaling == "false"){
                                    value1.parameters.lockUniScaling = false;
                                }
                                else{
                                    value1.parameters.lockUniScaling = true;
                                }

                                if(value1.parameters.removable == "false"){
                                    value1.parameters.removable = false;
                                }
                                else{
                                    value1.parameters.removable = true;
                                }

                                if(value1.parameters.replaceInAllViews == "false"){
                                    value1.parameters.replaceInAllViews = false;
                                }
                                else{
                                    value1.parameters.replaceInAllViews = true;
                                }

                                if(value1.parameters.resizable == "false"){
                                    value1.parameters.resizable = false;
                                }
                                else{
                                    value1.parameters.resizable = true;
                                }

                                if(value1.parameters.rotatable == "false"){
                                    value1.parameters.rotatable = false;
                                }
                                else{
                                    value1.parameters.rotatable = true;
                                }

                                if(value1.parameters.topped == "false"){
                                    value1.parameters.topped = false;
                                }
                                else{
                                    value1.parameters.topped = true;
                                }

                                if(value1.parameters.uniScalingUnlockable == "false"){
                                    value1.parameters.uniScalingUnlockable = false;
                                }
                                else{
                                    value1.parameters.uniScalingUnlockable = true;
                                }

                                if(value1.parameters.uploadZone == "false"){
                                    value1.parameters.uploadZone = false;
                                }
                                else{
                                    value1.parameters.uploadZone = true;
                                }

                                if(value1.parameters.zChangeable == "false"){
                                    value1.parameters.zChangeable = false;
                                }

                                else{
                                    value1.parameters.zChangeable = true;
                                }

                                if(value1.parameters.curvable == "false"){
                                    value1.parameters.curvable = false;
                                }
                                else{
                                    value1.parameters.curvable = true;
                                }

                                if(value1.parameters.curved == "false"){
                                    value1.parameters.curved = false;
                                }
                                else{
                                    value1.parameters.curved = true;
                                }

                                if(value1.parameters.curveRadius == "false"){
                                    value1.parameters.curveRadius = false;
                                }
                                else if(value1.parameters.curveRadius == "true"){
                                    value1.parameters.curveRadius = true;
                                }
                                if(value1.parameters.curveReverse == "false"){
                                    value1.parameters.curveReverse = false;
                                }
                                else{
                                    value1.parameters.curveReverse = true;
                                }
                                if(value1.parameters.editable == "false"){
                                    value1.parameters.editable = false;
                                }
                                else{
                                    value1.parameters.editable = true;
                                }
                                if(value1.parameters.colors == "false"){
                                    value1.parameters.colors = false;
                                }
                                else if(value1.parameters.colors == "true"){
                                    value1.parameters.colors = true;
                                }

                                if(value1.type == 'image'){
                                    arrBack.push({source:value1.source, title:value1.title, type:value1.type,parameters:{
                                        "left"  :   parseFloat(value1.parameters.left),
                                        "top"   :   parseFloat(value1.parameters.top),
                                        "fill"  :   flag,
                                        "angle" :   parseInt(value1.parameters.angle),
                                        "autoCenter":value1.parameters.autoCenter,
                                        "autoSelect":value1.parameters.autoSelect,
                                        "boundingBox":value1.parameters.boundingBox,
                                        "boundingBoxMode":value1.parameters.boundingBoxMode,
                                        "colorLinkGroup":value1.parameters.colorLinkGroup,
                                        "cornerSize":value1.parameters.cornerSize,
                                        "copyable":value1.parameters.copyable,
                                        "colors":value1.parameters.colors,
                                        "availableFilters":new Array("grayscale", "sepia", "sepia2"),
                                        "draggable":value1.parameters.draggable,
                                        "evented":value1.parameters.evented,
                                        "filter":value1.parameters.filter,
                                        "flipX":value1.parameters.flipX,
                                        "flipY":value1.parameters.flipY,
                                        "height":parseInt(value1.parameters.height),
                                        "isCustom":value1.parameters.isCustom,
                                        "isEditable":value1.parameters.isEditable,
                                        "lockUniScaling":value1.parameters.lockUniScaling,
                                        "opacity":parseInt(value1.parameters.opacity),
                                        "originX":value1.parameters.originX,
                                        "originY":value1.parameters.originY,
                                        "padding":parseInt(value1.parameters.padding),
                                        "removable":value1.parameters.removable,
                                        "replace":value1.parameters.replace,
                                        "replaceInAllViews":value1.parameters.replaceInAllViews,
                                        "resizable":value1.parameters.resizable,
                                        "rotatable":value1.parameters.rotatable,
                                        "scaleX":parseFloat(value1.parameters.scaleX),
                                        "scaleY":parseFloat(value1.parameters.scaleY),
                                        "toppped":value1.parameters.topped,
                                        "uniScalingUnlockable":value1.parameters.uniScalingUnlockable,
                                        "uploadZone":value1.parameters.uploadZone,
                                        "width":parseFloat(value1.parameters.width),
                                        "uploadZoneScaleMode":value1.parameters.uploadZoneScaleMode,
                                        "z":value1.parameters.z,
                                        "zChangeable":value1.parameters.zChangeable
                                    }})
                                }
                                else if(value1.type == 'text'){
                                    arrBack.push({source:value1.source, title:value1.title, type:value1.type,parameters:{
                                        "left"  :   parseInt(value1.parameters.left),
                                        "top"   :   parseInt(value1.parameters.top),
                                        "fill"  :   flag,
                                        "angle" :   parseInt(value1.parameters.angle),
                                        "autoCenter":value1.parameters.autoCenter,
                                        "autoSelect":value1.parameters.autoSelect,
                                        "boundingBox":value1.parameters.boundingBox,
                                        "boundingBoxMode":value1.parameters.boundingBoxMode,
                                        "colorLinkGroup":value1.parameters.colorLinkGroup,
                                        "cornerSize":value1.parameters.cornerSize,
                                        "curvable":value1.parameters.curvable,
                                        "colors":value1.parameters.colors,
                                        "curveRadius":value1.parameters.curveRadius,
                                        "curveReverse":value1.parameters.curveReverse,
                                        "curveSpacing":parseInt(value1.parameters.curveSpacing),
                                        "curved":value1.parameters.curved,
                                        "copyable":value1.parameters.copyable,
                                        "draggable":value1.parameters.draggable,
                                        "editable":value1.parameters.editable,
                                        "evented":value1.parameters.evented,
                                        "flipX":value1.parameters.flipX,
                                        "flipY":value1.parameters.flipY,
                                        "fontFamily":value1.parameters.fontFamily,
                                        "fontSize":parseInt(value1.parameters.fontSize),
                                        "fontStyle":value1.parameters.fontStyle,
                                        "fontWeight":value1.parameters.fontWeight,
                                        "height":parseFloat(value1.parameters.height),
                                        "isCustom":value1.parameters.isCustom,
                                        "isEditable":value1.parameters.isEditable,
                                        "lineHeight":parseInt(value1.parameters.lineHeight),
                                        "lockUniScaling":value1.parameters.lockUniScaling,
                                        "maxLength":parseInt(value1.parameters.maxLength),
                                        "maxLines":parseInt(value1.parameters.maxLines),
                                        "opacity":parseInt(value1.parameters.opacity),
                                        "originX":value1.parameters.originX,
                                        "originY":value1.parameters.originY,
                                        "padding":parseInt(value1.parameters.padding),
                                        "removable":value1.parameters.removable,
                                        "replace":value1.parameters.replace,
                                        "replaceInAllViews":value1.parameters.replaceInAllViews,
                                        "resizable":value1.parameters.resizable,
                                        "rotatable":value1.parameters.rotatable,
                                        "scaleX":parseFloat(value1.parameters.scaleX),
                                        "scaleY":parseFloat(value1.parameters.scaleY),
                                        "stroke":value1.parameters.stroke,
                                        "strokeWidth":parseInt(value1.parameters.strokeWidth),
                                        "text":value1.parameters.text,
                                        "textAlign":value1.parameters.textAlign,
                                        "textBox":parseInt(value1.parameters.textBox),
                                        "textDecoration":value1.parameters.textDecoration,
                                        "toppped":value1.parameters.topped,
                                        "width":parseFloat(value1.parameters.width),
                                        "z":parseInt(value1.parameters.z),
                                        "zChangeable":value1.parameters.zChangeable
                                    }})
                                }
                            })

                            arrProducts.push({title:'Recto', thumbnail:'images/gallery/simple1.jpg', elements:arrFront});
                            arrProducts.push({title:'Recto Verso', thumbnail:'images/gallery/simple2.jpg', elements:arrBack});
                            yourDesigner.addProduct(arrProducts);
                        });

                        //print button
                        $('#print-button').click(function(){
                           // yourDesigner.print();
                            yourDesigner.addCustomImage('images/gallery/TEST/Picture2.png', ' Arvind');
                            return false;
                        });

                        //create an image
                        $('#image-button').click(function(){
                            var image = yourDesigner.createImage();
                            console.log(image);
                            return false;
                        });



                        //checkout button with getProduct()
                        $('#checkout-button').click(function(){
                            var product = yourDesigner.getProduct();
                            console.log(product);
                            return;
                            $http({
                                method: 'GET',
                                params: {mode:2, data:product},
                                url: 'api/v1/sampleControl.php'
                            }).then(function successCallback(response) {
                                    console.log(response.data, "  ::data");
                                }, function errorCallback(error) {
                                    console.log(error);
                                });
                            return false;
                        });

                        //event handler when the price is changing
                        $yourDesigner.on('priceChange', function(evt, price, currentPrice) {
                            $('#thsirt-price').text(currentPrice);
                        });

                        $yourDesigner.on('ready', function(evt, price, currentPrice) {

                        });

                        //save image on webserver
                        $('#save-image-php').click(function() {

                            yourDesigner.getProductDataURL(function(dataURL) {
                                $.post( "php/save_image.php", { base64_image: dataURL} );
                            });

                        });

                        //send image via mail
                        $('#send-image-mail-php').click(function() {

                            yourDesigner.getProductDataURL(function(dataURL) {
                                $.post( "php/send_image_via_mail.php", { base64_image: dataURL} );
                            });

                        });
                        vm.fnNouveau = function() {
                            console.log("NOUVEAU");
                            $http({
                                method: 'GET',
                                params: {mode:1, type:0},
                                url: 'api/v1/sampleControl.php'
                            }).then(function successCallback(response) {
                                    console.log(response);
                                }, function errorCallback(error) {
                                    console.log(error);
                                });
                        };

                        vm.fnOpenModal = function(){
                            $scope.product = yourDesigner.getProduct();
                            console.log($scope.product);
                            $('#myModel').modal();
                        }

                        vm.fnQuitter  = function(){
                            console.log("annuler");
                            $('#myModel').modal('hide');
                        };

                        vm.fnValider = function(){

                            yourDesigner.getProductDataURL(function(dataURL) {
                                console.log("LIBELLE:: ", vm.libelle);
                                console.log("DEscription:: ", vm.description);
                                console.log("Reference:: ", vm.reference);
                                console.log("selected: ", $(".selObj").select2().val());
                                console.log("valider", yourDesigner.getProduct());

                                if(vm.libelle == '' || vm.description=='' || $(".selObj").select2().val() == '' || $(".selObj").select2().val() == null){
                                    bootbox.alert("Toutes les informations sont obligatoire");
                                    return;
                                }

                                $.post( "api/save_image.php", { base64_image: dataURL, ref:vm.reference, libelle:vm.libelle, description:vm.description, metiers:$(".selObj").select2().val(), data:yourDesigner.getProduct()});

                            });
                            $('#myModel').modal('hide');

                        }

                        vm.fnSauvegarde = function() {
                            var product = yourDesigner.getProduct();
                            console.log("SAUVEGARDE");
                            $http({
                                method: 'GET',
                                params: {mode:2, data:product},
                                url: 'api/v1/sampleControl.php'
                            }).then(function successCallback(response) {
                                    console.log(response.data, "  ::data");
                                }, function errorCallback(error) {
                                    console.log(error);
                                });
                            console.log(product);
                            console.log("*******************");
                        }

                        vm.fnImage = function() {
                            yourDesigner.getProductDataURL(function(dataURL) {
                                $.post( "api/save_image.php", { base64_image: dataURL} ).success(function(data) {
                                    // console.log(data);
                                    console.log("TESTING ISSUE ");
                                })
                            });
                        }

                        vm.fnModelClick = function(id, id_model_metier) {
                            console.log("***********************************");
                            console.log(id, id_model_metier);
                            console.log("************************************");

                            $http({
                                method: 'GET',
                                params: {mode:5, id:id},
                                url: 'api/v1/sampleControl.php'
                            }).then(function successCallback(response) {

                                    var data = angular.copy(response.data);
                                    vm.productList  = data;
                                    var arrDimensions = vm.productList[0].dimensions.split(',');
                                    var arrQte = vm.productList[0].qte.split(',');
                                    var arrDataDims = [];
                                    var arrDataQte = [];
                                    angular.forEach(arrDimensions, function(value, key){
                                        arrDataDims.push({id:key , text:value});
                                    });
                                    angular.forEach(arrQte, function(value, key){
                                        arrDataQte.push({id:key , text:value});
                                    });

                                    // clear all option
                                    $('.sel_dimensions').html('').select2({data: [{id: '', text: ''}]});

                                    // clear and add new option
                                    $(".sel_dimensions").html('').select2({data: arrDataDims});
                                    console.log(arrDimensions , "  array of dimensions");

                                    $('.sel_qte').html('').select2({data: [{id: '', text: ''}]});

                                    // clear and add new option
                                    $(".sel_qte").html('').select2({data: arrDataQte});
                                    //selection produit
                                    $('#aucun').prop('checked', true);
                                    $('#aucunEscargot').prop('checked', true);
                                    $('#cmdBonTirer').prop('checked', true);
                                    //vm.fnCalcPrixVente(1);
                                    angular.forEach(response.data, function(value) {
                                        var arrProducts = [];
                                        var arrFront = [];
                                        var arrBack = [];

                                        angular.forEach(value.elemfront.params, function(value1){
                                            var flag = false;


                                            if(value1.parameters.fill != "false"){
                                                flag = value1.parameters.fill;
                                            }
                                            if(value1.parameters.flipX == "false"){
                                                value1.parameters.flipX = false;
                                            }
                                            else{
                                                value1.parameters.flipX = true;
                                            }

                                            if(value1.parameters.flipY == "false"){
                                                value1.parameters.flipY = false;
                                            }
                                            else{
                                                value1.parameters.flipY = true;
                                            }
                                            if(value1.parameters.autoCenter == "false"){
                                                value1.parameters.autoCenter = false;
                                            }
                                            else{
                                                value1.parameters.autoCenter = true;
                                            }

                                            if(value1.parameters.autoSelect == "false"){
                                                value1.parameters.autoSelect = false;
                                            }
                                            else{
                                                value1.parameters.autoSelect = true;
                                            }

                                            if(value1.parameters.colorLinkGroup == "false"){
                                                value1.parameters.colorLinkGroup = false;
                                            }
                                            else{
                                                value1.parameters.colorLinkGroup = true;
                                            }

                                            if(value1.parameters.copyable == "false"){
                                                value1.parameters.copyable = false;
                                            }
                                            else{
                                                value1.parameters.copyable = true;
                                            }

                                            if(value1.parameters.cornerSize == "false"){
                                                value1.parameters.cornerSize = false;
                                            }
                                            else if(value1.parameters.cornerSize == "true"){
                                                value1.parameters.cornerSize = true;
                                            }
                                            else{
                                                value1.parameters.cornerSize = parseInt(value1.parameters.cornerSize);
                                            }


                                            if(value1.parameters.draggable == "false"){
                                                value1.parameters.draggable = false;
                                            }
                                            else{
                                                value1.parameters.draggable = true;
                                            }

                                            if(value1.parameters.evented == "false"){
                                                value1.parameters.evented = false;
                                            }
                                            else{
                                                value1.parameters.evented = true;
                                            }

                                            if(value1.parameters.filter == "false"){
                                                value1.parameters.filter = false;
                                            }
                                            else{
                                                value1.parameters.filter = true;
                                            }

                                            if(value1.parameters.isCustom == "false"){
                                                value1.parameters.isCustom = false;
                                            }
                                            else{
                                                value1.parameters.isCustom = true;
                                            }

                                            if(value1.parameters.isEditable == "false"){
                                                value1.parameters.isEditable = false;
                                            }
                                            else{
                                                value1.parameters.isEditable = true;
                                            }

                                            if(value1.parameters.lockUniScaling == "false"){
                                                value1.parameters.lockUniScaling = false;
                                            }
                                            else{
                                                value1.parameters.lockUniScaling = true;
                                            }

                                            if(value1.parameters.removable == "false"){
                                                value1.parameters.removable = false;
                                            }
                                            else{
                                                value1.parameters.removable = true;
                                            }

                                            if(value1.parameters.replaceInAllViews == "false"){
                                                value1.parameters.replaceInAllViews = false;
                                            }
                                            else{
                                                value1.parameters.replaceInAllViews = true;
                                            }

                                            if(value1.parameters.resizable == "false"){
                                                value1.parameters.resizable = false;
                                            }
                                            else{
                                                value1.parameters.resizable = true;
                                            }

                                            if(value1.parameters.rotatable == "false"){
                                                value1.parameters.rotatable = false;
                                            }
                                            else{
                                                value1.parameters.rotatable = true;
                                            }

                                            if(value1.parameters.topped == "false"){
                                                value1.parameters.topped = false;
                                            }
                                            else{
                                                value1.parameters.topped = true;
                                            }

                                            if(value1.parameters.uniScalingUnlockable == "false"){
                                                value1.parameters.uniScalingUnlockable = false;
                                            }
                                            else{
                                                value1.parameters.uniScalingUnlockable = true;
                                            }

                                            if(value1.parameters.uploadZone == "false"){
                                                value1.parameters.uploadZone = false;
                                            }
                                            else{
                                                value1.parameters.uploadZone = true;
                                            }

                                            if(value1.parameters.zChangeable == "false"){
                                                value1.parameters.zChangeable = false;
                                            }

                                            else{
                                                value1.parameters.zChangeable = true;
                                            }

                                            if(value1.parameters.curvable == "false"){
                                                value1.parameters.curvable = false;
                                            }
                                            else{
                                                value1.parameters.curvable = true;
                                            }

                                            if(value1.parameters.curved == "false"){
                                                value1.parameters.curved = false;
                                            }
                                            else{
                                                value1.parameters.curved = true;
                                            }
                                            if(value1.parameters.curveReverse == "false"){
                                                value1.parameters.curveReverse = false;
                                            }
                                            else if(value1.parameters.curveReverse == "true"){
                                                value1.parameters.curveReverse = true;
                                            }

                                            if(value1.parameters.curveRadius == "false"){
                                                value1.parameters.curveRadius = false;
                                            }
                                            else if(value1.parameters.curveRadius == "true"){
                                                value1.parameters.curveRadius = true;
                                            }

                                            if(value1.parameters.editable == "false"){
                                                value1.parameters.editable = false;
                                            }
                                            else{
                                                value1.parameters.editable = true;
                                            }

                                            if(value1.parameters.colors == "false"){
                                                value1.parameters.colors = false;
                                            }
                                            else if(value1.parameters.colors == "true"){
                                                value1.parameters.colors = true;
                                            }

                                            if(value1.parameters.numberPlaceholder == "false"){
                                                value1.parameters.numberPlaceholder = false;
                                            }
                                            else if(value1.parameters.numberPlaceholder == "true"){
                                                value1.parameters.numberPlaceholder = true;
                                            }

                                            if(value1.parameters.textBox == "false"){
                                                value1.parameters.textBox = false;
                                            }
                                            else if(value1.parameters.textBox == "true"){
                                                value1.parameters.textBox = true;
                                            }

                                            if(value1.type == 'image'){
                                                arrFront.push({source:value1.source, title:value1.title, type:value1.type,parameters:{
                                                    "left"  :   parseFloat(value1.parameters.left),
                                                    "top"   :   parseFloat(value1.parameters.top),
                                                    "fill"  :   flag,
                                                    "angle" :   parseInt(value1.parameters.angle),
                                                    "autoCenter":value1.parameters.autoCenter,
                                                    "autoSelect":value1.parameters.autoSelect,
                                                    "boundingBox":value1.parameters.boundingBox,
                                                    "boundingBoxMode":value1.parameters.boundingBoxMode,
                                                    "colorLinkGroup":value1.parameters.colorLinkGroup,
                                                    "cornerSize":value1.parameters.cornerSize,
                                                    "copyable":value1.parameters.copyable,
                                                    "curvable":value1.parameters.curvable,
                                                    "curveRadius":value1.parameters.curveRadius,
                                                    "curveReverse":value1.parameters.curveReverse,
                                                    "curved":value1.parameters.curved,
                                                    "colors":value1.parameters.colors,
                                                    "availableFilters":new Array("grayscale", "sepia", "sepia2"),
                                                    "draggable":value1.parameters.draggable,
                                                    "editable":value1.parameters.editable,
                                                    "evented":value1.parameters.evented,
                                                    "filter":value1.parameters.filter,
                                                    "flipX":value1.parameters.flipX,
                                                    "flipY":value1.parameters.flipY,
                                                    "height":parseInt(value1.parameters.height),
                                                    "isCustom":value1.parameters.isCustom,
                                                    "isEditable":value1.parameters.isEditable,
                                                    "lockUniScaling":value1.parameters.lockUniScaling,
                                                    "opacity":parseInt(value1.parameters.opacity),
                                                    "originX":value1.parameters.originX,
                                                    "originY":value1.parameters.originY,
                                                    "padding":parseInt(value1.parameters.padding),
                                                    "removable":value1.parameters.removable,
                                                    "replace":value1.parameters.replace,
                                                    "replaceInAllViews":value1.parameters.replaceInAllViews,
                                                    "resizable":value1.parameters.resizable,
                                                    "rotatable":value1.parameters.rotatable,
                                                    "scaleX":parseFloat(value1.parameters.scaleX),
                                                    "scaleY":parseFloat(value1.parameters.scaleY),
                                                    "toppped":value1.parameters.topped,
                                                    "uniScalingUnlockable":value1.parameters.uniScalingUnlockable,
                                                    "uploadZone":value1.parameters.uploadZone,
                                                    "width":parseFloat(value1.parameters.width),
                                                    "uploadZoneScaleMode":value1.parameters.uploadZoneScaleMode,
                                                    "z":value1.parameters.z,
                                                    "zChangeable":value1.parameters.zChangeable
                                                }})
                                            }
                                            else if(value1.type == 'text'){
                                                arrFront.push({source:value1.source, title:value1.title, type:value1.type,parameters:{
                                                    "left"  :   parseInt(value1.parameters.left),
                                                    "top"   :   parseInt(value1.parameters.top),
                                                    "fill"  :   flag,
                                                    "angle" :   parseInt(value1.parameters.angle),
                                                    "autoCenter":value1.parameters.autoCenter,
                                                    "autoSelect":value1.parameters.autoSelect,
                                                    "boundingBox":value1.parameters.boundingBox,
                                                    "boundingBoxMode":value1.parameters.boundingBoxMode,
                                                    "colorLinkGroup":value1.parameters.colorLinkGroup,
                                                    "cornerSize":value1.parameters.cornerSize,
                                                    "curvable":value1.parameters.curvable,
                                                    "colors":value1.parameters.colors,
                                                    "curveRadius":value1.parameters.curveRadius,
                                                    "curveReverse":value1.parameters.curveReverse,
                                                    "curveSpacing":parseInt(value1.parameters.curveSpacing),
                                                    "curved":value1.parameters.curved,
                                                    "copyable":value1.parameters.copyable,
                                                    "draggable":value1.parameters.draggable,
                                                    "editable":value1.parameters.editable,
                                                    "evented":value1.parameters.evented,
                                                    "flipX":value1.parameters.flipX,
                                                    "flipY":value1.parameters.flipY,
                                                    "fontFamily":value1.parameters.fontFamily,
                                                    "fontSize":parseInt(value1.parameters.fontSize),
                                                    "fontStyle":value1.parameters.fontStyle,
                                                    "fontWeight":value1.parameters.fontWeight,
                                                    "height":parseFloat(value1.parameters.height),
                                                    "isCustom":value1.parameters.isCustom,
                                                    "isEditable":value1.parameters.isEditable,
                                                    "lineHeight":parseInt(value1.parameters.lineHeight),
                                                    "lockUniScaling":value1.parameters.lockUniScaling,
                                                    "maxLength":parseInt(value1.parameters.maxLength),
                                                    "maxLines":parseInt(value1.parameters.maxLines),
                                                    "numberPlaceholder":value1.parameters.numberPlaceholder,
                                                    "opacity":parseInt(value1.parameters.opacity),
                                                    "originX":value1.parameters.originX,
                                                    "originY":value1.parameters.originY,
                                                    "padding":parseInt(value1.parameters.padding),
                                                    "removable":value1.parameters.removable,
                                                    "replace":value1.parameters.replace,
                                                    "replaceInAllViews":value1.parameters.replaceInAllViews,
                                                    "resizable":value1.parameters.resizable,
                                                    "rotatable":value1.parameters.rotatable,
                                                    "scaleX":parseFloat(value1.parameters.scaleX),
                                                    "scaleY":parseFloat(value1.parameters.scaleY),
                                                    "stroke":value1.parameters.stroke,
                                                    "strokeWidth":parseInt(value1.parameters.strokeWidth),
                                                    "text":value1.parameters.text,
                                                    "textAlign":value1.parameters.textAlign,
                                                    "textBox":(value1.parameters.textBox),
                                                    "textDecoration":value1.parameters.textDecoration,
                                                    "toppped":value1.parameters.topped,
                                                    "uniScalingUnlockable" : value1.parameters.uniScalingUnlockable,
                                                    "uploadZone": value1.parameters.uploadZone,
                                                    "width":parseFloat(value1.parameters.width),
                                                    "z":parseInt(value1.parameters.z),
                                                    "zChangeable":value1.parameters.zChangeable
                                                }})
                                            }
                                        });

                                        angular.forEach(value.elemback.params, function(value1){
                                            var flag = false;
                                            if(value1.parameters.fill != "false"){
                                                flag = value1.parameters.fill;
                                            }
                                            if(value1.parameters.flipX == "false"){
                                                value1.parameters.flipX = false;
                                            }
                                            else{
                                                value1.parameters.flipX = true;
                                            }

                                            if(value1.parameters.flipY == "false"){
                                                value1.parameters.flipY = false;
                                            }
                                            else{
                                                value1.parameters.flipY = true;
                                            }
                                            if(value1.parameters.autoCenter == "false"){
                                                value1.parameters.autoCenter = false;
                                            }
                                            else{
                                                value1.parameters.autoCenter = true;
                                            }

                                            if(value1.parameters.autoSelect == "false"){
                                                value1.parameters.autoSelect = false;
                                            }
                                            else{
                                                value1.parameters.autoSelect = true;
                                            }

                                            if(value1.parameters.colorLinkGroup == "false"){
                                                value1.parameters.colorLinkGroup = false;
                                            }
                                            else{
                                                value1.parameters.colorLinkGroup = true;
                                            }

                                            if(value1.parameters.copyable == "false"){
                                                value1.parameters.copyable = false;
                                            }
                                            else{
                                                value1.parameters.copyable = true;
                                            }

                                            if(value1.parameters.cornerSize == "false"){
                                                value1.parameters.cornerSize = false;
                                            }
                                            else if(value1.parameters.cornerSize == "true"){
                                                value1.parameters.cornerSize = true;
                                            }

                                            else{
                                                value1.parameters.cornerSize = parseInt(value1.parameters.cornerSize);
                                            }


                                            if(value1.parameters.draggable == "false"){
                                                value1.parameters.draggable = false;
                                            }
                                            else{
                                                value1.parameters.draggable = true;
                                            }

                                            if(value1.parameters.evented == "false"){
                                                value1.parameters.evented = false;
                                            }
                                            else{
                                                value1.parameters.evented = true;
                                            }

                                            if(value1.parameters.filter == "false"){
                                                value1.parameters.filter = false;
                                            }
                                            else{
                                                value1.parameters.filter = true;
                                            }

                                            if(value1.parameters.isCustom == "false"){
                                                value1.parameters.isCustom = false;
                                            }
                                            else{
                                                value1.parameters.isCustom = true;
                                            }

                                            if(value1.parameters.isEditable == "false"){
                                                value1.parameters.isEditable = false;
                                            }
                                            else{
                                                value1.parameters.isEditable = true;
                                            }

                                            if(value1.parameters.lockUniScaling == "false"){
                                                value1.parameters.lockUniScaling = false;
                                            }
                                            else{
                                                value1.parameters.lockUniScaling = true;
                                            }

                                            if(value1.parameters.removable == "false"){
                                                value1.parameters.removable = false;
                                            }
                                            else{
                                                value1.parameters.removable = true;
                                            }

                                            if(value1.parameters.replaceInAllViews == "false"){
                                                value1.parameters.replaceInAllViews = false;
                                            }
                                            else{
                                                value1.parameters.replaceInAllViews = true;
                                            }

                                            if(value1.parameters.resizable == "false"){
                                                value1.parameters.resizable = false;
                                            }
                                            else{
                                                value1.parameters.resizable = true;
                                            }

                                            if(value1.parameters.rotatable == "false"){
                                                value1.parameters.rotatable = false;
                                            }
                                            else{
                                                value1.parameters.rotatable = true;
                                            }

                                            if(value1.parameters.topped == "false"){
                                                value1.parameters.topped = false;
                                            }
                                            else{
                                                value1.parameters.topped = true;
                                            }

                                            if(value1.parameters.uniScalingUnlockable == "false"){
                                                value1.parameters.uniScalingUnlockable = false;
                                            }
                                            else{
                                                value1.parameters.uniScalingUnlockable = true;
                                            }

                                            if(value1.parameters.uploadZone == "false"){
                                                value1.parameters.uploadZone = false;
                                            }
                                            else{
                                                value1.parameters.uploadZone = true;
                                            }

                                            if(value1.parameters.zChangeable == "false"){
                                                value1.parameters.zChangeable = false;
                                            }

                                            else{
                                                value1.parameters.zChangeable = true;
                                            }

                                            if(value1.parameters.curvable == "false"){
                                                value1.parameters.curvable = false;
                                            }
                                            else{
                                                value1.parameters.curvable = true;
                                            }

                                            if(value1.parameters.curved == "false"){
                                                value1.parameters.curved = false;
                                            }
                                            else{
                                                value1.parameters.curved = true;
                                            }

                                            if(value1.parameters.curveRadius == "false"){
                                                value1.parameters.curveRadius = false;
                                            }
                                            else{
                                                value1.parameters.curveRadius = true;
                                            }
                                            if(value1.parameters.curveReverse == "false"){
                                                value1.parameters.curveReverse = false;
                                            }
                                            else{
                                                value1.parameters.curveReverse = true;
                                            }
                                            if(value1.parameters.editable == "false"){
                                                value1.parameters.editable = false;
                                            }
                                            else{
                                                value1.parameters.editable = true;
                                            }
                                            if(value1.parameters.colors == "false"){
                                                value1.parameters.colors = false;
                                            }
                                            else if(value1.parameters.colors == "true"){
                                                value1.parameters.colors = true;
                                            }

                                            if(value1.type == 'image'){
                                                arrBack.push({source:value1.source, title:value1.title, type:value1.type,parameters:{
                                                    "left"  :   parseFloat(value1.parameters.left),
                                                    "top"   :   parseFloat(value1.parameters.top),
                                                    "fill"  :   flag,
                                                    "angle" :   parseInt(value1.parameters.angle),
                                                    "autoCenter":value1.parameters.autoCenter,
                                                    "autoSelect":value1.parameters.autoSelect,
                                                    "boundingBox":value1.parameters.boundingBox,
                                                    "boundingBoxMode":value1.parameters.boundingBoxMode,
                                                    "colorLinkGroup":value1.parameters.colorLinkGroup,
                                                    "cornerSize":value1.parameters.cornerSize,
                                                    "copyable":value1.parameters.copyable,
                                                    "colors":value1.parameters.colors,
                                                    "availableFilters":new Array("grayscale", "sepia", "sepia2"),
                                                    "draggable":value1.parameters.draggable,
                                                    "evented":value1.parameters.evented,
                                                    "filter":value1.parameters.filter,
                                                    "flipX":value1.parameters.flipX,
                                                    "flipY":value1.parameters.flipY,
                                                    "height":parseInt(value1.parameters.height),
                                                    "isCustom":value1.parameters.isCustom,
                                                    "isEditable":value1.parameters.isEditable,
                                                    "lockUniScaling":value1.parameters.lockUniScaling,
                                                    "opacity":parseInt(value1.parameters.opacity),
                                                    "originX":value1.parameters.originX,
                                                    "originY":value1.parameters.originY,
                                                    "padding":parseInt(value1.parameters.padding),
                                                    "removable":value1.parameters.removable,
                                                    "replace":value1.parameters.replace,
                                                    "replaceInAllViews":value1.parameters.replaceInAllViews,
                                                    "resizable":value1.parameters.resizable,
                                                    "rotatable":value1.parameters.rotatable,
                                                    "scaleX":parseFloat(value1.parameters.scaleX),
                                                    "scaleY":parseFloat(value1.parameters.scaleY),
                                                    "toppped":value1.parameters.topped,
                                                    "uniScalingUnlockable":value1.parameters.uniScalingUnlockable,
                                                    "uploadZone":value1.parameters.uploadZone,
                                                    "width":parseFloat(value1.parameters.width),
                                                    "uploadZoneScaleMode":value1.parameters.uploadZoneScaleMode,
                                                    "z":value1.parameters.z,
                                                    "zChangeable":value1.parameters.zChangeable
                                                }})
                                            }
                                            else if(value1.type == 'text'){
                                                arrBack.push({source:value1.source, title:value1.title, type:value1.type,parameters:{
                                                    "left"  :   parseInt(value1.parameters.left),
                                                    "top"   :   parseInt(value1.parameters.top),
                                                    "fill"  :   flag,
                                                    "angle" :   parseInt(value1.parameters.angle),
                                                    "autoCenter":value1.parameters.autoCenter,
                                                    "autoSelect":value1.parameters.autoSelect,
                                                    "boundingBox":value1.parameters.boundingBox,
                                                    "boundingBoxMode":value1.parameters.boundingBoxMode,
                                                    "colorLinkGroup":value1.parameters.colorLinkGroup,
                                                    "cornerSize":value1.parameters.cornerSize,
                                                    "curvable":value1.parameters.curvable,
                                                    "colors":value1.parameters.colors,
                                                    "curveRadius":value1.parameters.curveRadius,
                                                    "curveReverse":value1.parameters.curveReverse,
                                                    "curveSpacing":parseInt(value1.parameters.curveSpacing),
                                                    "curved":value1.parameters.curved,
                                                    "copyable":value1.parameters.copyable,
                                                    "draggable":value1.parameters.draggable,
                                                    "editable":value1.parameters.editable,
                                                    "evented":value1.parameters.evented,
                                                    "flipX":value1.parameters.flipX,
                                                    "flipY":value1.parameters.flipY,
                                                    "fontFamily":value1.parameters.fontFamily,
                                                    "fontSize":parseInt(value1.parameters.fontSize),
                                                    "fontStyle":value1.parameters.fontStyle,
                                                    "fontWeight":value1.parameters.fontWeight,
                                                    "height":parseFloat(value1.parameters.height),
                                                    "isCustom":value1.parameters.isCustom,
                                                    "isEditable":value1.parameters.isEditable,
                                                    "lineHeight":parseInt(value1.parameters.lineHeight),
                                                    "lockUniScaling":value1.parameters.lockUniScaling,
                                                    "maxLength":parseInt(value1.parameters.maxLength),
                                                    "maxLines":parseInt(value1.parameters.maxLines),
                                                    "opacity":parseInt(value1.parameters.opacity),
                                                    "originX":value1.parameters.originX,
                                                    "originY":value1.parameters.originY,
                                                    "padding":parseInt(value1.parameters.padding),
                                                    "removable":value1.parameters.removable,
                                                    "replace":value1.parameters.replace,
                                                    "replaceInAllViews":value1.parameters.replaceInAllViews,
                                                    "resizable":value1.parameters.resizable,
                                                    "rotatable":value1.parameters.rotatable,
                                                    "scaleX":parseFloat(value1.parameters.scaleX),
                                                    "scaleY":parseFloat(value1.parameters.scaleY),
                                                    "stroke":value1.parameters.stroke,
                                                    "strokeWidth":parseInt(value1.parameters.strokeWidth),
                                                    "text":value1.parameters.text,
                                                    "textAlign":value1.parameters.textAlign,
                                                    "textBox":parseInt(value1.parameters.textBox),
                                                    "textDecoration":value1.parameters.textDecoration,
                                                    "toppped":value1.parameters.topped,
                                                    "width":parseFloat(value1.parameters.width),
                                                    "z":parseInt(value1.parameters.z),
                                                    "zChangeable":value1.parameters.zChangeable
                                                }})
                                            }
                                        })

                                        if(arrFront.length > 0) {
                                            arrProducts.push({id:value.id, title:value.title, thumbnail:value.thumbnail_src, elements:arrFront});
                                        }
                                        if(arrBack.length > 0) {
                                            arrProducts.push({id:value.id, title:value.title, thumbnail:value.thumbnail_src, elements:arrBack});
                                        }

                                        yourDesigner.loadProduct(arrProducts);

                                        console.log(arrProducts, " ARR PRODUCTS")
                                        $('#galleryModal').modal('hide');
                                    });

                                vm.fnInit(id);
                                }, function errorCallback(error) {
                                    console.log(error);
                                });
                        }

                        vm.fnValidMaquette = function(){
                            Data.get('session.php').then(function (results) {
                                console.log(results, "  DATA results");
                                if(results.uid){
                                    $scope.isLogged = true;
                                    $scope.utilisateur = results.name;
                                    console.log($('input[name="optradio"]:checked').val(), "BLA");
                                    console.log(vm.produit ,"TEST");
                                    console.log($('.sel_dimensions').select2('data') , " dimensions values");
                                    console.log($('.sel_qte').select2('data') , " quantitee");
                                    console.log();
                                    $('#modalMaquette').modal();
                                }
                                else if(!results.uid) {
                                    $scope.alertMsg = "Veuillez vous connecter ou vous enregistrer pour pouvoir continuer svp.";
                                    $('#myModal').modal();
                                }
                                $scope.sessionInfo = results;
                                //$location();
                            })
                        }

                        vm.fnSaveProduit = function(flag){
                            var obj={};
                            yourDesigner.getProductDataURL(function(dataURL) {
                                $.post( "api/save_image_client.php", {
                                    base64_image    : dataURL,
                                    titre           : vm.produit.titre,
                                    commentaire     : vm.produit.commentaire,
                                    option          : $('input[name="optradio"]:checked').val(),
                                    escargot        : $('input[name="optescargot"]:checked').val(),
                                    dimension       : $('.sel_dimensions').select2('data')[0].text,
                                    qte             : $('.sel_qte').select2('data')[0].text,
                                    bonrepli        : flag,
                                    data            : yourDesigner.getProduct()}
                                );
                                obj.base64_image = dataURL;
                                obj.title = vm.produit.titre;
                                obj.commentaire = vm.produit.commentaire;
                                obj.option = $('input[name="optradio"]:checked').val();
                                obj.escargot = $('input[name="optescargot"]:checked').val();
                                obj.dimension = $('.sel_dimensions').select2('data')[0].text;
                                obj.qte = $('.sel_qte').select2('data')[0].text;
                                obj.bonrepli = flag;
                                obj.data = yourDesigner.getProduct();
                                console.log(obj , " object produit");
                            });

                            bootbox.alert('Votre Schèma a été enregistré.');
                            toastr.options.positionClass = 'toast-top-right';
                            toastr.success("Enregistrement terminé");
                            //localStorage.setItem("id_model", $id_cata);



                            $("#modalMaquette").modal('hide');
                        }

                        vm.fnAddBasket = function() {
                            if(typeof vm.produit.titre == 'undefined' || (vm.produit.titre).trim() == "") {
                                bootbox.alert("<div style='text-align: center'><b>Veuillez renseigner le titre s'il-vous-plait.</b></div>");
                                return;
                            }
                            var countProduit = 0;
                            var arrProds = [];
                            if(sessionStorage.produitCount) {
                                countProduit = Number(sessionStorage.produitCount) + 1;
                            }
                            var obj={};
                            yourDesigner.getProductDataURL(function(dataURL) {

                                //obj.base64_image    = dataURL;
                                obj.title           = vm.produit.titre;
                                obj.commentaire     = vm.produit.commentaire;
                                obj.opt          = $('input[name="optradio"]:checked').val();
                                obj.escargot        = $('input[name="optescargot"]:checked').val();
                                obj.dimension       = $('.sel_dimensions').select2('data')[0].text;
                                obj.qte             = $('.sel_qte').select2('data')[0].text;
                                obj.bonrepli        = $('input[name="optcommande"]:checked').val();
                                //obj.data            = yourDesigner.getProduct();
                                obj.prix            = vm.prixvente;
                                obj.idsupport       = $('.sel_papier').select2('data')[0].id;
                                obj.support         = $('.sel_papier').select2('data')[0].text;
                                obj.unitprix        = vm.unitprix;
                                obj.idn_key         = "produit" + countProduit;

                                if(typeof vm.produit.commentaire == 'undefined'){
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
                                        base64_image    : dataURL,
                                        title           : vm.produit.titre,
                                        comm            : vm.produit.commentaire,
                                        option          : $('input[name="optradio"]:checked').val(),
                                        escargot        : $('input[name="optescargot"]:checked').val(),
                                        dimension       : $('.sel_dimensions').select2('data')[0].text,
                                        qte             : $('.sel_qte').select2('data')[0].text,
                                        bonrepli        : $('input[name="optcommande"]:checked').val(),
                                        data            : yourDesigner.getProduct(),
                                        prix            : vm.prixvente,
                                        idsupport       : $('.sel_papier').select2('data')[0].id,
                                        support         : $('.sel_papier').select2('data')[0].text,
                                        unitprix        : vm.unitprix,
                                        idn_key         : "produit" + countProduit}
                            }).done(function(data){
                                });

                                sessionStorage.setItem("produitCount", countProduit);
                                arrProds = JSON.parse(sessionStorage.getItem("arrProds"));
                                if(arrProds == null ) {
                                    arrProds = [];
                                }
                                arrProds.push("produit" + countProduit);
                                sessionStorage.setItem("arrProds", JSON.stringify(arrProds));
                                sessionStorage.setItem("produit" + countProduit, JSON.stringify(obj));
                                vm.arrProduits = [];
                            });
                            toastr.options.positionClass = 'toast-top-right';
                            toastr.success('Produit rajouté');
                        };

                        vm.fnClickPanier = function() {
                            vm.arrProduits = [];
                            var count = Number(sessionStorage.getItem("produitCount"));
                            var arrProds = JSON.parse(sessionStorage.getItem("arrProds"));
                            if(arrProds != null) {
                                angular.forEach(arrProds, function(value){
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

                        vm.fnAlertCommentaire = function(text) {
                            if(text != "" && typeof text !== 'undefined'){
                                bootbox.alert("<div style='text-align: center'>"+text+"</div>");
                            }
                        };

                        vm.fnShowButtonComm = function(text) {
                            if(text != "" && typeof text !== 'undefined'){
                                return true;
                            }
                            else {
                                return false;
                            }
                        };

                        vm.fnImgClient = function(produit) {
                            $('body').addClass("spinner");
                            $http({
                                 method: 'POST',
                                 data: $.param({mode:2, key_prod:produit.idn_key}),
                                 url: 'api/v1/recupTempProd.php',
                                 headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                 }).
                            then(function successCallback(response) {
                                    bootbox.alert("<img style='width: 400px;height: 400px' src='"+response.data+"'>");

                                    $('body').removeClass("spinner");
                                    vm.arrProduits = response.data;
                             },
                                function errorCallback(error) {
                                    console.log(error);
                                });

                            //bootbox.alert("<img style='width: 100%;height: 100%' src='"+produit.base64_image+"'>");
                        };

                        vm.fnEditClient = function(produit) {
                            $("#modalPanier").modal('hide');
                            $('body').addClass("spinner");

                            $http({
                                method: 'POST',
                                data: $.param({mode:3, key_prod:produit.idn_key}),
                                url: 'api/v1/recupTempProd.php',
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).
                            then(function successCallback(response) {

                                    $('body').removeClass("spinner");
                                    var ligne = response.data;
                                    ligne.data = JSON.parse(ligne.data);
                                    vm.productList[0] = ligne;
                                    angular.forEach(ligne.data, function(value){
                                        angular.forEach(value.elements, function(value1) {
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

                                            if(value1.parameters.fill == "false") {
                                                value1.parameters.fill = false;
                                            }

                                            if(value1.parameters.fill != "false"){
                                                flag = value1.parameters.fill;
                                            }
                                            if(value1.parameters.flipX == "false"){
                                                value1.parameters.flipX = false;
                                            }
                                            else{
                                                value1.parameters.flipX = true;
                                            }

                                            if(value1.parameters.flipY == "false"){
                                                value1.parameters.flipY = false;
                                            }
                                            else{
                                                value1.parameters.flipY = true;
                                            }
                                            if(value1.parameters.autoCenter == "false"){
                                                value1.parameters.autoCenter = false;
                                            }
                                            else{
                                                value1.parameters.autoCenter = true;
                                            }

                                            if(value1.parameters.autoSelect == "false"){
                                                value1.parameters.autoSelect = false;
                                            }
                                            else{
                                                value1.parameters.autoSelect = true;
                                            }

                                            if(value1.parameters.colorLinkGroup == "false"){
                                                value1.parameters.colorLinkGroup = false;
                                            }
                                            else{
                                                value1.parameters.colorLinkGroup = true;
                                            }

                                            if(value1.parameters.copyable == "false"){
                                                value1.parameters.copyable = false;
                                            }
                                            else{
                                                value1.parameters.copyable = true;
                                            }

                                            if(value1.parameters.cornerSize == "false"){
                                                value1.parameters.cornerSize = false;
                                            }
                                            else if(value1.parameters.cornerSize == "true"){
                                                value1.parameters.cornerSize = true;
                                            }
                                            else{
                                                value1.parameters.cornerSize = parseInt(value1.parameters.cornerSize);
                                            }


                                            if(value1.parameters.draggable == "false"){
                                                value1.parameters.draggable = false;
                                            }
                                            else{
                                                value1.parameters.draggable = true;
                                            }

                                            if(value1.parameters.evented == "false"){
                                                value1.parameters.evented = false;
                                            }
                                            else{
                                                value1.parameters.evented = true;
                                            }

                                            if(value1.parameters.filter == "false"){
                                                value1.parameters.filter = false;
                                            }
                                            else{
                                                value1.parameters.filter = true;
                                            }

                                            if(value1.parameters.isCustom == "false"){
                                                value1.parameters.isCustom = false;
                                            }
                                            else{
                                                value1.parameters.isCustom = true;
                                            }

                                            if(value1.parameters.isEditable == "false"){
                                                value1.parameters.isEditable = false;
                                            }
                                            else{
                                                value1.parameters.isEditable = true;
                                            }

                                            if(value1.parameters.lockUniScaling == "false"){
                                                value1.parameters.lockUniScaling = false;
                                            }
                                            else{
                                                value1.parameters.lockUniScaling = true;
                                            }

                                            if(value1.parameters.removable == "false"){
                                                value1.parameters.removable = false;
                                            }
                                            else{
                                                value1.parameters.removable = true;
                                            }

                                            if(value1.parameters.replaceInAllViews == "false"){
                                                value1.parameters.replaceInAllViews = false;
                                            }
                                            else{
                                                value1.parameters.replaceInAllViews = true;
                                            }

                                            if(value1.parameters.resizable == "false"){
                                                value1.parameters.resizable = false;
                                            }
                                            else{
                                                value1.parameters.resizable = true;
                                            }

                                            if(value1.parameters.rotatable == "false"){
                                                value1.parameters.rotatable = false;
                                            }
                                            else{
                                                value1.parameters.rotatable = true;
                                            }

                                            if(value1.parameters.topped == "false"){
                                                value1.parameters.topped = false;
                                            }
                                            else{
                                                value1.parameters.topped = true;
                                            }

                                            if(value1.parameters.uniScalingUnlockable == "false"){
                                                value1.parameters.uniScalingUnlockable = false;
                                            }
                                            else{
                                                value1.parameters.uniScalingUnlockable = true;
                                            }

                                            if(value1.parameters.uploadZone == "false"){
                                                value1.parameters.uploadZone = false;
                                            }
                                            else{
                                                value1.parameters.uploadZone = true;
                                            }

                                            if(value1.parameters.zChangeable == "false"){
                                                value1.parameters.zChangeable = false;
                                            }

                                            else{
                                                value1.parameters.zChangeable = true;
                                            }

                                            if(value1.parameters.curvable == "false"){
                                                value1.parameters.curvable = false;
                                            }
                                            else{
                                                value1.parameters.curvable = true;
                                            }

                                            if(value1.parameters.curved == "false"){
                                                value1.parameters.curved = false;
                                            }
                                            else{
                                                value1.parameters.curved = true;
                                            }
                                            if(value1.parameters.curveReverse == "false"){
                                                value1.parameters.curveReverse = false;
                                            }
                                            else if(value1.parameters.curveReverse == "true"){
                                                value1.parameters.curveReverse = true;
                                            }

                                            if(value1.parameters.curveRadius == "false"){
                                                value1.parameters.curveRadius = false;
                                            }
                                            else if(value1.parameters.curveRadius == "true"){
                                                value1.parameters.curveRadius = true;
                                            }

                                            if(value1.parameters.editable == "false"){
                                                value1.parameters.editable = false;
                                            }
                                            else{
                                                value1.parameters.editable = true;
                                            }

                                            if(value1.parameters.colors == "false"){
                                                value1.parameters.colors = false;
                                            }
                                            else if(value1.parameters.colors == "true"){
                                                value1.parameters.colors = true;
                                            }

                                            if(value1.parameters.numberPlaceholder == "false"){
                                                value1.parameters.numberPlaceholder = false;
                                            }
                                            else if(value1.parameters.numberPlaceholder == "true"){
                                                value1.parameters.numberPlaceholder = true;
                                            }

                                            if(value1.parameters.textBox == "false"){
                                                value1.parameters.textBox = false;
                                            }
                                            else if(value1.parameters.textBox == "true"){
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

                        vm.fnDelClient = function(produit){
                            bootbox.dialog({
                                message: "Confirmez vous la suppression?",
                                title: "Suppression",
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
                                        className: "btn-danger",
                                        callback: function() {
                                            sessionStorage.removeItem(produit.idn_key);
                                            var arrProds = JSON.parse(sessionStorage.getItem("arrProds"));
                                            arrProds.splice(arrProds.indexOf(produit.idn_key), 1);
                                            sessionStorage.setItem("arrProds",JSON.stringify(arrProds));
                                            angular.forEach(vm.arrProduits, function(value, key) {
                                                if(value.idn_key == produit.idn_key) {
                                                    vm.arrProduits.splice(key, 1);
                                                }
                                            });
                                            $scope.$apply();
                                        }
                                    }
                                }
                            });
                        };

                        vm.fnCalcPrixVente = function(flag) {
                            var idSupport = $('.sel_papier').select2('data')[0].id;
                            var qte_commander = Number($('.sel_qte').select2('data')[0].text);
                            var coeff_dimension = 0;
                            var coeff_support = 0;
                            var coeff_qte = 0;

                            angular.forEach(vm.productList[0].coeff_dims, function(value) {
                                if(value.dimension.trim() == $('.sel_dimensions').select2('data')[0].text.trim()){
                                    coeff_dimension=Number(value.coeff);
                                }
                            });
                            if(vm.productList[0].type_tarif > -1) {
                                angular.forEach(vm.productList[0].info_prix, function(value) {
                                    if(value.id_support == idSupport && Number(value.qte) == qte_commander) {
                                        coeff_support = Number(value.coeff_prix);
                                        coeff_qte  = Number(value.coeff_qte);
                                    }
                                });

                                vm.unitprix = ((coeff_dimension*coeff_qte*coeff_support) / qte_commander).toFixed(3);
                                vm.prixvente = (coeff_dimension*coeff_qte*coeff_support).toFixed(2);
                            }
                            else {
                                angular.forEach(vm.productList[0].tarifManuel, function(value) {
                                    if(value.lib_dim == $('.sel_dimensions').select2('data')[0].text.trim() && Number(value.qte) == qte_commander && value.id_support == idSupport){
                                        vm.unitprix = ((value.prix_vente)/Number(value.qte)).toFixed(3);
                                        vm.prixvente = Number(value.prix_vente).toFixed(2);
                                    }
                                })
                            }
                            console.log(vm.unitprix, " :: ", vm.prixvente);
                            if(flag != 1) {
                                $scope.$apply();
                            }

                        }

                        vm.loadCustomImg = function() {
                            console.log("adkj");
                            yourDesigner.addCustomImage('images/gallery/TEST/Picture2.png', ' Arvind');
                        };

                        vm.loadModalImgs = function() {
                            $('#imagesModal').modal();
                        };

                        vm.fnImagesLoad = function(ligne) {
                            vm.imagesList = ligne.data;
                            console.log(vm.imagesList, "  images list care");
                            $('#imagesListModal').modal();
                        }

                        vm.fnUploadImg = function(image) {
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
            params: {mode:6},
            url: 'api/v1/imageInfo.php'
        }).then(function successCallback(response) {
            console.log(response.data , " liste of images");
                vm.productsDesign = response.data;
                vm.fnInit(vm.currentProd);
            }, function errorCallback(error) {
                console.log(error);
            });

        vm.fnGallery = function() {
            $http({
                method: 'GET',
                params: {mode:0, id:localStorage.idMetier},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                    //console.log(response.data);
                    //vm.models = response.data;
                   // console.log(vm.models);
                    vm.models   = [];
                    vm.gabarits = [];

                    vm.modelsTous = response.data;
                    angular.forEach(vm.modelsTous, function(value){
                        if(value.gabarit == 0){
                            vm.models.push(value);
                        }
                        else {
                            vm.gabarits.push(value);
                        }
                    });

                $('#galleryModal').on('show.bs.modal', function () {
                    $('.modal-body').css('height',$( window ).height()*0.75);
                });
                $('#galleryModal').modal();
                    //$("#galleryModal").modal();
                    console.log(vm.listMetier);
                    $(".sel_metier").select2({
                        theme:"classic",
                        data: vm.listMetier.metier
                    });

                    $(".sel_metier").select2().val(localStorage.idMetier).trigger("change");

                    $(".sel_model_metier").select2({
                        theme:"classic",
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

        vm.rechModels = function(id_model){
            $http({
                method: 'GET',
                params: {mode:14, id:id_model},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                    //console.log(response.data);
                   // vm.models = response.data;
                    vm.modelsTous = response.data;
                    vm.models   = [];
                    vm.gabarits = [];
                    angular.forEach(vm.modelsTous, function(value){
                        if(value.gabarit == 0){
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

        vm.fnMetierList = function() {
            $http({
                method: 'GET',
                params: {mode:8},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                    //console.log(response.data);
                    //console.clear();
                    console.log(response.data);
                    var id_metier = localStorage.idMetier;
                    console.log(id_metier , " metier ");
                    vm.listMetier = response.data;

                    vm.fnGallery();
                }, function errorCallback(error) {
                    console.log(error);
                });
        }

        vm.fnClickTabs = function(tabVal){
            vm.activeId = tabVal;
            vm.isShow = tabVal;
        };

        $scope.fnSignUp = function() {
            $('#signupFiche').modal();
        }

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
                        vm.fnValidMaquette();
                    }
                });
        };

        vm.fnCheckOut = function() {
    console.log($scope.sessionInfo);
}

        var lang = localStorage.getItem("LANG");
        /*
        set imgs Mon panier and ajouter au panier
         */
        vm.linkMonPanier = "../assets/carts/mon_panier.png";
        vm.linkAjoutPanier = "../assets/carts/ajouter_panier.png";
        if(lang == "FR") {
            vm.linkMonPanier = "../assets/carts/mon_panier.png";
            vm.linkAjoutPanier = "../assets/carts/ajouter_panier.png";
        }
        else if(lang == "ES") {
            vm.linkMonPanier = "../assets/carts/cesta_espagnol.png";
            vm.linkAjoutPanier = "../assets/carts/cart_espagnol.png";
        }
        else if(lang == "EN") {
            vm.linkMonPanier = "../assets/carts/cart_english.png";
            vm.linkAjoutPanier = "../assets/carts/add_cart_english.png";
        }
        else if(lang == "AL") {
            vm.linkMonPanier = "../assets/carts/warenkorb_deutch.png";
            vm.linkAjoutPanier = "../assets/carts/cart_deutch.png";
        }
        else if(lang == "IT") {
            vm.linkMonPanier = "../assets/carts/carrello_italiano.png";
            vm.linkAjoutPanier = "../assets/carts/cart_italien.png";
        }
        $translate.use(localStorage.getItem('LANG'));
        $http({
            method: 'GET',
            params: {mode:3, lang:lang},
            url: 'api/v1/langueCRUD.php'
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.langue = angular.copy(response.data);
            });
        vm.setLang = function(langKey) {
            // You can change the language during runtime
            $translate.use(langKey);
        };

        $scope.$watch('isActualLang', function(ov, nv) {
            console.log(ov, nv, " module fichier");
            vm.setLang(localStorage.getItem("LANG"));
            var lang = localStorage.getItem("LANG");
            
             vm.linkMonPanier = "../assets/carts/mon_panier.png";
             vm.linkAjoutPanier = "../assets/carts/ajouter_panier.png";
             if(lang == "FR") {
             vm.linkMonPanier = "../assets/carts/mon_panier.png";
             vm.linkAjoutPanier = "../assets/carts/ajouter_panier.png";
             }
             else if(lang == "ES") {
             vm.linkMonPanier = "../assets/carts/cesta_espagnol.png";
             vm.linkAjoutPanier = "../assets/carts/cart_espagnol.png";
             }
             else if(lang == "EN") {
             vm.linkMonPanier = "../assets/carts/cart_english.png";
             vm.linkAjoutPanier = "../assets/carts/add_cart_english.png";
             }
             else if(lang == "AL") {
             vm.linkMonPanier = "../assets/carts/warenkorb_deutch.png";
             vm.linkAjoutPanier = "../assets/carts/cart_deutch.png";
             }
             else if(lang == "IT") {
             vm.linkMonPanier = "../assets/carts/carrello_italiano.png";
             vm.linkAjoutPanier = "../assets/carts/cart_italien.png";
             }
             
        });
    });
