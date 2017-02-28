angular
    .module('adminApp')
    .controller('pubController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, FileUploader) {
        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        $scope.header = "Bande publicité";
        vm.titre = "Bande Publicitaire";

        var uploader = $scope.uploader = new FileUploader({
            url: 'api/uploadPub.php'
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
            var selPays = "";
            selPays = $('input[name=selLang]:checked').val();

            item.formData = [{pays:selPays}];
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            vm.fnInit();

        };

        vm.fnInit = function() {
            $('body').addClass("spinner");
            var selPays = "";
            selPays = $('input[name=selLang]:checked').val();
            $http({
                method: 'GET',
                params: {mode:3, pays: selPays},
                url: 'api/v1/produitCRUD.php'
            }).then(function successCallback(response) {
                vm.objPub = response.data;
                $('body').removeClass("spinner");
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnRadioPays = function($pays) {
            vm.fnInit();
        }

        vm.fnInit();
    });
