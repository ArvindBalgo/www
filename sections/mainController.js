angular
    .module('myApp')
    .controller('mainController', function($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, $translate) {
        //Setup view model object
        $scope.isLogged = false;
        var modeLang = localStorage.getItem("LANG");
        $scope.isActualLang = "FRANCAIS";
        if(modeLang == "EN") {
            $scope.isActualLang = "ENGLISH";
        }
        else if(modeLang == "FR"){
            $scope.isActualLang = "FRANCAIS";
        }
        else if(modeLang == "ES") {
            $scope.isActualLang = "ESPAÑOL";
        }
        else if(modeLang == "IT") {
            $scope.isActualLang = "ITALIANO";
        }
        else if(modeLang == "AL") {
            $scope.isActualLang = "DEUTSCH";
        }

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
        };

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

        $scope.fnClickTest = function() {
            var langSel = localStorage.getItem('LANG');

            if(langSel == "EN") {
                $scope.isActualLang = "ENGLISH";
            }
            else if(langSel == "FR") {
                $scope.isActualLang = "FRANCAIS";
                }
            else if(langSel == "ES") {
                $scope.isActualLang = "ESPAÑOL";
            }
            else if(langSel == "AL") {
                $scope.isActualLang = "DEUTSCH";
            }
            else if(langSel == "IT") {
                $scope.isActualLang = "ITALIANO";
            }

        }

        $scope.fnClickLang = function() {
          $('#modalLanguage').modal();
            var langSel = localStorage.getItem('LANG');

                if(langSel == "EN") {
                    $scope.isActualLang = "ENGLISH";
                    $("#en").prop("checked", true)
                }
                else if(langSel == "FR") {
                    $scope.isActualLang = "FRANCAIS";
                    $("#fr").prop("checked", true)
                }
                else if(langSel == "ES") {
                    $scope.isActualLang = "ESPAÑOL";
                    $("#es").prop("checked", true)
                }
                else if(langSel == "AL") {
                    $scope.isActualLang = "DEUTSCH";
                    $("#al").prop("checked", true)
                }
                else if(langSel == "IT") {
                    $scope.isActualLang = "ITALIANO";
                    $("#it").prop("checked", true)
                }
        };

        $scope.quitModal = function() {
            $('#modalLanguage').modal('hide');
        };

        $scope.fnValidLang = function() {
            if($('#fr').prop('checked')) {
                localStorage.setItem('LANG', 'FR');
                $scope.isActualLang = "FRANCAIS";
            }
            if($('#en').prop('checked')) {

                localStorage.setItem('LANG', 'EN');
                $scope.isActualLang = "ENGLISH";
            }
            if($('#es').prop('checked')) {

                localStorage.setItem('LANG', 'ES');
                $scope.isActualLang = "ESPAÑOL";
            }
            if($('#al').prop('checked')) {

                localStorage.setItem('LANG', 'AL');
                $scope.isActualLang = "DEUTSCH";
            }
            if($('#it').prop('checked')) {

                localStorage.setItem('LANG', 'IT');
                $scope.isActualLang = "ITALIANO";
            }
            $translate.use(localStorage.getItem('LANG'));
            $('#modalLanguage').modal('hide');

        };

        $(window).unload(function () {
            localStorage.removeItem("LANG");
        });

    });
