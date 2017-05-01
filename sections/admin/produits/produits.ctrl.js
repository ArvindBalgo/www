angular
    .module('adminApp')
    .controller('produitsController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, FileUploader, $compile) {

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        vm.currentProduit = {};
        $scope.header = "Produits";
        vm.tarifInfo = [];
        vm.tarifNew = [];
        vm.chkCustom = false;
        vm.isManuel = 0;

        //uploader img
        var uploader = $scope.uploader = new FileUploader({
            url: 'api/produitImg.php'
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

        });
        uploader.onBeforeUploadItem = function(item) {

            item.formData = [{id_cata:vm.currentProduit.id_cata}];
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            vm.fnGetProduits();
            $("#modalProduit").modal('hide');

        };



        vm.formatCell = function(){
            var trash = "<button type='button' class='btn btn-default btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 1)'><i class='glyphicon glyphicon-trash'></i></button>";
            var edit  = "<button type='button' class='btn btn-info btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 2)'><i class='glyphicon glyphicon-upload'></i></button>";
            var image = "<button type='button' class='btn btn-success btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 3)'><i class='glyphicon glyphicon-picture'></i></button>";
            var tarif = "<button type='button' class='btn btn-primary btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 4)'><i class='glyphicon glyphicon-euro'></i></button>";
            var edit1 = "<button type='button' class='btn btn-warning btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 5)'><i class='glyphicon glyphicon-pencil'></i></button>";
            var livraison = "<button type='button' class='btn btn-default btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 6)'><i class='glyphicon glyphicon-road'></i></button>";
            return image+livraison+edit+tarif+edit1+trash;
        }

        vm.columns = [  { name:'Libelle',field: 'description',enableHiding:false},
                        { name:'Clé traduction',field: 'key_description',enableHiding:false},
                        { name:'Reference',field: 'reference',enableHiding:false},
                        { name:'Actif', field: '',enableFiltering:false,cellTemplate: vm.formatCell() ,enableHiding:false}

                    ];

        $scope.edit  = function (grid, row, opt){
            vm.currentProduit = angular.copy(row);
            if(opt == 1){
                //delete
                bootbox.confirm("Confirmez-vous la suppresion de cette ligne <b>" + vm.currentProduit.description + "|| Ref: " + vm.currentProduit.reference + "</b>?", function(result) {
                    if(result){

                        $http({
                            method: 'GET',
                            params: {mode:1, id:vm.currentProduit.id_cata},
                            url: 'api/v1/produitCRUD.php'
                        }).then(function successCallback(response) {
                                console.log(response.data);
                                vm.fnGetProduits();
                            }, function errorCallback(error) {
                                console.log(error);
                            });

                    }
                })
            }
            if(opt == 2){
                //exchange img
                $('#modalProduit').modal();
            }
            else if(opt == 3) {
                //display image
                $('#imgModal').modal();
            }
            else if(opt == 4) {
                $http({
                    method: 'GET',
                    params: {mode:4, souscategory: vm.currentProduit.id_modelmetier},
                    url: 'api/v1/tarif.php'
                }).then(function successCallback(response) {
                    var arrList = angular.copy(response.data);

                    if(arrList == null || arrList.length == 0) {
                        bootbox.alert("Pas de Tarifs!!!");
                        return;
                    }
                    arrList.unshift({id:0, text:''});
                    if(vm.currentProduit.id_souscategory_coeffprix == -1) {
                        arrList.unshift({id:-1, text:'Tarif manuel'});
                        vm.chkCustom = true;
                    }

                    $("#selTarifProd").empty();
                    $( "#selTarifProd" ).append( "<select class='sel_tarif_prod' style='width: 100%;'></select>" );
                    $(".sel_tarif_prod").select2({
                        theme:"classic",
                        data: arrList
                    });

                    $(".sel_tarif_prod").val(vm.currentProduit.id_souscategory_coeffprix).trigger("change");


                    $(".sel_tarif_prod").on("select2:select", function (e) {
                        vm.fnCalcPA();
                    });

                    $('#modalTarif').on('show.bs.modal', function () {
                        $('.modal-body').css('height',$( window ).height()*0.7);
                    });
                    vm.fnCalcPA();
                    $('#modalTarif').modal();
                }, function errorCallback(error) {
                    console.log(error);
                });

            }
            else if(opt == 5) {
                $('#modalEditProd').modal();
            }
            else if(opt == 6) {
                $('body').addClass("spinner");
                console.log(vm.currentProduit, " test");
                $http({
                    method: 'GET',
                    params: {mode:16, id:row.id_cata},
                    url: '/api/v1/sampleControl.php'
                }).then(function successCallback(response) {
                    console.log(response.data);
                    vm.arrFraisLivr = response.data;
                    $('#modalLivraison').on('show.bs.modal', function () {
                        $('.modal-body').css('height',$( window ).height()*0.7);
                    });
                    $("#modalLivraison").modal();
                    $('body').removeClass("spinner");
                }, function errorCallback(error) {
                    console.log(error);
                });
            }
        };

        vm.fnSaveLivr = function() {
            $('body').addClass("spinner");
            angular.forEach(vm.arrFraisLivr, function(val){
                angular.forEach(val, function(item) {
                    $http({
                        method: 'GET',
                        params: {mode:18, data:JSON.stringify(item)},
                        url: 'api/v1/sampleControl.php'
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        // bootbox.alert("Les frais sont sauvegarder");
                    }, function errorCallback(error) {
                        console.log(error);
                    });
                })
            });
            $('body').removeClass("spinner");
        };

        vm.fnSetManuelMode = function() {
            console.log(vm.isManuel, " manuel value");
        }


        vm.fnRechCategory = function() {
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

                    $(".sel_model_metier").on("select2:select", function (e) {
                        vm.fnGetProduits();
                    });

                    vm.fnGetProduits();
                }, function errorCallback(error) {
                    console.log(error);
                });
        };

        vm.fnCalcPA = function() {
            $http({
                method: 'GET',
                params: {   mode:6,
                            id_cata:vm.currentProduit.id_cata,
                            id_metier:vm.currentProduit.id_metier,
                            id_tarif:Number($(".sel_tarif_prod").select2().val()),
                            id_souscategory:vm.currentProduit.id_modelmetier
                            },
                url: 'api/v1/tarif.php'
            }).then(function successCallback(response) {
                vm.tarifInfo = [];
                vm.tarifInfo = response.data;
                //var arrayTarif = [];
                vm.tarifNew = vm.tarifInfo.dimensions_coeff;
                angular.forEach(vm.tarifNew, function(value){
                    var objDim = angular.copy(value);
                    value.support = vm.tarifInfo.papier;
                    var arrayQte = [];
                    var arrQte = [];
                    /*angular.forEach(vm.tarifInfo.papier, function(val) {
                        angular.forEach(vm.tarifInfo.qte, function(value){
                            arrayQte.push({qte:value.trim(), id_support:val.id, support:val.description, prix:vm.fnSetCoeff(objDim, val, value.trim())});
                        });
                    });*/
                    if(Number($(".sel_tarif_prod").select2().val()) == -1) {
                        angular.forEach(vm.tarifInfo.qte, function(valeur) {
                            arrQte = [];
                            angular.forEach(vm.tarifInfo.papier, function(val1) {
                                arrQte.push({qte:valeur.trim(), id_support:val1.id, support:val1.description, prix:vm.fnSetCoeff1(objDim, val1, valeur.trim())});
                            });
                            arrayQte.push(arrQte);
                        });
                    }
                    else {
                        angular.forEach(vm.tarifInfo.qte, function(valeur) {
                            arrQte = [];
                            angular.forEach(vm.tarifInfo.papier, function(val1) {
                                arrQte.push({qte:valeur.trim(), id_support:val1.id, support:val1.description, prix:vm.fnSetCoeff(objDim, val1, valeur.trim())});
                            });
                            arrayQte.push(arrQte);
                        });
                    }

                    value.prix = arrayQte;
                });

            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnGetProduits = function() {
            var id_category = $(".sel_model_metier").select2().val();
            $http({
                method: 'GET',
                params: {mode:0 , id:id_category},
                url: 'api/v1/produitCRUD.php'
            }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.gridOptions.data = [];
                    $timeout(function(){
                        $scope.gridOptions.data = response.data
                    }, 0);

                }, function errorCallback(error) {
                    console.log(error);
                });
        };

        vm.fnValidTarif = function() {
            if(vm.chkCustom) {
                $.ajax({
                    url: 'api/v1/tarif1.php',
                    type: 'post',
                    dataType: 'json',
                    success: function (data) {
                        vm.currentProduit.id_souscategory_coeffprix = Number($(".sel_tarif_prod").select2().val());
                        bootbox.alert("<div>La sauvegarde de la tarif terminé</div>");
                    },
                    data: {mode:1,
                        id_cata: vm.currentProduit.id_cata,
                        id_tarif:$(".sel_tarif_prod").select2().val(),
                        custom:vm.chkCustom,
                        tarif:JSON.stringify(vm.tarifNew)}
                });
            }
            else{
                $http({
                    method: 'GET',
                    params: {mode:5, id_cata: vm.currentProduit.id_cata, id_tarif:$(".sel_tarif_prod").select2().val()},
                    url: 'api/v1/tarif.php'
                }).then(function successCallback(response) {
                    vm.currentProduit.id_souscategory_coeffprix = Number($(".sel_tarif_prod").select2().val());
                    bootbox.alert("<div>La sauvegarde de la tarif terminé</div>");
                }, function errorCallback(error) {
                    console.log(error);
                });
            }
        };

        vm.fnSetCoeff = function(dimension, support, qte) {
            var prix  =0;
            angular.forEach(vm.tarifInfo.coeff, function(value) {
                if(value.id_support == support.id && Number(value.qte) == Number(qte)) {
                    prix =  Number(dimension.coeff * value.coeff_prix * value.coeff_qte).toFixed(2);
                }
            });
            return prix;
        };

        vm.fnSetCoeff1 = function(dimension, support, qte) {
            var prix  =0;
            angular.forEach(vm.tarifInfo.coeff, function(value) {

                if(value.id_support == support.id && Number(value.qte) == Number(qte) && Number(value.id_dim) == Number(dimension.id)) {
                    prix =  Number(value.prix_vente).toFixed(2);
                }
            });
            return prix;
        };

        vm.fnValidKey = function() {
            $http({
                method: 'GET',
                params: {mode:2, id_cata: vm.currentProduit.id_cata, key:vm.currentProduit.key_description},
                url: 'api/v1/produitCRUD.php'
            }).then(function successCallback(response) {
               $("#modalEditProd").modal('hide');
                vm.fnRechCategory();
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        $(document).ready(function(){
            vm.fnRechCategory();
            $scope.gridOptions = {
                enableSorting: true,
                enableFiltering: true,
                columnDefs: vm.columns,
                rowHeight:50
            };
        });

    });

