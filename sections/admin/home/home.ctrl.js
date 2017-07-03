angular
    .module('adminApp')
    .controller('homeController', function ($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {
        console.log("HOME CONtroller admin partt");
        var vm = this;
        vm.listOrders = [];
        vm.listOrdersOrig = [];
        vm.rechKey = "";

        vm.states = [
                { id: 'NEW', name: 'Nouveau' },
                { id: 'BON_TIRER', name: 'Bon à tirer' },
                { id: 'MONTAGE_MAQUETTE', name: 'Montage et maquette' },
                { id: 'IMPRESSION', name: 'Impression' },
                { id: 'PELLICULAGE_VERNISSAGE', name: 'Pellicullage et vernissage' },
                { id: 'COUPE_DECOUPE', name: 'Coupe et decoupe' },
                { id: 'FACONNAGE', name: 'Façonnage' },
                { id: 'LIVRAISON', name: 'Livraison' },
                { id: 'TERMINER', name: 'Terminer' },
                { id: 'ARCHIEVE', name: 'Archiver' },
                { id: 'REJECT', name: 'Rejeter' }
            ];


        $scope.fnSession = function () {
            Data.get('session.php').then(function (results) {
                if (results.uid) {
                    vm.fnGetOrders();

                } else {
                    $location.path("/login");
                }
            });
        }

        $scope.fnLogout = function () {
            Data.get('logout.php').then(function (results) {
                $scope.sessionInfo = results;
                console.log(results, 'results from admin');

                $scope.fnSession();
            });
            //$location();
        };

        vm.fnGetOrders = function() {
            $http({
                method  : "POST",
                url     : "/api/v1/commande.php",
                data: $.param({mode:1}),
                headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    vm.listOrdersOrig = data;
                    vm.listOrders = data;
                })
                .error(function (data, status, headers, config) {
                });
        };
        vm.fnToggleEye = function(item) {
            if(!item.displayDetails) {
                $http({
                    method  : "POST",
                    url     : "/api/v1/commande.php",
                    data: $.param({mode:2, idOrder:item.id}),
                    headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
                })
                    .success(function (data, status, headers, config) {
                        console.log(data);
                        item.details = data;
                    })
                    .error(function (data, status, headers, config) {
                    });
            }
            item.displayDetails = !item.displayDetails;
        };

        vm.fnSetStage = function(item) {
            $http({
                method  : "POST",
                url     : "/api/v1/commande.php",
                data: $.param({mode:3, idOrder:item.id, status:vm.etat.id}),
                headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    vm.listOrdersOrig = data;
                    vm.listOrders = data;
                    vm.etat = "";
                    vm.fnFilter();
                })
                .error(function (data, status, headers, config) {
                });
        };
        vm.fnRecup = function(item) {
            $http({
                method  : "POST",
                url     : "/api/v1/commande.php",
                data: $.param({mode:5, idOrder:item.id, status:'INPROCESS'}),
                headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    vm.listOrdersOrig = data;
                })
                .error(function (data, status, headers, config) {
                });
        };

        vm.fnFilter = function() {
            if(vm.rechKey == '' ) {
                return;
            }
            var arrOrders = [];
            var strName = "";
            angular.forEach(vm.listOrdersOrig, function(value) {
                strName = value.name + ' ' + value.surname;
                if((value.surname.toLowerCase()).indexOf(vm.rechKey.toLowerCase()) >= 0 || (value.name.toLowerCase()).indexOf(vm.rechKey.toLowerCase()) >= 0 || value.codepostale.indexOf(vm.rechKey.toLowerCase()) >= 0  || (strName.toLowerCase()).indexOf(vm.rechKey.toLowerCase())>=0){
                    arrOrders.push(value);
                }
            });
            vm.listOrders = angular.copy(arrOrders);
        };

        $scope.fnSession();
    });

