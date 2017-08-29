angular
    .module('adminApp')
    .controller('commerciauxController', function ($scope, $rootScope, $routeParams, $location, $http, Data, NgTableParams) {
        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        vm.arrCommercial = {
            prenom: "",
            nom: "",
            email: "",
            postalCode: "",
            telephone: "",
            address: "",
            city: "",
            min_val: 0,
            max_val: 0,
            department: ""
        };
        vm.arrModifCommercial = [];
        vm.arrPays = ["FR", "EN", "ES", "AL", "IT"];
        vm.infoCommeciaux = [];
        vm.selPays = "";

        $scope.header = "Parametrage Commerciaux";

        vm.fnNew = function () {
            $('#newCommercial').modal();
        };

        vm.fnRemoveModal = function () {
            $('#newCommercial').modal('hide');
            $('#editCommercial').modal('hide');
        };

        vm.fnGetCommercial = function () {
            $http({
                method: 'GET',
                params: {
                    mode: 2
                },
                url: 'api/v1/user_crud.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                vm.infoCommerciaux = response.data;
                vm.tableParams = new NgTableParams({}, {
                    dataset: response.data
                });
            });
        };

        vm.fnEdit = function (item) {
            console.log(item);
            vm.arrModifCommercial = item;
            vm.selPays = vm.arrModifCommercial.pays;
            $('#editCommercial').modal();
        };

        vm.fnSaveModifs = function () {
            $http({
                method: 'GET',
                params: {
                    uid: vm.arrModifCommercial.uid,
                    prenom: vm.arrModifCommercial.name,
                    nom: vm.arrModifCommercial.surname,
                    email: vm.arrModifCommercial.email,
                    postalCode: vm.arrModifCommercial.postalcode,
                    telephone: vm.arrModifCommercial.phone,
                    pays: vm.arrModifCommercial.pays,
                    address: vm.arrModifCommercial.address,
                    city: vm.arrModifCommercial.city,
                    min_val: vm.arrModifCommercial.min_val,
                    max_val: vm.arrModifCommercial.max_val,
                    department: vm.arrModifCommercial.department
                },
                url: 'api/v1/modifCommercial.php'
            }).then(function successCallback(response) {
                console.log(response);
                vm.fnRemoveModal();
                vm.fnGetCommercial();
            });

        };

        vm.fnSupp = function (item) {
            console.log(item);
        };

        vm.fnSave = function () {
            console.log(vm.arrCommercial);
            $http({
                method: 'GET',
                params: {
                    prenom: vm.arrCommercial.prenom,
                    nom: vm.arrCommercial.nom,
                    email: vm.arrCommercial.email,
                    postalCode: vm.arrCommercial.postalCode,
                    telephone: vm.arrCommercial.telephone,
                    pays: vm.arrCommercial.pays,
                    address: vm.arrCommercial.address,
                    city: vm.arrCommercial.city,
                    min_val: vm.arrCommercial.min_val,
                    max_val: vm.arrCommercial.max_val,
                    department: vm.arrCommercial.department
                },
                url: 'api/v1/signupCommercial.php'
            }).then(function successCallback(response) {
                console.log(response);
                if (response.data.status == "error") {
                    bootbox.alert("Email existant");
                }
                else {
                    vm.fnGetCommercial();
                    vm.fnRemoveModal();
                }
            });
        };

        vm.fnGetCommercial();

    });
