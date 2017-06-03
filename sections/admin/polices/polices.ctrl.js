angular
    .module('adminApp')
    .controller('policesController', function($scope, $rootScope, $routeParams, $location, FileUploader,$http, Data, $timeout, $sanitize) {
        console.log("police controller");

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        $scope.header = "Polices";
        vm.arrDataOrig = [];
        vm.arrData = [];
        vm.message  = "";
        vm.flagIndex = 0;
        vm.isDisplayed = true;

        var uploader = $scope.uploader = new FileUploader({
            url: 'api/php_scripts/upload.php'
        });

        // FILTERS

        // a sync filter
        uploader.filters.push({
            name: 'syncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter');
                return this.queue.length < 10;
            }
        });
        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item, vm.flagIndex);
            item.formData = [{
                nom: document.getElementById("txtarea" + vm.flagIndex).value
            }];
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            vm.fnInit();
            //toastr.warning("File was successfully uploaded");
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };

        vm.fnInit = function() {
            $http({
                method: 'GET',
                params: {mode:0},
                url: 'api/v1/policesCRUD.php'
            }).then(function successCallback(response) {

                console.log(response.data);
                vm.arrDataOrig = angular.copy(response.data);
                vm.arrData = response.data;
                $('body').removeClass("spinner");
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.testUpload = function (index, item) {
            vm.flagIndex = index;
            vm.isEventCalled = 0;
            item.url = "api/uploadPolices.php";
            item.upload();
        };

        vm.fnTest = function () {
            var test = [
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
            ];
            console.clear();
            //console.log(test);
            angular.forEach(test, function(value){
                $http({
                    method: 'GET',
                    params: {mode:1, nom:value.name, path:value.url},
                    url: 'api/v1/policesCRUD.php'
                }).then(function successCallback(response) {

                    console.log(response.data);
                }, function errorCallback(error) {
                    console.log(error);
                });
            })
        };
        vm.fnDelete = function(item) {
            $('body').addClass("spinner");
            $http({
                method: 'GET',
                params: {mode:3, id:item.id},
                url: 'api/v1/policesCRUD.php'
            }).then(function successCallback(response) {

                console.log(response.data);
                vm.fnInit();
            }, function errorCallback(error) {
                console.log(error);
            });
        };
        vm.fnEdit = function(item) {

            bootbox.prompt({
                title: "Nom",
                inputType: 'text',
                value:item.nom,
                callback: function (result) {
                    console.log(result, item);
                    $('body').addClass("spinner");
                    if(result != null && result.trim() != ""){
                        $http({
                            method: 'GET',
                            params: {mode:4, id:item.id, nom:result},
                            url: 'api/v1/policesCRUD.php'
                        }).then(function successCallback(response) {

                            console.log(response.data);
                            vm.fnInit();
                            $('body').removeClass("spinner");
                        }, function errorCallback(error) {
                            console.log(error);
                        });
                    }
                }
            });
        };
        vm.fnDisplay = function (flag) { {
            if(flag == 0) {
                vm.isDisplayed = true;
            }
            else{
                vm.isDisplayed = false;
            }

        }

        }

        vm.fnInit();
        //vm.fnTest();
        
        $(document).keydown(function(e){

        });
    });
