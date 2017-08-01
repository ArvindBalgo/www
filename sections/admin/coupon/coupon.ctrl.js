angular
    .module('adminApp')
    .controller('couponController', function ($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, $interval) {
        Data.get('session.php').then(function (results) {
            if (results.uid) {

            } else {
                $location.path("/login");
            }

            //$location();
        });

        var vm = this;
        vm.arrSubscribers = [];
        $scope.header = "Coupon discount";
        vm.arrSubscribers = [];
        vm.codeCoupon = "";
        vm.discountCoupon = "";
        vm.dateDebut = "";
        vm.arrCoupon = [];
        vm.dateFin = "";

        vm.formatCell = function (grid, row, col, rowRenderIndex, colRenderIndex) {
            var content = "<button id='row.entity.id' data-ng-model='row.entity.id' type='button' class='btn btn-default btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-click='grid.appScope.edit(grid, row.entity, 1)'><i class='glyphicon glyphicon-blackboard'></i></button>";
            var del = "<button type='button' class='btn btn-default btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-show='grid.appScope.show(grid, row.entity, 1)' ng-click='grid.appScope.del(grid, row.entity, 1)'><i class='glyphicon glyphicon-trash'></i></button>";

            var mailList = "<button type='button' class='btn btn-default btn-circle' style='margin-left: 5px;margin-top: 5px;' ng-show='grid.appScope.show(grid, row.entity, 1)' ng-click='grid.appScope.mail(grid, row.entity, 1)'><i class='glyphicon glyphicon-inbox'></i></button>";

            return content + del + mailList;
        };

        $scope.show = function (grid, row, opt) {
            if (row.emailing_flag == 0) {
                return true;
            }
            return false;
        };

        $scope.del = function (grid, row, opt) {
            $http({
                method: "POST",
                url: "/api/v1/coupon.php",
                data: $.param({mode: 5, id: row.id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    vm.fnGetCoupons();
                })
                .error(function (data, status, headers, config) {
                });

        };

        $scope.mail = function (grid, row, opt) {
            $('body').addClass("spinner");
            $http({
                method: "POST",
                url: "/api/v1/coupon.php",
                data: $.param({mode: 6, id: row.id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    vm.fnGetCoupons();
                    $('body').removeClass("spinner");
                })
                .error(function (data, status, headers, config) {
                });
        };

        $scope.edit = function (grid, row, opt) {
            console.log(row);
            vm.arrCoupon.codeCoupon = row.coupon_code;
            vm.arrCoupon.discountCoupon = row.val;
            vm.arrCoupon.dateDebut = row.date_start;
            vm.arrCoupon.dateFin = row.date_end;
            $http({
                method: "POST",
                url: "/api/v1/coupon.php",
                data: $.param({mode: 4, id: row.id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    $('#modalCoupons').modal();
                    $scope.gridInfoOptions.data = data;
                })
                .error(function (data, status, headers, config) {
                });


        };

        vm.formatCellDetail = function () {
            var content = "<button class='btn btn-sm btn-default' ng-click='grid.appScope.edit(grid, row.entity, 1)'>Ajouter</button>";
            return content;
        }


        vm.columns = [{
            name: 'Coupon',
            field: 'coupon_code',
            enableHiding: false,
            cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                return 'cssLibelle';
            }
        },
            {
                name: 'Date Debut',
                field: 'date_start',
                enableFiltering: false,
                enableHiding: false
            },
            {name: 'Date Fin', field: 'date_end', enableFiltering: false, enableHiding: false},
            {name: 'Valeur', field: 'val', enableFiltering: false, enableHiding: false},
            {name: 'Nombre Utiisateurs', field: 'nb_users', enableFiltering: false, enableHiding: false},
            {name: 'Nombre utilisé', field: 'nb_users_used', enableFiltering: false, enableHiding: false},
            {name: 'Détails', field: '', cellTemplate: vm.formatCell(), enableFiltering: false, enableHiding: false}

        ];

        vm.columnDetails = [{
            name: 'Utilisateur',
            field: 'fullname',
            enableHiding: false,
            cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                return 'cssLibelle';
            }
        },
            {
                name: 'Email',
                field: 'email',
                enableHiding: false
            }
        ];

        vm.columnInfo = [{
            name: 'Utilisateur',
            field: 'fullname',
            enableHiding: false,
            cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                return 'cssLibelle';
            }
        },
            {
                name: 'Email',
                field: 'email',
                enableHiding: false
            },
            {
                name: 'Flag',
                field: 'flag',
                enableHiding: false
            }
        ];

        $scope.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            columnDefs: vm.columns,
            rowHeight: 50
        };

        $scope.gridDetailsOptions = {
            enableRowSelection: false,
            enableSelectionBatchEvent: true,
            enableSelectAll: true,
            enableSorting: true,
            enableFiltering: true,
            columnDefs: vm.columnDetails,
            rowHeight: 50
        };

        $scope.gridInfoOptions = {
            enableSelectAll: true,
            enableSorting: true,
            enableFiltering: true,
            columnDefs: vm.columnInfo,
            rowHeight: 50
        };

        $scope.gridInfoOptions.onRegisterApi = function (gridApi) {
            $interval(function () {
                $scope.gridApi.core.handleWindowResize();
            }, 500, 10);
        }
        $scope.gridDetailsOptions.onRegisterApi = function (gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                console.log(row)
                if (row.isSelected) {
                    vm.arrSubscribers.push(row.entity.id);
                }
                else {
                    console.log(vm.arrSubscribers.indexOf(row.entity.id));
                    vm.arrSubscribers.splice(vm.arrSubscribers.indexOf(row.entity.id), 1);
                }
                console.log(vm.arrSubscribers);
            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                console.log(rows);
                angular.forEach(rows, function (val) {
                    if (val.isSelected) {
                        vm.arrSubscribers.push(val.entity.id);
                    }
                    else {
                        vm.arrSubscribers.splice(vm.arrSubscribers.indexOf(val.entity.id), 1);
                    }
                });
                console.log(vm.arrSubscribers);
                var msg = 'rows changed ' + rows.length;
                console.log(msg);
            });

        };

        $scope.gridOptions.data = [];
        $scope.gridDetailsOptions.data = [];

        vm.fnNew = function () {
            $http({
                method: "POST",
                url: "/api/v1/coupon.php",
                data: $.param({mode: 2}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    $scope.gridDetailsOptions.multiSelect = true;
                    $scope.gridDetailsOptions.data = data;
                    vm.arrSubscribers = [];
                    vm.codeCoupon = "";
                    vm.discountCoupon = "";
                    vm.dateDebut = "";
                    vm.dateFin = "";
                    $('#modalDetails').modal();
                })
                .error(function (data, status, headers, config) {
                });


        }

        vm.fnGetCoupons = function () {
            $http({
                method: "POST",
                url: "/api/v1/coupon.php",
                data: $.param({mode: 1}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    $scope.gridOptions.data = data;
                })
                .error(function (data, status, headers, config) {
                });
        };


        vm.fnQuitter = function () {
            $('#modalDetails').modal('hide');
            $('#modalCoupons').modal('hide');
        };

        vm.fnValid = function () {
            if (vm.codeCoupon == "" || vm.discountCoupon == "" || vm.dateDebut == "" || vm.dateFin == "" || vm.arrSubscribers.length <= 0) {
                bootbox.alert("Toutes les champs doivente etre rensigné");
                return;
            }

            $http({
                method: "POST",
                url: "/api/v1/coupon.php",
                data: $.param({
                    mode: 3,
                    code: vm.codeCoupon,
                    discount: vm.discountCoupon,
                    dateDebut: moment(vm.dateDebut).format("YYYY-MM-DD"),
                    dateFin: moment(vm.dateFin).format("YYYY-MM-DD"),
                    arrUsers: JSON.stringify(vm.arrSubscribers)
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    vm.fnGetCoupons();
                    $('#modalDetails').modal('hide');
                })
                .error(function (data, status, headers, config) {
                });
        };

        vm.fnGetCoupons();
        /*$timeout(function(){
         $scope.gridOptions.data = arrFiltered
         }, 0);*/

    });
