angular
    .module('myApp')
    .controller('mainController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout) {
        //Setup view model object
        console.log('main CONTROLLER');
        $scope.isLogged = false;
        $scope.isActualLang = "FRANCAIS";

        Data.get('session.php').then(function (results) {
            if(results.uid){
                $scope.isLogged = true;
                $scope.utilisateur = results.name;
            }
            $scope.sessionInfo = results;
            $location.path('home');


        });

       /* $scope.doLogin = function (customer) {
            Data.post('login', {
                customer: customer
            }).then(function (results) {
                    console.log("RESULTS", results);
                    Data.toast(results);
                    if (results.status == "success" && $location.path() != '/fichetech') {
                            $location.path('home');
                    }
                });
        };*/
       bc0b2dd

        $scope.loginModal = function() {
         $("#myModal").modal();
       };

        $scope.doLogin = function(customer){
            Data.post('loginClient.php', {
                customer: customer
            }).then(function (results) {
                    Data.toast(results);
                    if (results.status == "success") {
                        if(results.uid){
                            if($location.path() != '/fichetech'){
                                $location.path('home');
                            }

                            $scope.isLogged = true;
                            $scope.utilisateur = results.name;

                            $timeout(function() {
                                $scope.isLogged = true;
                                $scope.utilisateur = results.name;
                            }, 0);

                            console.log($scope.isLogged, " logging dunction");
                        }

                        toastr.options.positionClass = 'toast-top-right';
                        toastr.success('Bienvenue ' + results.name);

                    }
                    else{

                        bootbox.alert("Les parametres de connection ne correspond pas à un utilisateur.", function(){
                            $scope.loginModal();
                        })
                    }
                });
        }

        $scope.signUp = function (customer) {
            console.log("customer" , customer);
            Data.post('signupClient.php', {
                customer: customer
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    $location.path('home');
                }
            });
        };

        $scope.logout = function () {
            bootbox.dialog({
                message: "Voulez-vous deconnecter?",
                title: "Deconnexion",
                buttons: {
                    annuler: {
                        label: "Non",
                        className: "btn-secondary",
                        callback: function() {
                            console.log("Annulation");
                        }
                    },
                    valider: {
                        label: "Oui",
                        className: "btn-success",
                        callback: function() {
                            Data.get('logout').then(function (results) {
                                Data.toast(results);
                                $scope.isLogged = false;
                                $scope.utilisateur = "";
                                $location.path('home');
                                bootbox.alert("Vous êtes déconnecté.");
                            });
                        }
                    }
                }
            });
        };

        $scope.fnClickLang = function() {
          $('#modalLanguage').modal();
            var langSel = localStorage.getItem('LANG');

                if(langSel == "EN") {
                    $("#en").prop("checked", true)
                }
                else if(langSel == "FR") {
                    $("#fr").prop("checked", true)
                }
                else if(langSel == "ES") {
                    $("#es").prop("checked", true)
                }
                else if(langSel == "AL") {
                    $("#al").prop("checked", true)
                }
                else if(langSel == "IT") {
                    $("#it").prop("checked", true)
                }
        };

        $scope.quitModal = function() {
            $('#modalLanguage').modal('hide');
        };

        $scope.fnValidLang = function() {
            if($('#fr').prop('checked')) {
                localStorage.setItem('LANG', 'FR');
            }
            if($('#en').prop('checked')) {

                localStorage.setItem('LANG', 'EN');
            }
            if($('#es').prop('checked')) {

                localStorage.setItem('LANG', 'ES');
            }
            if($('#al').prop('checked')) {

                localStorage.setItem('LANG', 'AL');
            }
            if($('#it').prop('checked')) {

                localStorage.setItem('LANG', 'IT');
            }

            $http({
                method: 'GET',
                params: {mode:3, lang:localStorage.getItem('LANG')},
                url: 'api/v1/langueCRUD.php'
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.langue = angular.copy(response.data);
                $scope.$apply();
            }, function errorCallback(error) {
                console.log(error);
            });
        }
    });
