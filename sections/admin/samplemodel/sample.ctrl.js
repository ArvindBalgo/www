angular
    .module('adminApp')
    .controller('sampleModelController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, FileUploader) {
        console.log("Admin sample controller");

        Data.get('session').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        vm.uploadme = "";
        vm.arrData = [];
        vm.currentID = "";
        vm.nom = "";
        vm.reference = "";
        $scope.hopeData = "";
        $scope.header = "Sample Modele";

        vm.fnClick = function(){
            console.log("ID: ",$scope.hopeData);
        };
        var uploader = $scope.uploader = new FileUploader({
            url: 'api/uploadModel.php'
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
           name: $scope.hopeData
        });

        //CALLBACK

        /*uploader.onWhenAddingFileFailed = function(item , filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };*/
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
            console.info('onBeforeUploadItem', vm.reference);
            item.formData = [{id:$(".selObj").select2().val(), nom:vm.nom, reference:vm.reference}];
        };
       /* uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };*/
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        /*uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };*/

        $scope.fnModelMetier = function() {
            $http({
                method: 'GET',
                params: {mode:2},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                    console.log(response.data);
                    vm.arrData = response.data;
                }, function errorCallback(error) {
                    console.log(error);
                });
        };

        $scope.fnModelMetier();

        $(document).ready(function() {
            $(".selObj").select2();
            var $eventSelect = $(".selObj");

            $eventSelect.on("select2:select", function (e) {
                /*console.log(vm.currentID);
                console.log($(".selObj").select2().val());*/
                vm.currentID = $(".selObj").select2().val();
                console.log(vm.currentID);
            });
        });
    });