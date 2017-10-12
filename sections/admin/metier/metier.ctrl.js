angular
    .module('adminApp')
    .controller('metierController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, FileUploader, $compile) {

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        $scope.header = "Listes des metiers";
        vm.description = "";
        vm.currentImg = "";
        vm.qteComm = "";
        vm.selectedObj = {};
        vm.istable1 = true;
        vm.istable2 = true;
        vm.istable3 = true;

        vm.libMetier = "";
        vm.modelLibelle = "";
        vm.modelKeyLibelle = "";
        vm.modelLibelle_en = "";
        vm.modelLibelle_es = "";
        vm.modelLibelle_al = "";
        vm.modelLibelle_it = "";
        vm.active = true;
        vm.originalData = [];
        vm.nouveauMetier = false;
        vm.isModified = true;
        vm.isImgModified = false;
        vm.selRowCategory = {};
        vm.currentSCate = {};
        vm.arrSubCategory = [];
        vm.currentSCImg = "";
        vm.scDescription = "";
        vm.currentSCategory = {};
        vm.arrDataDim = [];
        vm.arrQteSupport = [];
        vm.arrCoeff = [];
        vm.arrTarif = [];
        vm.currentTarifID = {};
        vm.paysList = [];
        vm.arrFraisLivr = [];

        vm.fnToggleT1 = function() {
            vm.istable1 = !vm.istable1;
        };
        vm.fnToggleT2 = function() {
            vm.istable2 = !vm.istable2;
        };
        vm.fnToggleT3 = function() {
            vm.istable3 = !vm.istable3;
        };

        var uploader = $scope.uploader12 = new FileUploader({
            url: 'api/categoryupload.php'
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        uploader.formData.push({
            name: vm.modelLibelle,
            key : vm.modelKeyLibelle,
            active:vm.active
        });
        uploader.onBeforeUploadItem = function(item) {
            var id_model = 0;
            var img_modified = 0;
            if(typeof vm.selRowCategory.id === 'undefined' || vm.selRowCategory.id === null){
                id_model = 0
            }
            else{
                id_model = vm.selRowCategory.id;
            }
            if(vm.isImgModified){
                img_modified = 1;
            }

            item.formData = [{id:vm.selectedObj.id,name:vm.modelLibelle,key:vm.modelKeyLibelle, qte:vm.qteComm, active:vm.active, id_model:id_model, img_modified:img_modified}];
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            vm.fnModelMetier();
            $("#modalModel").modal('hide');

        };

        //image upload sub category
        var uploadersc = $scope.uploader = new FileUploader({
            url: 'api/subCategoryUpload.php'
        });


        uploadersc.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });
        uploadersc.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        uploadersc.formData.push({
            name: vm.modelLibelle,
            key:vm.modelKeyLibelle,
            active:vm.active
        });
        uploadersc.onBeforeUploadItem = function(item) {
            var id_model = 0;
            var img_modified = 0;
            var isActive = 0;
            if(vm.currentSCategory.active){
                isActive = 1;
            }
            if(typeof vm.selRowCategory.id === 'undefined' || vm.selRowCategory.id === null){
                id_model = 0
            }
            else{
                id_model = vm.selRowCategory.id;
            }
            if(vm.isImgModified){
                img_modified = 1;
            }

            item.formData = [{  id:vm.currentSCategory.id,
                                description:vm.currentSCategory.description,
                                key_description:vm.currentSCategory.key_description,
                                active:vm.currentSCategory.active,
                                message:vm.currentSCategory.message,
                                key_message:vm.currentSCategory.key_message
            }];
        };
        uploadersc.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);

            $("#modalSCModel").modal('hide');
            $http({
                method: 'GET',
                params: {mode:7, id:vm.currentSCate.id},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                    console.log(response.data);
                    vm.arrSubCategory = response.data;

                }, function errorCallback(error) {
                    console.log(error);
                });
        };



        vm.fnFormatter = function(grid, row){
            console.log( row);
            return 'BLABLA';
        }

        $scope.edit  = function (grid, row, opt){
            vm.isModified = true;
            var arrQte = [];
            if(opt == 1) {
                bootbox.confirm("Confirmez-vous la suppresion de cette ligne <b>"+row.description+"</b>?", function(result) {
                    if(result){
                        console.log(row.id);
                        console.log("confirmation to delete");

                        $http({
                            method: 'GET',
                            params: {mode:0, id:row.id},
                            url: 'api/v1/metierCRUD.php'
                        }).then(function successCallback(response) {
                                console.log(response.data);
                                vm.fnModelMetier();
                            }, function errorCallback(error) {
                                console.log(error);
                            });

                    }
                })
            }
            if(opt == 2) {
                vm.qteComm = "";
                if(row.qte != ""){
                    vm.qteComm = row.qte;
                    arrQte = row.qte.split(",");
                }
                vm.isModified = false;
                vm.isImgModified = false;
                vm.modelLibelle = row.description;
                vm.modelKeyLibelle = row.key_libelle;
                vm.selRowCategory = row;
                //vm.modalLibelle = row.description;
                if(row.active == 1){
                    vm.active = true;
                }
                else {
                    vm.active = false;
                }


                $("#modalModel").modal();

                /*$(".selObj").select2({
                    tags: true,
                    allowClear: true,
                    data:[]
                });

                $('.selObj').val(arrQte).trigger("change");*/

                vm.srcModel = row.src;
            }
            else if(opt == 3) {
                vm.currentImg = row.src;
                vm.description = row.description;
                $('#imgModal').modal();
            }
            else if(opt == 4) {
                console.log(grid, row, opt);
                $http({
                    method: 'GET',
                    params: {mode:7, id:row.id},
                    url: 'api/v1/info.php'
                }).then(function successCallback(response) {
                        console.log(response.data);
                        $scope.gridOptionsCategory.data = [];
                        $timeout(function(){
                            $scope.gridOptionsCategory.data = response.data;
                            //$scope.gridOptionsCategory.handleWindowResize();
                            vm.arrSubCategory = response.data;

                            /*var hgt = $('#modalSousCategory').height();
                            var wdt = $('#modalSousCategory').width();
                            $('#modalSousCategory').width(wdt);
                            $('#modalSousCategory').height(hgt);*/
                        }, 0);

                    }, function errorCallback(error) {
                        console.log(error);
                    });

                vm.currentSCate = row;
                $("#modalSousCategory").modal();
            }
            else if(opt == 5) {
                console.log(grid, row, opt);
                console.log("delivery grid data here");
                $http({
                    method: 'GET',
                    params: {mode:19, id:row.id},
                    url: 'api/v1/info.php'
                }).then(function successCallback(response) {
                    console.log(response.data);
                    vm.arrFraisLivr = response.data;
                    $("#modalLivraison").modal();

                }, function errorCallback(error) {
                    console.log(error);
                });

            }

        };
        vm.fnSaveLivr = function() {
            console.log(vm.arrFraisLivr);
            $http({
                method: 'GET',
                params: {mode:20, data:JSON.stringify(vm.arrFraisLivr.livraison), id: vm.arrFraisLivr.id},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                bootbox.alert("Les frais sont sauvegarder");

            }, function errorCallback(error) {
                console.log(error);
            });
        };
        vm.formatCell = function(){
            var trash = "<button type='button' class='btn btn-default btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 1)'><i class='glyphicon glyphicon-trash'></i></button>";
            var edit = "<button type='button' class='btn btn-info btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 2)'><i class='glyphicon glyphicon-pencil'></i></button>";
            var image = "<button type='button' class='btn btn-success btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 3)'><i class='glyphicon glyphicon-picture'></i></button>";
            var souscat = "<button type='button' class='btn btn-primary btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 4)'><i class='glyphicon glyphicon-th-list'></i></button>";
            var fraisLivr = "<button type='button' class='btn btn-default btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 5)'><i class='glyphicon glyphicon-road'></i></button>";
            return image+souscat+edit+trash;
        }


        vm.formatCellSubCategory = function(){
            var trash = "<button type='button' class='btn btn-default btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.editSubCategory(grid, row.entity, 1)'><i class='glyphicon glyphicon-trash'></i></button>";
            var edit = "<button type='button' class='btn btn-info btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.editSubCategory(grid, row.entity, 2)'><i class='glyphicon glyphicon-pencil'></i></button>";
            var image = "<button type='button' class='btn btn-success btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.editSubCategory(grid, row.entity, 3)'><i class='glyphicon glyphicon-picture'></i></button>";
            var souscat = "<button type='button' class='btn btn-primary btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.editSubCategory(grid, row.entity, 4)'><i class='glyphicon glyphicon-th-list'></i></button>";
            return image+souscat+edit+trash;
        }

        vm.fnEditSubCategory = function(obj , opt){
            console.log("****************************");
           // console.log(obj);
            console.log("****************************");
            if(opt ==1) {
                vm.currentSCImg = obj.src;
                vm.scDescription = obj.description;
                $('#imgSCModal').modal();
            }
            else if(opt == 2) {
                vm.currentSCategory = obj;
                console.clear();
                console.log(vm.currentSCategory , " test");
                $("#modalSCModel").modal();
            }
            else if(opt ==3) {
                bootbox.confirm("Confirmez-vous la suppresion de cette ligne <b>"+obj.description+"</b>?", function(result) {
                    if(result){
                        console.log(obj.id);
                        console.log("confirmation to delete");

                        $http({
                            method: 'GET',
                            params: {mode:1, id:obj.id},
                            url: 'api/v1/metierCRUD.php'
                        }).then(function successCallback(response) {
                                console.log(response.data);
                              //  vm.fnModelMetier();
                                $http({
                                    method: 'GET',
                                    params: {mode:7, id:vm.currentSCate.id},
                                    url: 'api/v1/info.php'
                                }).then(function successCallback(response) {
                                        console.log(response.data);
                                        vm.arrSubCategory = response.data;

                                    }, function errorCallback(error) {
                                        console.log(error);
                                    });
                            }, function errorCallback(error) {
                                console.log(error);
                            });

                    }
                })
            }
            else if(opt ==4) {
                vm.currentSCategory = obj;
                vm.scDescription = obj.description;
                $http({
                    method: 'GET',
                    params: {mode:0, id:obj.id , id_metier:obj.id_modelmetier},
                    url: 'api/v1/tarif.php'
                }).then(function successCallback(response) {
                    var objQte = [];
                    vm.arrDataDim = angular.copy(response.data);


                    if(vm.arrDataDim.selsupport == null) {
                        vm.arrDataDim.selsupport = '';
                    }

                    var arrSelSupport = vm.arrDataDim.selsupport.split(',');
                    angular.forEach(vm.arrDataDim.papier, function(value){
                        if(arrSelSupport.indexOf(value.id) >=0){
                            value.chkval = true;
                        }
                    });
                    vm.fnAddCoeff();
                    angular.forEach(vm.arrQteSupport, function(value){
                        angular.forEach(value.qte, function(val, key){
                            angular.forEach(vm.arrDataDim.tarifactuel, function(valeur){

                                if(valeur.id_support == value.id && (valeur.qte).trim() == key.trim()){
                                    val.qte = valeur.coeff_qte;
                                    val.prix = valeur.coeff_prix;
                                }
                            });
                        });
                    });

                    $('#modalSCPrix').on('show.bs.modal', function () {
                        $('.modal-body').css('height',$( window ).height()*0.7);
                    });
                    $('#modalSCPrix').modal();

                }, function errorCallback(error) {
                    console.log(error);
                });
            }
            else if(opt == 5) {
                vm.currentSCategory = obj;
                $http({
                    method: 'GET',
                    params: {mode:1, id:obj.id , id_metier:obj.id_modelmetier},
                    url: 'api/v1/tarif.php'
                }).then(function successCallback(response) {
                    vm.arrTarif = response.data;
                    $('#modalTarif').modal();

                }, function errorCallback(error) {
                    console.log(error);
                });



            }
        }

        vm.columns = [  { name:'Libelle',field: 'description',enableHiding:false ,cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                return 'cssLibelle';
                        }},
            { name:'Clé',field: 'key_libelle',enableHiding:false ,cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                return 'cssLibelle';
            }},
                        { name:'Quantité', field: 'qte',enableFiltering:false,enableHiding:false},
                        { name:'Action', field: 'active',enableFiltering:false,cellTemplate: vm.formatCell() ,enableHiding:false}

        ];

        vm.columnsCategory  = [ { name:'Libelle',width:'250',field: 'description',enableHiding:false ,cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
            return 'cssLibelle';
        }},
            { name:'Actions', field: '',enableFiltering:false,cellTemplate: vm.formatCellSubCategory() ,enableHiding:false}];

        $scope.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            columnDefs: vm.columns,
            rowHeight:50
        };

        $scope.gridOptionsCategory = {
            enableSorting   : true,
            enableFiltering : true,
            columnDefs      : vm.columnsCategory,
            rowHeight       : 50
        };

        vm.fnModelMetier = function(opt) {
            $http({
                method: 'GET',
                params: {mode:0},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
               // vm.gridOptions.data = response.data;
               // response.data.splice(0, 1);
                vm.myData = response.data;
                var arrMetier = [];
                var txtLang = "";
                var arrPays  = [];
                var selPays = "";
                selPays = $('input[name=selPays]:checked').val();
                if( angular.isUndefined(selPays)) {
                    selPays = "FR";
                }
                angular.forEach(vm.paysList, function(pays_name) {
                    arrPays[pays_name.id] = pays_name.abrev;
                    if(pays_name.abrev == selPays) {
                        txtLang = pays_name.id;
                    }
                });

                angular.forEach(response.data, function(value){
                    if(value.pays == txtLang) {
                        arrMetier.push(value.libelle);
                    }
                });
                $('#modalMetier').modal('hide');
                $("#selMetier").empty();
                $( "#selMetier" ).append( "<select class='sel_metier' style='width: 100%;'></select>" );
                 $compile($(".sel_metier").select2({
                     theme:"classic",
                     data: arrMetier
                 }));
                 $(".sel_metier").on("select2:select", function (e) {
                     vm.fnSelectActivated();
                 });
                     vm.fnSubCategory();
                }, function errorCallback(error) {
                    console.log(error);
                });

        };

        vm.fnSelectActivated = function(){
            console.log($(".sel_metier").select2().val());
            angular.forEach(vm.myData, function(value){
                if(value.libelle == $(".sel_metier").select2().val()){
                    vm.selectedObj = value;
                }
            });
            vm.fnFilterGrid();
        };

        vm.fnSubCategory = function(){
            $http({
                method: 'GET',
                params: {mode:2},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                    console.log(response.data);
                    vm.originalData = angular.copy(response.data);
                    var $example = $(".sel_metier").select2();

                    angular.forEach(vm.myData, function(value){
                        if(value.libelle == $example.val()){
                            vm.selectedObj = value;
                        }
                    });
                    vm.fnFilterGrid();


                }, function errorCallback(error) {
                    console.log(error);
                });
        };

        vm.fnCrudMetier = function(opt) {
            console.log(opt, vm.selectedObj);
            if(opt == 0) {
                vm.libelle = "";
                vm.key_libelle = "";
                vm.key_sub_libelle = "";
                vm.sous_libelle = "";
                vm.active = false;
                vm.nouveauMetier = true;
                $("#FR1").prop("checked", true);
                $('#modalMetier').modal();
            }
            else if(opt == 1) {
                vm.libelle = vm.selectedObj.libelle;
                vm.sous_libelle = vm.selectedObj.sub_libelle;
                vm.key_libelle = vm.selectedObj.key_libelle;
                vm.key_sub_libelle = vm.selectedObj.key_sub_libelle;
                vm.nouveauMetier = false;
                if(vm.selectedObj.active == 1){
                    vm.active = true;
                }
                else{
                    vm.active = false;
                }
                $('#modalMetier').modal();
                //vm.libMetier = vm.selectedObj.libelle + " - " + vm.selectedObj.sub_libelle;
            }
            else if(opt == 2){
                vm.selRowCategory = {};
                vm.nouveauMetier = false;
                vm.isImgModified = true;
                vm.isModified = true;
                console.log("row data", vm.selRowCategory.id);

                vm.currentImg = "assets/img/contenants.png";
                $('#modalModel').modal();
            }
            else if (opt == 3){
                //delete
                console.log(vm.selectedObj);
                bootbox.dialog({
                    message: "Confirmez-vous la suppresion de ce metier <b>"+vm.selectedObj.libelle+"</b>?",
                    title: "Suppresion",
                    buttons: {
                        annuler: {
                            label: "Non",
                            className: "btn-secondary",
                            callback: function() {
                                console.log("Annulation de cette suppression");
                            }
                        },
                        valider: {
                            label: "Oui",
                            className: "btn-success",
                            callback: function() {
                                console.log("confirmation to delete");
                                $http({
                                 method: 'GET',
                                 params: {mode:2, id:vm.selectedObj.id},
                                 url: 'api/v1/metierCRUD.php'
                                 }).then(function successCallback(response) {
                                 console.log(response.data);
                                 vm.fnModelMetier();
                                 }, function errorCallback(error) {
                                 console.log(error);
                                 });
                            }
                        }
                    }
                });
            }
        };

        vm.fnFilterGrid = function() {
            var arrData = angular.copy(vm.originalData);
            console.log(vm.selectedObj);
            var arrFiltered = [];
            console.log(arrData, " :: DATA");
            angular.forEach(arrData, function(value) {
                if(value.category == vm.selectedObj.id){
                    arrFiltered.push(value);
                }
            });
            console.log(arrFiltered, "  filttered data");
            $scope.gridOptions.data = [];
            $timeout(function(){
                $scope.gridOptions.data = arrFiltered
            }, 0);
        };

        vm.fnQuitter = function(){
            $('#imgModal').modal('hide');
            $('#modalMetier').modal('hide');
            $('#modalModel').modal('hide');
            $("#modalSousCategory").modal('hide');
        };

        vm.fnValid = function() {
            var flagMode = -1;
            var flagactive = 0;
            var id  = 0;
            var idPays = 0;
            console.log(vm.actif);
            if(vm.active){
                flagactive = 1;
            }
            if(vm.libelle.length == 0){
                bootbox.alert("<h4>Le champs libelle ne peut pas etre vide!!!</h4>");
                return;
            }
            if(vm.nouveauMetier){
                flagMode = 4;//Sauvegarde nouveau metier
            }
            else{
                flagMode = 5;//Edition metier
                id = vm.selectedObj.id;
            }
            var selPays = $('input[name=selPays]:checked').val();
            angular.forEach(vm.paysList, function(value) {
                if(selPays == value.abrev) {
                    idPays = value.id;
                }
            });

            $http({
                method: 'GET',
                params: {   mode:flagMode,
                            id:id,
                            libelle:vm.libelle,
                            sub_libelle:vm.sous_libelle,
                            actif:flagactive,
                            pays: idPays,
                            key_libelle: vm.key_libelle,
                            key_sub_libelle: vm.key_sub_libelle},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                vm.fnModelMetier(1);
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnModifImg = function() {
            vm.isImgModified = true;
            vm.isModified    = true;
            console.log("row data", vm.selRowCategory);
        };

        vm.fnValidModel = function(){
            var flagactive = 0;
            if(vm.active){
                flagactive = 1;
            }

            $http({
                method: 'GET',
                params: {mode:6, id:vm.selRowCategory.id,name:vm.modelLibelle,key:vm.modelKeyLibelle, qte:vm.qteComm, active:flagactive},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                    console.log(response.data);
                    vm.fnModelMetier();
                    $("#modalModel").modal('hide');
                }, function errorCallback(error) {
                    console.log(error);
                });
        };

        vm.fnAddNewCate = function() {
            bootbox.prompt({
                title: "Libelle",
                inputType: 'email',
                callback: function (result) {
                    console.log(result);
                    vm.saveModelCategory(result);
                }
            });
        };

        vm.saveModelCategory = function(libelle){
            $http({
                method: 'GET',
                params: {mode:8, description:libelle, id_modelmetier:vm.currentSCate.id, src:vm.currentSCate.src, qte:"", active:1},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                    console.log(response.data);
                    //$("#modalSousCategory").modal('hide');
                    $http({
                        method: 'GET',
                        params: {mode:7, id:vm.currentSCate.id},
                        url: 'api/v1/info.php'
                    }).then(function successCallback(response) {
                            console.log(response.data);
                            vm.arrSubCategory = response.data;

                        }, function errorCallback(error) {
                            console.log(error);
                        });

                }, function errorCallback(error) {
                    console.log(error);
                });
        };

        vm.fnValidPrix = function(){
            console.clear();
            var arrCategory = [];
            angular.forEach(vm.arrQteSupport, function(value){
               arrCategory.push(value.id);
            });

           /* $http({
                method: 'GET',
                params: {   mode:0,
                            tarifid: vm.currentTarifID.id,
                            id_souscategory: vm.currentSCategory.id ,
                            data: JSON.stringify(vm.arrQteSupport) ,
                            listsouscate:JSON.stringify(arrCategory),
                            dim : JSON.stringify(vm.arrDataDim.dimension)},
                url: 'api/v1/calc_prix.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                $('#modalSCPrix').modal('hide');
            }, function errorCallback(error) {
                console.log(error);
            });*/

            $.ajax({
                url: 'api/v1/calc_prix1.php',
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    $('#modalSCPrix').modal('hide');
                },
                data: {   mode:0,
                    tarifid: vm.currentTarifID.id,
                    id_souscategory: vm.currentSCategory.id ,
                    data: JSON.stringify(vm.arrQteSupport) ,
                    listsouscate:JSON.stringify(arrCategory),
                    dim : JSON.stringify(vm.arrDataDim.dimension)}
            });
        };

        vm.fnAddCoeff = function($objSupport) {
            vm.arrQteSupport = vm.arrDataDim.papier.filter(function(e){
                return e.chkval == true;
            });
        };

        vm.fnCalcPrix = function() {
            //calc coeff
            vm.arrCoeff = [];
            var counter = 0;
            angular.forEach(vm.arrDataDim.qte, function(value , key) {
                vm.arrCoeff.push({libelle: 'Coeff - ' + value , code:'coeff', qte:value});
                vm.arrCoeff.push({libelle: 'Prix achat - ' + value , code:'pa', qte:value});
                vm.arrCoeff.push({libelle: 'Prix unité - ' + value , code:'pu', qte:value});
                vm.arrCoeff.push({libelle: 'Prix totale - ' + value + ' unité' , code:'prix', qte:value});
            });
            $("#modalAffichePrix").modal();
        };

        vm.fnSetCoeff = function(code, qte, objSupport, dimension) {
            console.log(vm.arrCoeff);
            if(code == 'coeff') {
                return Number(objSupport.qte[qte].qte).toFixed(2);
            }
            else if(code == 'pa') {
                return Number(dimension.coeff * objSupport.qte[qte].qte).toFixed(2);
            }
            else if(code == 'pu') {
                return Number((dimension.coeff * objSupport.qte[qte].qte * objSupport.qte[qte].prix)/qte).toFixed(3);
            }
            else if(code == 'prix') {
                return Number(dimension.coeff * objSupport.qte[qte].qte * objSupport.qte[qte].prix).toFixed(2);
            }
        };

        vm.fnSetClass = function(code) {
            return code;
        };

        vm.fnAddNewTarif = function() {
            bootbox.prompt({
                title: "Nom",
                inputType: 'email',
                callback: function (result) {
                    console.log(result);
                    vm.saveTarif(result);
                }
            });
        };

        vm.saveTarif = function(nom){
            $http({
                method: 'GET',
                params: {mode:2, id: 0, souscategory:vm.currentSCategory.id, nom : nom},
                url: 'api/v1/tarif.php'
            }).then(function successCallback(response) {
                console.log(response);
                vm.fnGetAllTarifs(vm.currentSCategory.id);
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.editTarif = function(objTarif, nom) {
            $http({
                method: 'GET',
                params: {mode:2, id: objTarif.id, souscategory:objTarif.souscategory, nom : nom},
                url: 'api/v1/tarif.php'
            }).then(function successCallback(response) {
                console.log(response);
                vm.fnGetAllTarifs(vm.currentSCategory.id);
            }, function errorCallback(error) {
                console.log(error);
            });
        }


        vm.fnGetAllTarifs = function(id) {
            $http({
                method: 'GET',
                params: {mode:1, id: id},
                url: 'api/v1/tarif.php'
            }).then(function successCallback(response) {
                console.log(response);
                vm.arrTarif = response.data;
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnEditTarif = function(objTarif, opt) {
            console.log(objTarif, opt);
            if(opt == 1) {
                bootbox.prompt({
                    title: "Nom",
                    inputType: 'email',
                    value:objTarif.nom,
                    callback: function (result) {
                        if(result) {
                            vm.editTarif(objTarif, result);
                        }
                    }
                });
            }
            else if(opt == 2) {
                bootbox.confirm("Confirmez-vous la suppresion de cette ligne <b>" + objTarif.nom + "</b>?", function(result) {
                    if(result){
                        $http({
                            method: 'GET',
                            params: {mode:3, id:objTarif.id},
                            url: 'api/v1/tarif.php'
                        }).then(function successCallback(response) {
                            console.log(response.data);
                            vm.fnGetAllTarifs(objTarif.souscategory);
                        }, function errorCallback(error) {
                            console.log(error);
                        });
                    }
                })
            }
            else if(opt ==3) {
                vm.scDescription = vm.currentSCategory.description;
                vm.currentTarifID = objTarif;
                $http({
                    method: 'GET',
                    params: {mode: 0, id: vm.currentSCategory.id , id_metier: vm.currentSCategory.id_modelmetier, tarifid:objTarif.id},
                    url: 'api/v1/tarif.php'
                }).then(function successCallback(response) {

                    console.log(response.data);
                    $('#modalTarif').modal('hide');
                    var objQte = [];
                    vm.arrDataDim = angular.copy(response.data);


                    if(vm.arrDataDim.selsupport == null) {
                        vm.arrDataDim.selsupport = '';
                    }

                    var arrSelSupport = vm.arrDataDim.selsupport.split(',');
                    angular.forEach(vm.arrDataDim.papier, function(value){
                        if(arrSelSupport.indexOf(value.id) >=0){
                            value.chkval = true;
                        }
                    });
                    vm.fnAddCoeff();
                    angular.forEach(vm.arrQteSupport, function(value){
                        angular.forEach(value.qte, function(val, key){
                            angular.forEach(vm.arrDataDim.tarifactuel, function(valeur){

                                if(valeur.id_support == value.id && (valeur.qte).trim() == key.trim()){
                                    val.qte = valeur.coeff_qte;
                                    val.prix = valeur.coeff_prix;
                                }
                            });
                        });
                    });

                    $('#modalSCPrix').on('show.bs.modal', function () {
                        $('.modal-body').css('height',$( window ).height()*0.7);
                    });
                    $('#modalSCPrix').modal();

                }, function errorCallback(error) {
                    console.log(error);
                });
            }
        }

        vm.fnGetListPays = function() {
            $http({
                method: 'GET',
                params: {mode:15},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                vm.paysList = response.data;


                $(document).ready(function () {
                    $("#FR").prop("checked", true);
                });
                vm.fnModelMetier();
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnRadioPays = function(data) {
            var txtLang = "";
            var arrPays  = [];
            var arrMetier  = [];
            var arrData = angular.copy(vm.myData);
            angular.forEach(vm.paysList, function(pays_name) {
                if(pays_name.abrev == data) {
                    txtLang = pays_name.id;
                }
            });

            angular.forEach(arrData, function(value){
                if(value.pays == txtLang) {
                    arrMetier.push(value.libelle);
                }
            });
            $('#modalMetier').modal('hide');
            $("#selMetier").empty();
            $( "#selMetier" ).append( "<select class='sel_metier' style='width: 100%;'></select>" );
            $compile($(".sel_metier").select2({
                theme:"classic",
                data: arrMetier
            }));
            $(".sel_metier").on("select2:select", function (e) {
                vm.fnSelectActivated();
            });
            vm.fnSubCategory();

        };

        vm.fnValidateText = function() {
            $http({
                method: 'GET',
                params: {mode:18,
                        id:vm.currentSCategory.id,
                        description:vm.currentSCategory.description,
                        key_description:vm.currentSCategory.key_description,
                        active:vm.currentSCategory.active,
                        message:vm.currentSCategory.message,
                        key_message:vm.currentSCategory.key_message},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {

                vm.fnModelMetier();
            }, function errorCallback(error)
            {
                console.log(error);
            });
        };
        vm.fnGetListPays();


    });

