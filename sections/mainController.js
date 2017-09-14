angular
    .module('myApp')
    .controller('mainController', function ($scope, $rootScope, $routeParams, $location, $http, Data, $timeout, $translate) {
        $scope.isLogged = false;
        $scope.isCommercial = false;
        var modeLang = sessionStorage.getItem("LANG");
        $scope.isActualLang = "FRANCAIS";
        if (modeLang == "EN") {
            $scope.isActualLang = "ENGLISH";
        }
        else if (modeLang == "FR") {
            $scope.isActualLang = "FRANCAIS";
        }
        else if (modeLang == "ES") {
            $scope.isActualLang = "ESPAÑOL";
        }
        else if (modeLang == "IT") {
            $scope.isActualLang = "ITALIANO";
        }
        else if (modeLang == "AL") {
            $scope.isActualLang = "DEUTSCH";
        }

        Data.get('session.php').then(function (results) {
            if (results.uid) {
                $scope.isLogged = true;
                $scope.isCommercial = false;
                if (results.salesman == 1) {
                    $scope.isCommercial = true;
                }

                $scope.utilisateur = results.name;
            }
            else {
                $scope.isLogged = false;
                $scope.isCommercial = false;
            }
            $scope.sessionInfo = results;
        });

        $scope.loginModal = function () {
            $("#myModal").modal();
        };

        $scope.newClientModal = function () {
            $("#newClient").modal();
        };

        $scope.doLogin = function (customer) {
            Data.post('loginClient.php', {
                customer: customer
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    if (results.uid) {
                        if ($location.path().indexOf('fichetech') == -1) {
                            $location.path('home');
                        }

                        $scope.isLogged = true;
                        $scope.isCommercial = false;
                        if (results.salesman == 1) {
                            $scope.isCommercial = true;
                        }
                        $scope.utilisateur = results.name;
                        sessionStorage.setItem("token", results.token);

                        $timeout(function () {
                            $scope.isLogged = true;
                            $scope.isCommercial = false;
                            if (results.salesman == 1) {
                                $scope.isCommercial = true;
                            }
                            $scope.utilisateur = results.name;
                        }, 0);
                    }

                    toastr.options.positionClass = 'toast-top-right';
                    toastr.success('Bienvenue ' + results.name);

                }
                else {

                    bootbox.alert("Les parametres de connection ne correspond pas à un utilisateur.", function () {
                        $scope.loginModal();
                    })
                }
            });
        };

        $scope.signUp = function (customer) {
            customer.pays = $('#userPays').val();
            Data.post('signupClient.php', {
                customer: customer
            }).then(function (results) {
                Data.toast(results);
                $('#newClient').modal('hide');
                $(".modal-backdrop").remove();
                if (results.status == 1) {
                    $location.path('home');
                }
            });
        };

         $scope.signUp1 = function (customer) {
                    customer.pays = $('#userPays').val();
                    Data.post('signupClient2.php', {
                        customer: customer
                    }).then(function (results) {
                        Data.toast(results);
                        if(results.status =='error') {
                            bootbox.alert('Erreur sur la page');
                            return;
                        }
                        $('#newClient').modal('hide');
                        $(".modal-backdrop").remove();
                        if (results.status == 1) {
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
                        callback: function () {
                        }
                    },
                    valider: {
                        label: "Oui",
                        className: "btn-success",
                        callback: function () {
                            Data.get('logout.php').then(function (results) {
                                Data.toast(results);
                                $scope.isLogged = false;
                                $scope.isCommercial = false;
                                $scope.utilisateur = "";
                                $location.path('home');
                                bootbox.alert("Vous êtes déconnecté.");
                            });
                        }
                    }
                }
            });
        };

        $scope.fnClickTest = function () {
            var langSel = sessionStorage.getItem('LANG');

            if (langSel == "EN") {
                $scope.isActualLang = "ENGLISH";
            }
            else if (langSel == "FR") {
                $scope.isActualLang = "FRANCAIS";
            }
            else if (langSel == "ES") {
                $scope.isActualLang = "ESPAÑOL";
            }
            else if (langSel == "AL") {
                $scope.isActualLang = "DEUTSCH";
            }
            else if (langSel == "IT") {
                $scope.isActualLang = "ITALIANO";
            }

        }

        $scope.fnClickLang = function () {
            $('#modalLanguage').modal();
            var langSel = sessionStorage.getItem('LANG');
            if (langSel == "EN") {
                $scope.isActualLang = "ENGLISH";
                $("#en").prop("checked", true)
            }
            else if (langSel == "FR") {
                $scope.isActualLang = "FRANCAIS";
                $("#fr").prop("checked", true)
            }
            else if (langSel == "ES") {
                $scope.isActualLang = "ESPAÑOL";
                $("#es").prop("checked", true)
            }
            else if (langSel == "AL") {
                $scope.isActualLang = "DEUTSCH";
                $("#al").prop("checked", true)
            }
            else if (langSel == "IT") {
                $scope.isActualLang = "ITALIANO";
                $("#it").prop("checked", true)
            }
        };

        $scope.quitModal = function () {
            $('#modalLanguage').modal('hide');
        };

        $scope.fnValidLang = function () {
            if ($('#fr').prop('checked')) {
                sessionStorage.setItem('LANG', 'FR');
                $scope.isActualLang = "FRANCAIS";
            }
            if ($('#en').prop('checked')) {

                sessionStorage.setItem('LANG', 'EN');
                $scope.isActualLang = "ENGLISH";
            }
            if ($('#es').prop('checked')) {

                sessionStorage.setItem('LANG', 'ES');
                $scope.isActualLang = "ESPAÑOL";
            }
            if ($('#al').prop('checked')) {

                sessionStorage.setItem('LANG', 'AL');
                $scope.isActualLang = "DEUTSCH";
            }
            if ($('#it').prop('checked')) {

                sessionStorage.setItem('LANG', 'IT');
                $scope.isActualLang = "ITALIANO";
            }
            $translate.use(sessionStorage.getItem('LANG'));
            $('#modalLanguage').modal('hide');

        };
    });
