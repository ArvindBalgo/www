var app = angular.module('myApp', ['ngRoute', 'ngAnimate', 'toaster','angularFileUpload', 'ngSanitize']);

app.config(['$routeProvider',
  function ($routeProvider) {
      console.log("rouet here");
        $routeProvider.
        when('/home', {
            title: 'Home',
            templateUrl: 'sections/home/home.tpl.html',
            controller: 'HomeController as home'
        })
        .when('/fichetech', {
            title: 'Fiche Technique',
            templateUrl: 'sections/fiche/fiche.tpl.html',
            controller: 'ficheController as fiche'
        })
        .when('/logout', {
                title: 'Logout',
                templateUrl: 'partials/login.html',
                controller: 'logoutCtrl'
            })
        .when('/signup', {
                title: 'Signup',
                templateUrl: 'partials/signup.html',
                controller: 'authCtrl'
            })
        .when('/dashboard', {
                title: 'Dashboard',
                templateUrl: 'partials/dashboard.html',
                controller: 'authCtrl'
            })
        .when('/', {
                title: 'Home',
                templateUrl: 'sections/home/home.tpl.html',
                controller: 'HomeController as home'
            })
        .when('/admin', {
                title:'admin',
                templateUrl:'sections/admin/admin.tpl.html',
                controller:'adminController as admin'
            })
        .when('/apropos', {
            title:'Qui sommes nous?',
            templateUrl:'sections/apropos/apropos.tpl.html',
            controller:'aproposController as apropos'
        })
        .when('/conditionvente', {
            title:'Condition de vente',
            templateUrl:'sections/conditionvente/conditionvente.tpl.html',
            controller:'conditionventeController as vente'
        })
        .when('/utilisation', {
            title:"Mentions d'utilisation",
            templateUrl:'sections/utilisation/utilisation.tpl.html',
            controller:'utilisationController as utilisation'
        })
        .when('/legale', {
            title:'Mentions légales',
            templateUrl:'sections/legale/legale.tpl.html',
            controller:'legaleController as legale'
        })
        .when('/client', {
            title:'Espace client',
            templateUrl:'sections/client/client.tpl.html',
            controller:'clientController as client'
        })
        .otherwise({
                redirectTo: '/home'
            });
  }])
    .run(function ($rootScope, $location, Data) {
        console.log('error checkgin');
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.authenticated = false;
            Data.get('session.php').then(function (results) {
                if (results.uid) {
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.uid;
                    $rootScope.name = results.name;
                    $rootScope.email = results.email;
                    $rootScope.type = results.admin;
                } else {
                    /*var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login') {

                    } else {
                        $location.path("/home");
                    }*/
                }
                //$location();
            });
        });
    });