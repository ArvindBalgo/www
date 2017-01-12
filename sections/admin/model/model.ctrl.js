angular
    .module('adminApp')
    .controller('modelController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, FileUploader) {
    console.log("MODEL CONTROLLER");
        var vm = this;
        $scope.header = "Construction des modeles";
        vm.libelle = '';
        vm.description = '';
        vm.reference = '';
        vm.transferTxt = "";
        vm.strDimension = "";
        vm.currentProduit = {};
        vm.isModifier = false;
        vm.objEnCours = {};
        vm.chkEscargo  = false;
        vm.chkContours = false;
        vm.chkLiserai  = false;
        vm.chkCoucher  = false;
        vm.chkGabarit  = false;
        vm.activeId = 1;
        vm.isShow = 1;
        vm.listMetier = [];

        $scope.edit  = function (grid, row, opt){
            var arrObj = [];
            angular.forEach($scope.gridOptDimensions.data, function(value){
               if(value.dimensions != row.dimensions){
                   arrObj.push(value);
               }
            });
            $scope.gridOptDimensions.data = arrObj;
        }
        vm.formatCell = function(){
            var trash = "<button type='button' class='btn btn-default btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 1)'><i class='glyphicon glyphicon-remove'></i></button>";
            return trash;
        }

        vm.columnsCategory  = [ { name:'Dimensions',width:'300',field: 'dimensions',enableCellEdit: true,enableHiding:false ,cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
            return 'cssLibelle';
        }},
            { name:'Actions', field: '',enableFiltering:false,cellTemplate: vm.formatCell() ,enableHiding:false}];

        $scope.gridOptDimensions = {
            enableSorting   : true,
            enableFiltering : true,
            columnDefs      : vm.columnsCategory,
            rowHeight       : 50,
            data            : []
        };



        $(".sel_dimension").select2({
            tags: true,
            allowClear: true,
            data:[]
        });

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        vm.imgList = [
            {id:1,title:"Cheque cadeau",src:"assets/img/cheque_cadeau.png"},
            {id:2,title:"Carte Message",src:"assets/img/carte_message.png"},
            {id:3,title:"Carte",src:"assets/img/CARTE.png"},
            {id:4,title:"emballage",src:"assets/img/emballage.png"},
            {id:5,title:"contenants",src:"assets/img/contenants.png"},
            {id:6,title:"Envelope",src:"assets/img/enveloppe.png"},
            {id:7,title:"Etiquette Adhesive",src:"assets/img/etiquette_adhesive.png"},
            {id:8,title:"Flyer",src:"assets/img/flyer.png"},
            {id:9,title:"Lettre",src:"assets/img/lettre.png"},
            {id:10,title:"Pochette Couvert",src:"assets/img/pochette_couvert.png"}
        ];

        vm.productList = [
            {id:1, title:'Etiquette', thumbnail_src:'images/etiquetteprix/maquette_complet1.png', img_src : [
                {id:1 , src:'images/etiquetteprix/etiquette_prix1.png'}
            ]}
        ];

        vm.imgList = [];
        vm.productList = [];

        vm.fnModelMetier = function() {
            $http({
                method: 'GET',
                params: {mode:9},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
console.log(response.data, "baakallk");
                    vm.arrData = response.data;
                }, function errorCallback(error) {
                    console.log(error);
                });
        };

        vm.fnModelMetier();

        vm.productsDesign = [
            {id:1, title:'SWIRL', imgsrc:[
                {id:1, src:'images/designs/swirl.png', title:'Swirl'},
                {id:2, src:'images/designs/swirl2.png', title:'Swirl 2'},
                {id:3, src:'images/designs/swirl3.png', title:'Swirl 3'},
                {id:4, src:'images/designs/heart_blur.png', title:'Heart Blur'},
                {id:5, src:'images/designs/converse.png', title:'Converse'},
                {id:6, src:'images/designs/crown.png', title:'Crown'},
                {id:7, src:'images/designs/men_women.png', title:'Men hits Women'}
            ]},
            {id:2, title:'Retro', imgsrc:[
                {id:1, src:'images/designs/retro_1.png', title:'Retro One'},
                {id:2, src:'images/designs/retro_2.png', title:'Retro Two'},
                {id:3, src:'images/designs/retro_3.png', title:'Retro Three'},
                {id:4, src:'images/designs/heart_circle.png', title:'Heart Circle'},
                {id:5, src:'images/designs/swirl.png', title:'Swirl'},
                {id:6, src:'images/designs/swirl2.png', title:'Swirl 2'},
                {id:7, src:'images/designs/swirl3.png', title:'Swirl 3'}
            ]},
            {id:3, title:'Carte', imgsrc:[
                {id:1, src:'images/businesscard/adresse.png', title:'Adresse'},
                {id:2, src:'images/businesscard/down.png', title:'Down'},
                {id:3, src:'images/businesscard/upper.png', title:'Up'},
                {id:4, src:'images/businesscard/logo.png', title:'Logo'}
            ]},
            {id:3, title:'Retro', imgsrc:[
                {id:1, src:'images/carte/1.png', title:'IMG1'},
                {id:1, src:'images/carte/2.png', title:'IMG2'},
                {id:1, src:'images/carte/3.png', title:'IMG3'},
                {id:1, src:'images/carte/4.png', title:'IMG4'},
                {id:1, src:'images/carte/5.png', title:'IMG5'}
            ]}
        ];
        vm.fnTileClick = function(obj) {

        }

        vm.fnMaquette = function() {
            $timeout(function() {
                $("#imgScroll").endlessScroll({ width: '100%',height: '250px', steps: -2, speed: 40, mousestop: true });

                var $yourDesigner = $('#model'),
                    pluginOpts = {
                        stageWidth: 2000,
                        stageHeight: 1000,
                        editorMode: true,
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
                        actions:  {
                            'top': ['download','print', 'snap', 'preview-lightbox'],
                            'right': ['zoom', 'reset-product', 'ruler'],
                            'bottom': ['undo','redo'],
                            'left': ['manage-layers','info','save','load']
                        }
                    },
                    yourDesigner = new FancyProductDesigner($yourDesigner, pluginOpts);


                yourDesigner.addProduct([{title:'Simple', thumbnail:'images/gallery/simple.png',elements:[]}]);
                yourDesigner.addProduct([{title:'Recto', thumbnail:'images/gallery/recto.jpg',elements:[]}, {title:'Verso', thumbnail:'images/gallery/simple.png',elements:[]}]);


                //print button
                $('#print-button').click(function(){
                    //yourDesigner.clear();
                    //yourDesigner.addView({title:'BACK TEST', thumbnail:'images/designs/heart_circle.png', elements:{}});
                    yourDesigner.selectProduct(3);
                    return;
                    yourDesigner.print();
                    return false;
                });

                //create an image
                $('#image-button').click(function(){
                    var image = yourDesigner.createImage();

                    return false;
                });



                //checkout button with getProduct()
                $('#checkout-button').click(function(){
                    var product = yourDesigner.getProduct();

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
                    console.log(vm.objEnCours, " loaded obj at modal open");
                    $('#myModel').modal();
                    if(vm.isModifier) {
                        vm.libelle = vm.objEnCours.libelle;
                        vm.reference = vm.objEnCours.reference;
                        vm.description=vm.objEnCours.description;
                        if(vm.objEnCours.escargot == 1) {
                            vm.chkEscargo = true;
                        }
                        else {
                            vm.chkEscargo = false;
                        }

                        if(vm.objEnCours.contours == 1) {
                            vm.chkContours = true;
                        }
                        else {
                            vm.chkContours = false;
                        }

                        if(vm.objEnCours.liserai == 1) {
                            vm.chkLiserai = true;
                        }
                        else {
                            vm.chkLiserai = false;
                        }

                        if(vm.objEnCours.coucher == 1) {
                            vm.chkCoucher = true;
                        }
                        else {
                            vm.chkCoucher = false;
                        }

                        if(vm.objEnCours.gabarit == 1) {
                            vm.chkGabarit = true;
                        }
                        else {
                            vm.chkGabarit = false;
                        }

                       /* vm.chkEscargo = vm.objEnCours.escargot;
                        vm.chkContours = vm.objEnCours.contours;
                        vm.chkLiserai = vm.objEnCours.liserai;
                        vm.chkCoucher = vm.objEnCours.coucher;
                        vm.chkGabarit  = vm.objEnCours.gabarit;*/
                    }
                    else{
                        vm.libelle      = "";
                        vm.reference    = "";
                        vm.description  = "";
                        vm.strDimension = "";
                        vm.chkEscargo   = false;
                        vm.chkContours  = false;
                        vm.chkLiserai   = false;
                        vm.chkCoucher   = false;
                        vm.chkGabarit   = false;
                    }
                }
                vm.fnGallery = function() {
                    $http({
                        method: 'GET',
                        params: {mode:4, id:$(".sel_model_metier").select2().val()},
                        url: 'api/v1/sampleControl.php'
                    }).then(function successCallback(response) {
                            console.log(response);
                            vm.galleryModels = response.data;
                            $("div.modal-backdrop").remove();
                            vm.isModifier=false;
                            $('#gallery').modal();
                        }, function errorCallback(error) {
                            console.log(error);
                        });
                };

                vm.fnImgClick = function(obj) {
                    $http({
                        method: 'GET',
                        params: {mode:5, id:obj.id},
                        url: 'api/v1/sampleControl.php'
                    }).then(function successCallback(response) {
                            angular.forEach(response.data, function(value){
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
                                    else{
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
                                    else if(value1.parameters.curveReverse == "true"){
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
                                $('#gallery').modal('hide');
                            });

                        }, function errorCallback(error) {
                            console.log(error);
                        });
                }


                vm.fnDel = function(obj) {
                    bootbox.dialog({
                        message: "Confirmez-vous la suppresion de model <br> <b>Model:</b> " +obj.libelle + "<br><b>Reference: </b>"+obj.reference + "",
                        title: "Suppresion",
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
                                    $http({
                                        method: 'GET',
                                        params: {mode:6, id:obj.id_cata, id_back:obj.id_back, id_front:obj.id_front},
                                        url: 'api/v1/sampleControl.php'
                                    }).then(function successCallback(response) {
                                            console.log(response);
                                            $("div.modal-backdrop").remove();
                                            vm.fnGallery();

                                        }, function errorCallback(error) {
                                            console.log(error);
                                        });
                                }
                            }
                        }
                    });
                }

                vm.fnEdit = function(obj) {
                    $http({
                        method: 'GET',
                        params: {mode:7, id:obj.id_cata},
                        url: 'api/v1/sampleControl.php'
                    }).then(function successCallback(response) {
                            vm.isModifier=true;
                            vm.objEnCours = response.data;
                            console.log(vm.objEnCours, " loaded obj");
                        }, function errorCallback(error) {
                            console.log(error);
                        });

                    $http({
                        method: 'GET',
                        params: {mode:5, id:obj.id_cata},
                        url: 'api/v1/sampleControl.php'
                    }).then(function successCallback(response) {

                            var data = angular.copy(response.data);

                            angular.forEach(response.data, function(value){
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

                                if(arrFront.length > 0) {
                                    arrProducts.push({id:value.id, title:value.title, thumbnail:value.thumbnail_src, elements:arrFront});
                                }
                                if(arrBack.length > 0) {
                                    arrProducts.push({id:value.id, title:value.title, thumbnail:value.thumbnail_src, elements:arrBack});
                                }

                                yourDesigner.loadProduct(arrProducts);
                                $('#gallery').modal('hide');
                            });

                        }, function errorCallback(error) {
                            console.log(error);
                        });
                }

                vm.fnQuitter  = function(){
                    console.log("annuler");
                    $('#myModel').modal('hide');
                    $('#gallery').modal('hide');
                };

                vm.fnValider = function(){

                    yourDesigner.getProductDataURL(function(dataURL) {

                        //if(vm.libelle == '' || vm.description=='' || $(".sel_model").select2().val() == '' || $(".sel_model").select2().val() == null || vm.strDimension == 'undefined' || vm.strDimension == ""){
                        if(vm.libelle == '' || vm.description=='' || $(".sel_model").select2().val() == '' || $(".sel_model").select2().val() == null){
                            bootbox.alert("Toutes les informations sont obligatoire");
                            return;
                        }


                        $.post( "api/save_image.php", { base64_image    : dataURL,
                                                        ref             : vm.reference,
                                                        libelle         : vm.libelle,
                                                        description     : vm.description,
                                                        dimensions      : vm.strDimension,
                                                        //dimensions      : "",
                                                        escargot        : vm.chkEscargo,
                                                        contours        : vm.chkContours,
                                                        liserai         : vm.chkLiserai,
                                                        coucher         : vm.chkCoucher,
                                                        gabarit         : vm.chkGabarit,
                                                        metiers         : $(".sel_model").select2().val(),
                                                        data            : yourDesigner.getProduct()});});
                    $('#myModel').modal('hide');

                }

                vm.fnValiderModif = function(){
                    yourDesigner.getProductDataURL(function(dataURL) {
                        //if(vm.libelle == '' || vm.description=='' || $(".sel_model").select2().val() == '' || $(".sel_model").select2().val() == null || vm.strDimension == 'undefined' || vm.strDimension == ""){
                        if(vm.libelle == '' || vm.description=='' || $(".sel_model").select2().val() == '' || $(".sel_model").select2().val() == null){
                            bootbox.alert("Toutes les informations sont obligatoire");
                            return;
                        }

                        console.log(vm.description , "   ::::::TEST");
                        $.post( "api/save_image_modif.php", { base64_image: dataURL,
                            id:vm.objEnCours.id,
                            ref:vm.reference,
                            libelle:vm.libelle,
                            description:vm.description,
                            dimensions      : vm.strDimension,
                            //dimensions      : "",
                            escargot        : vm.chkEscargo,
                            contours        : vm.chkContours,
                            liserai         : vm.chkLiserai,
                            coucher         : vm.chkCoucher,
                            gabarit         : vm.chkGabarit,
                            metiers         : $(".sel_model").select2().val(),
                            data:yourDesigner.getProduct()});

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
                }

                vm.fnImage = function() {
                    yourDesigner.getProductDataURL(function(dataURL) {
                        $.post( "api/save_image.php", { base64_image: dataURL} ).success(function(data) {
                            // console.log(data);
                        })
                    });
                }

                vm.fnAjoutDim = function() {
                    $scope.gridOptDimensions.data.push({
                        "dimensions": ""
                    });
                }

                vm.fnValidDim = function() {
                    var arrDimensions = [];
                    angular.forEach($scope.gridOptDimensions.data, function(value){
                        arrDimensions.push(value.dimensions);
                    });
                    vm.strDimension = arrDimensions.toString();
                    $("#dimensions").modal("hide");
                }
            }, 0);
        };



        $http({
            method: 'GET',
            params: {mode:6},
            url: 'api/v1/imageInfo.php'
        }).then(function successCallback(response) {
                vm.productsDesign = response.data;
                console.log(vm.productsDesign ,  "   :::::::::");
                vm.fnMaquette();
            }, function errorCallback(error) {
                console.log(error);
            });





        vm.fnModifier = function() {
            console.log("modifier");
        }

        vm.fnSuppression = function() {
            console.log("SUPPRESSION");
        }

        vm.fnClickTabs = function(tabVal){
            vm.activeId = tabVal;
            vm.isShow = tabVal;
        }

        vm.fnMetierList = function() {
            $http({
                method: 'GET',
                params: {mode:8},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {

                    vm.listMetier = response.data;

                    $(".sel_model_metier").select2({
                        theme:"classic",
                        data: vm.listMetier.modelsmetier
                    });

                    $(".sel_model").select2({
                        theme:"classic",
                        data: vm.listMetier.modelsmetier
                    });

                    $(".sel_model_metier").on("select2:select", function (e) {
                        console.log($(".sel_model_metier").select2().val() , "  :::");
                        //vm.rechModels($(".sel_model_metier").select2().val());
                        vm.fnGallery();
                    });

                    $(".sel_model").on("select2:select", function (e) {
                        console.log($(".sel_model").select2().val() , "  :::");
                        //vm.rechModels($(".sel_model_metier").select2().val());
                       // vm.fnGallery();
                    });


                }, function errorCallback(error) {
                    console.log(error);
                });
        }

        vm.fnTransfer = function(data){
            vm.transferTxt = data.reference;
            vm.currentProduit = angular.copy(data);
            $("#transfer").modal();

            $(".sel_transfer").select2({
                theme:"classic",
                data: vm.listMetier.modelsmetier
            });

            $(".sel_transfer").on("select2:select", function (e) {
                console.clear();
                console.log("id of produit: " , vm.currentProduit.id);
                console.log("new id_model category", $(".sel_transfer").select2().val());
            });
        }

        vm.fnTransferProduit = function(){
            bootbox.dialog({
                message: "Confirmer-vous le transfer de ce produit?",
                title: "Suppresion",
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
                            console.log("id of produit: " , vm.currentProduit.id);
                            console.log("new id_model category", $(".sel_transfer").select2().val());
                            $http({
                                method: 'GET',
                                params: {mode:13, id_produit:vm.currentProduit.id_cata , id_category:$(".sel_transfer").select2().val()},
                                url: 'api/v1/sampleControl.php'
                            }).then(function successCallback(response) {
                                    vm.fnQuitter();
                                    $("#transfer").modal('hide');
                                    vm.fnGallery();

                                }, function errorCallback(error) {
                                    console.log(error);
                                });
                        }
                    }
                }
            });

        }
        vm.rechModels = function ($id_modelmetier_catalogue){

        }

        vm.fnClickDimensions = function() {
            $("#dimensions").modal();
            var arrDimension = [];
            var arrObjDim = [];
            if(angular.isDefined(vm.objEnCours.dimensions) && vm.objEnCours.dimensions != ""){
                arrDimension = vm.objEnCours.dimensions.split(",");
                angular.forEach(arrDimension, function(value){
                    arrObjDim.push({'dimensions':value});
                });
            }
            $scope.gridOptDimensions.data = arrObjDim;
        }

        $(document).ready(function() {
            $(".selObj").select2(
                {allowClear: true,
                    closeOnSelect:false}
            );
            var $eventSelect = $(".selObj");
            vm.fnMetierList();
        });
    });
