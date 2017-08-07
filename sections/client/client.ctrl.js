angular
    .module('myApp')
    .controller('clientController', function ($scope, $location, $timeout, messages, $http, Data, $translate, NgTableParams) {
        var vm = this;
        $scope.isFiche = true;
        var lang = sessionStorage.getItem("LANG");
        vm.isDiv = false;
        vm.isFrance = false;
        vm.password = "";
        vm.password1 = "";
        vm.password2 = "";
        vm.infoClient = [];

        $http({
            method: 'GET',
            params: {mode: 3, lang: lang},
            url: 'api/v1/langueCRUD.php'
        }).then(function successCallback(response) {
            $scope.langue = angular.copy(response.data);
        });

        $http({
            method: 'POST',
            data: $.param({mode: 6}),
            url: 'api/v1/commande.php',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            vm.myOrders = response.data;

            vm.tableParams = new NgTableParams({}, {
                dataset: vm.myOrders
            });
        });

        if (lang == "" || lang == null) {
            vm.isFrance = false;
        }
        else if (lang == 'FR') {
            vm.isFrance = true;
        }

        $scope.setLang = function (langKey) {
            $translate.use(langKey);
        };

        $scope.$watch('isActualLang', function (ov, nv) {
            $scope.setLang(sessionStorage.getItem("LANG"));
            $http({
                method: 'GET',
                params: {mode: 3, lang: sessionStorage.getItem("LANG")},
                url: 'api/v1/langueCRUD.php'
            }).then(function successCallback(response) {
                $scope.langue = angular.copy(response.data);
            });
        });

        vm.fnRemoveModal = function () {
            $('#detailsCommande').modal('hide');
        };

        vm.fnValidInfo = function () {
            if (vm.infoClient.company_name == "" || vm.infoClient.email == "" || vm.infoClient.surname == "" || vm.infoClient.name == "" | vm.infoClient.phone == "" | vm.infoClient.address == "" || vm.infoClient.city == "" || vm.infoClient.postalcode == "" || vm.infoClient.pays == "") {
                bootbox.alert("Error");
            }
            else {
                $http({
                    method: 'POST',
                    data: $.param({
                        mode: 9,
                        company_name: vm.infoClient.company_name,
                        surname: vm.infoClient.surname,
                        name: vm.infoClient.name,
                        address: vm.infoClient.address,
                        phone: vm.infoClient.phone,
                        city: vm.infoClient.city,
                        postalcode: vm.infoClient.postalcode,
                        pays: vm.infoClient.pays,
                        siret: vm.infoClient.siret
                    }),
                    url: 'api/v1/commande.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                    toastr.options.positionClass = 'toast-top-right';
                    bootbox.alert("Info sauvegarder");
                    vm.fnChangeDiv("params");
                });
            }


        };

        vm.fnLoadModal = function (id) {
            $http({
                method: 'POST',
                data: $.param({mode: 7, id: id}),
                url: 'api/v1/commande.php',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                $('#detailsCommande').modal('show');
                vm.infoCommandes = new NgTableParams({}, {
                    dataset: response.data
                });
            });
        };

        vm.fnToggleTab = function (val) {
            if (Number(val) == 1) {
                if ($('#collapseOne:visible').length == 0) {
                    $("#collapseOne").show();
                }
                else {
                    $("#collapseOne").hide();
                }
                $("#collapseTwo").hide();
                $("#collapseThree").hide();
                $("#collapseFour").hide();
            }
            else if (Number(val) == 2) {
                if ($('#collapseTwo:visible').length == 0) {
                    $("#collapseTwo").show();
                }
                else {
                    $("#collapseTwo").hide();
                }
                $("#collapseOne").hide();
                $("#collapseThree").hide();
                $("#collapseFour").hide();
            }
            else if (Number(val) == 3) {
                if ($('#collapseThree:visible').length == 0) {
                    $("#collapseThree").show();
                }
                else {
                    $("#collapseThree").hide();
                }
                $("#collapseOne").hide();
                $("#collapseTwo").hide();
                $("#collapseFour").hide();
            }
            else if (Number(val) == 4) {
                if ($('#collapseFour:visible').length == 0) {
                    $("#collapseFour").show();
                }
                else {
                    $("#collapseFour").hide();
                }
                $("#collapseOne").hide();
                $("#collapseTwo").hide();
                $("#collapseThree").hide();
            }
        };

        vm.fnChangeDiv = function (flag) {
            if (flag == 'commandes') {
                $("#espaceClient").show();
                $("#divPass").hide();
                $("#divParams").hide();
            }
            else if (flag == 'password') {
                $("#espaceClient").hide();
                $("#divPass").show();
                $("#divParams").hide();
            }
            else if (flag == 'params') {

                $http({
                    method: 'POST',
                    data: $.param({mode: 8}),
                    url: 'api/v1/commande.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                    vm.infoClient = response.data;
                    $("#espaceClient").hide();
                    $("#divPass").hide();
                    $("#divParams").show();
                });
            }
        };

        vm.fnVerifPass = function () {
            if (vm.password == "" || vm.password1 == "" || vm.password2 == "") {
                bootbox.alert($scope.langue.msg_error);
                return;
            }
            else if (vm.password2 !== vm.password1) {
                bootbox.alert($scope.langue.msg_error1);
                return;
            }
            $http({
                method: 'POST',
                data: $.param({password: vm.password, password1: vm.password1, password2: vm.password2}),
                url: 'api/v1/updatePass.php',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                if (response.data == 0) {
                    bootbox.alert($scope.langue.msg_error);
                    return;
                }
                else {
                    bootbox.alert($scope.langue.save_success);
                    return;
                }
            });
        }
    });
