angular
    .module('adminApp')
    .controller('prodClientController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, $routeParams) {
        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        $scope.header = "Produit Client";
        vm.currentProd = $routeParams.idCommDetail;
        vm.infoProd = [];
        console.log(vm.currentProd, "current produit");


        vm.productsDesign = [];

        vm.fnInit = function (idprod) {
            console.log("**************************************");
            console.log(localStorage.idModelMetier);
            console.log(vm.currentProd);
            console.log(idprod);
            console.log("**************************************");
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
            urlLang = "lang/fr.json";

            $http({
                method: 'POST',
                data: $.param({mode:0, idProd:vm.currentProd}),
                url: 'api/v1/produitDetails.php',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                console.log(response.data);
                vm.infoProd = response.data;

                console.log(JSON.parse(vm.infoProd.data));


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

                    var data = JSON.parse(vm.infoProd.data);
                    var arrProducts = [];
                    var arrFront = [];
                    var arrBack = [];
                    console.log(data[0].elements, " -----")
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

                }, 0);





            }, function errorCallback(error) {
                console.log(error);
            });

        };



        vm.fnInit();

    });
