app.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
    console.log('test tese');
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    $scope.doLogin = function (customer) {
        Data.post('login', {
            customer: customer
        }).then(function (results) {
                console.log("RESULTS", results);
            Data.toast(results);
            if (results.status == "success") {
                $location.path('dashboard');
            }
        });
    };
    $scope.signup = {email:'',password:'',name:'',phone:'',address:'',ville:'',codepostal:'',nosiret:''};
    $scope.signUp = function (customer) {
        Data.post('signUp', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('dashboard');
            }
        });
    };
    $scope.logout = function () {
        console.log("lkfdnlsdnflksdklfnsdlknfklsd");
        return;
        Data.get('logout').then(function (results) {
            Data.toast(results);
            $location.path('dashboard');
        });
    }
});