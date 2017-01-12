angular
    .module('adminApp')
    .controller('typeSupportController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, FileUploader, $compile) {

        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }
        });

        var vm = this;
        $scope.header = "Type de support papier";

        vm.modelLibelle = "";
        vm.editModelLibelle = "";
        vm.editObj = {};

        vm.formatCell = function(){
            var trash = "<button type='button' class='btn btn-default btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 1)'><i class='glyphicon glyphicon-trash'></i></button>";
            var edit = "<button type='button' class='btn btn-info btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 2)'><i class='glyphicon glyphicon-pencil'></i></button>";
            return edit+trash;
        }
        vm.columns = [  { name:'Libelle',field: 'description',enableHiding:false ,cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
            return 'cssLibelle';
        }},
            { name:'Action', field: 'active',enableFiltering:false,width:'200', cellTemplate: vm.formatCell() ,enableHiding:false}

        ];
        $scope.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            columnDefs: vm.columns,
            rowHeight:50
        };

        vm.fnRecupAll = function(){
            $http({
                method: 'GET',
                params: {mode:15},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.gridOptions.data = response.data;
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnCrudMetier = function(opt) {
            if(opt == 0) {
                $('#ajoutSupport').modal();
            }
        };

        vm.fnQuitter = function() {
            $('#ajoutSupport').modal('hide');
            $('#editSupport').modal('hide');
        };

        vm.fnAjouter = function() {
            if(vm.modelLibelle.trim() == ""){
                bootbox.alert("<div style='text-align: center; font-weight: bold; font-size: larger'>Libelle vide!!!!</div>");
                return;
            }
            $http({
                method: 'GET',
                params: {mode:14, description:vm.modelLibelle.trim()},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.gridOptions.data = response.data;
                vm.modelLibelle = "";
                vm.fnQuitter();
            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.fnEdit  = function(){
            console.log(vm.editObj , " edited object::::   " , vm.editModelLibelle);
            if(vm.editModelLibelle.trim() == "") {
                bootbox.alert("Libelle vide!!!!");
                return;
            }
            $http({
                method: 'GET',
                params: {mode:16, description:vm.editModelLibelle.trim(), id:vm.editObj.id},
                url: 'api/v1/info.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.gridOptions.data = response.data;
                vm.modelLibelle = "";
                vm.editModelLibelle = "";
                vm.editObj  = {};
                vm.fnQuitter();
            }, function errorCallback(error) {
                console.log(error);
            });

        };

        $scope.edit  = function (grid, row, opt){
            if(opt == 1) {
                //delete
                bootbox.confirm("Confirmez-vous la suppresion de cette ligne <b>"+row.description+"</b>?", function(result) {
                    if(result){
                        console.log(row.id);
                        console.log("confirmation to delete");

                        $http({
                            method: 'GET',
                            params: {mode:17, id:row.id},
                            url: 'api/v1/info.php'
                        }).then(function successCallback(response) {
                            console.log(response.data);
                            $scope.gridOptions.data = response.data;
                            vm.fnQuitter();
                        }, function errorCallback(error) {
                            console.log(error);
                        });

                    }
                })
            }
            else if (opt == 2){
                //edit
                console.log(row);
                vm.editModelLibelle = row.description;
                vm.editObj = row;
                $('#editSupport').modal();
            }
        };

        $(document).ready(function(){
            vm.fnRecupAll();
        })


    });

