angular
    .module('myApp')
    .controller('factureValidController', function ($scope, $location, $timeout, messages, $http, Data, $translate) {
        var vm = this;
        vm.title = "";
        vm.contenu = "";
        vm.id = 0;
        vm.arrContents = [];
        vm.isFrance = false;

        $scope.setLang = function (langKey) {
            // You can change the language during runtime
            $translate.use(langKey);
        };

        $scope.$watch('isActualLang', function (ov, nv) {
            $scope.setLang(sessionStorage.getItem("LANG"));
        });

        vm.fnInit = function () {
            vm.arrProduits = [];
            var count = Number(sessionStorage.getItem("produitCount"));
            var arrProds = JSON.parse(sessionStorage.getItem("arrProds"));
            if (arrProds != null) {
                angular.forEach(arrProds, function (value) {
                    vm.arrProduits.push(JSON.parse(sessionStorage.getItem(value)));
                });
            }

            var arrListCheckoutProds = new Array();
            angular.forEach(vm.arrProduits, function (value, key) {
                arrListCheckoutProds[key] = {};
                arrListCheckoutProds[key][value.idn_key] = value.random_str;
                // arrListCheckoutProds.push(value.random_str);
            });

            var valCoupon = sessionStorage.getItem("coupon");
            if (!valCoupon) {
                valCoupon = "";
            }
            $http({
                method: 'GET',
                params: {mode: 20, list: JSON.stringify(arrListCheckoutProds), coupon: valCoupon},
                url: 'api/v1/sampleControl.php'
            }).then(function successCallback(response) {
                    vm.arrProduits = [];
                    sessionStorage.clear();
                    toastr.success("Order Confirmed");

                }
                , function errorCallback(error) {
                    console.log(error);
                });
        };

        vm.fnLoadPub = function () {
            var langSel = sessionStorage.getItem('LANG');
            if (langSel == "" || langSel == null) {
                return;
            }
            $http({
                method: 'GET',
                params: {mode: 3, pays: langSel},
                url: 'api/v1/produitCRUD.php'
            }).then(function successCallback(response) {
                $scope.pub_src = response.data.link;
            }, function errorCallback(error) {

            });
        }
        vm.fnLoadPub();
       // vm.fnInit();
    });
