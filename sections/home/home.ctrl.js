angular
    .module('myApp')
    .controller('HomeController', function($scope, $location, $http, Data, messages, $timeout, $translate) {
        //Setup view model object
        console.log('HOME CONTROLLER');
       // spinnerService.show('spin');
        toastr.options.positionClass = 'toast-top-full-width';

        var vm = this;
        console.log($scope.isActualLang);

        //angular translate
        $scope.setLang = function(langKey) {
            // You can change the language during runtime
            $translate.use(langKey);
        };
        // end angular translate
        //document.getElementById("loader").style.display = "none";
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
        vm.isFrance= false;
        $scope.langue = [];


Data.get('session.php').then(function (results) {
            $scope.sessionInfo = results;
            if(results.uid){
                $scope.isLogged = true;
                $scope.utilisateur = results.name;
            }
            $scope.sessionInfo = results;
            console.log(results, 'results from admin');

            if(localStorage.getItem('LANG') == "" || localStorage.getItem('LANG') == null) {
                document.getElementById("myNav").style.width = "100%";

                $timeout(function(){
                    $(document).ready(function(){

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
                vm.isFrance= false;
            }
            else {
                vm.isFrance= true;
                $translate.use(localStorage.getItem('LANG'));
                $http({
                    method: 'GET',
                    params: {mode:3, lang:localStorage.getItem('LANG')},
                    url: 'api/v1/langueCRUD.php'
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.langue = angular.copy(response.data);
                    document.getElementById("myNav").style.width = "0%";
                    document.getElementById("panier_btn").style.display = "block";
                    $('body').css({
                        'overflow': 'auto'
                    });
                    toastr.success("Bienvenue chez Exakom, nous sommes à votre disposition si vous avez besoin d'aide");
                }, function errorCallback(error) {
                    console.log(error);
                });
            }
    //$( document ).width("1382");


        });

        vm.instructions = [];

        vm.description = "";
        vm.fnImgClick = function(data){
            console.log("CLICKED IMG: ",data.description, data.id);
            vm.description = data.description;
            vm.src = data.src;
            vm.currentCategory = angular.copy(data);

            $http({
                method: 'GET',
                params: {mode:11, id:data.id},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                    console.log(response);
                    vm.sampleMetier = angular.copy(response.data);
                    $('#myModel').on('show.bs.modal', function () {
                        $('.modal-body').css('height',$( window ).innerHeight()*0.75);
                    });
                    $('#myModel').modal();
                    //$('#myModel').modal();
                    document.body.style.overflow = "hidden";
                }, function errorCallback(error) {
                    console.log(error);
                });

            //$location.path('fichetech');
        };

        vm.fnImgClick2 = function(data){
            vm.description = vm.currentCategory.description + " - " + data.description;
            vm.src = data.src;
            vm.message = data.message;
            $http({
                method: 'GET',
                params: {mode:12, id:data.id},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                    console.log(response.data , "  produits lists info ");
                    vm.arrProds         = [];
                    vm.arrGabarits      = [];
                    angular.forEach(response.data, function(value){
                        if(value.gabarit == 0){
                            vm.arrProds.push(value);
                        }
                        else{
                            vm.arrGabarits.push(value);
                        }
                    });
                    vm.listProduits = angular.copy(response.data);
                    $('#myModel').modal('hide');
                    $('#produits').modal();
                    document.body.style.overflow = "hidden";
                }, function errorCallback(error) {
                    console.log(error);
                });
        };

        vm.fnRetourCategory = function(){
            $('#produits').modal('hide');
            vm.fnImgClick(vm.currentCategory);
        };

        //WEBSERVICE
        vm.fnRecupMetier = function(){
            $http({
                method: 'GET',
                params: {mode:0},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                    console.log(response.data);
                    vm.btnMetier = response.data;
                    vm.activeId = response.data[0].id;

                }, function errorCallback(error) {
                    console.log(error);
                });
        };

        /*vm.fnTest =function(){
            angular.forEach(vm.metier, function(value){
                $http({
                    method: 'POST',
                    params: {description:value.description, category:value.category, src:value.src},
                    url: 'test.php'
                }).then(function successCallback(response) {
                        console.log(response.data);
                    }, function errorCallback(error) {
                        console.log(error);
                    });
            });

        }
        vm.fnTest();*/
        vm.fnInsertMetier = function(libelle, sub_libelle) {
            $http({
                method: 'GET',
                params: {mode:1, desig:libelle, sub_desig:sub_libelle},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log('insert mode');
                    console.log(response.data);
                }, function errorCallback(error) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(error);
                });
        };

        vm.fnModelMetierAll = function(){
            $http({
                method: 'GET',
                params: {mode:2},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                    console.log("MODEL METIER");
                    vm.origModels = angular.copy(response.data);
                   // vm.metier = response.data;
                var arrModels = [];
                angular.forEach(response.data, function(value){
                    if(value.category == vm.activeId){
                        arrModels.push(value);
                    }
                });
                vm.metier = angular.copy(arrModels);
                }, function errorCallback(error) {
                    console.log(error);
                });
        };

        vm.fnModelClick  = function($id, $id_modelMetier, $id_cata, $id_metier) {
            //$('#myModel').modal('hide');
            vm.fnRemoveModal();
            localStorage.setItem("id_model", $id_cata);
            localStorage.setItem("idModelMetier", $id_modelMetier);
            localStorage.setItem("idMetier",$id_metier);
            $location.path('fichetech');
        };

        vm.fnClickBtn = function($obj) {
            vm.activeId = $obj.id;
            var arrModels = [];
            if($obj.libelle == "Tous les produits") {
                vm.metier = angular.copy(vm.origModels);
                return;
            }
            angular.forEach(vm.origModels, function(value){
               if(value.category == $obj.id){
                   arrModels.push(value);
               }
            });
            vm.metier = angular.copy(arrModels);
        };

        $scope.fnSignUp = function(){
            $('#myModal').modal('hide');
            $('#signup').modal();
        };

        vm.fnInstructions = function(){
            var param = localStorage.getItem('LANG');
            if(param == "") {
                param = "FR";
            }
            $http({
                method: 'GET',
                params: {mode:11, param: param},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                    vm.instructions = response.data;
                }, function errorCallback(error) {
                    console.log(error);
                });
        };

        vm.fnRemoveModal = function(){
            $('#produits').modal('hide');
            $('#myModel').modal('hide');
            document.body.style.overflow = "scroll";
        };

        vm.fnClickLang = function($lang) {
            console.log($lang);
            localStorage.setItem("LANG", $lang);
            $translate.use($lang);
            $http({
                method: 'GET',
                params: {mode:3, lang:$lang},
                url: 'api/v1/langueCRUD.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.langue = angular.copy(response.data);
                document.getElementById("myNav").style.width = "0%";
                document.getElementById("panier_btn").style.display = "block";
                $('body').css({
                    'overflow': 'auto'
                });
                toastr.success("Bienvenue chez Exakom, nous sommes à votre disposition si vous avez besoin d'aide");
            }, function errorCallback(error) {
                console.log(error);
            });
            
        };

        vm.fnClickTabs = function(tabVal){
            vm.activeTabId = tabVal;
            vm.isShow = tabVal;
        };

        $scope.$watch('isActualLang', function(ov, nv) {
            $scope.setLang(localStorage.getItem("LANG"));
        });


        vm.fnInstructions();
        vm.fnRecupMetier();
        vm.fnModelMetierAll();

    });
