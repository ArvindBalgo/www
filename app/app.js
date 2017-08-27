var app = angular.module('myApp', ['ngRoute', 'ngAnimate', 'toaster', 'angularFileUpload', 'ngSanitize', 'pascalprecht.translate', 'ngCookies', 'ngMaterial', 'ngTable']);

app.config(['$routeProvider',
    function ($routeProvider) {
        console.log("rouet here");
        $routeProvider.when('/home', {
            title: 'Home',
            templateUrl: 'sections/home/home.tpl.html',
            controller: 'HomeController as home'
        })
            .when('/fichetech/:idcata', {
                title: 'Fiche Technique',
                templateUrl: 'sections/fiche/fiche.tpl.html',
                controller: 'ficheController as fiche'
            })
            .when('/logout', {
                title: 'Logout',
                templateUrl: 'partials/login.html',
                controller: 'logoutCtrl'
            })
            .when('/facturevalid', {
                title: 'Facture validée',
                templateUrl: 'sections/facturevalid/facturevalid.tpl.html',
                controller: 'factureValidController as factValid'
            })
            .when('/factureinvalid', {
                title: 'Facture invalid',
                templateUrl: 'sections/factureinvalid/factureinvalid.tpl.html',
                controller: 'factureInvalidController as factInvalid'
            })
            .when('/checkout', {
                title: 'Checkout',
                templateUrl: 'sections/checkout/checkout.tpl.html',
                controller: 'checkoutController as checkout'
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
                title: 'admin',
                templateUrl: 'sections/admin/admin.tpl.html',
                controller: 'adminController as admin'
            })
            .when('/apropos', {
                title: 'Qui sommes nous?',
                templateUrl: 'sections/apropos/apropos.tpl.html',
                controller: 'aproposController as apropos'
            })
            .when('/conditionvente', {
                title: 'Condition de vente',
                templateUrl: 'sections/conditionvente/conditionvente.tpl.html',
                controller: 'conditionventeController as vente'
            })
            .when('/utilisation', {
                title: "Mentions d'utilisation",
                templateUrl: 'sections/utilisation/utilisation.tpl.html',
                controller: 'utilisationController as utilisation'
            })
            .when('/legale', {
                title: 'Mentions légales',
                templateUrl: 'sections/legale/legale.tpl.html',
                controller: 'legaleController as legale'
            })
            .when('/client', {
                title: 'Espace client',
                templateUrl: 'sections/client/client.tpl.html',
                controller: 'clientController as client'
            })
            .when('/tutoriels', {
                title: 'Tutoriels',
                templateUrl: 'sections/tutoriels/tutoriels.tpl.html',
                controller: 'tutorielsController as tutoriels'
            })
            .when('/commercial', {
                title: 'Commercial',
                templateUrl: 'sections/commercial/commercial.tpl.html',
                controller: 'commercialController as commercial'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }])
    .config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            ' https://www.youtube.com/embed/P2LA6N0kaA0'
        ]);

        // The blacklist overrides the whitelist so the open redirect here is blocked.
        $sceDelegateProvider.resourceUrlBlacklist([
            'http://myapp.example.com/clickThru**'
        ]);
    })
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

app.config(['$translateProvider', function ($translateProvider) {

    /*    // Adding a translation table for the English language
     $translateProvider.translations('en_US', {
     "TITLE"     : "How to use",
     "HEADER"    : "You can translate texts by using a filter.",
     "SUBHEADER" : "And if you don't like filters, you can use a directive.",
     "HTML_KEYS" : "If you don't like an empty elements, you can write a key for the translation as an inner HTML of the directive.",
     "DATA_TO_FILTER"    : "Your translations might also contain any static ({{staticValue}}) or random ({{randomValue}}) values, which are taken directly from the model.",
     "DATA_TO_DIRECTIVE" : "And it's no matter if you use filter or directive: static is still {{staticValue}} and random is still {{randomValue}}.",
     "RAW_TO_FILTER"     : "In case you want to pass a {{type}} data to the filter, you have only to pass it as a filter parameter.",
     "RAW_TO_DIRECTIVE"  : "This trick also works for {{type}} with a small mods.",
     "SERVICE"        : "Of course, you can translate your strings directly in the js code by using a $translate service.",
     "SERVICE_PARAMS" : "And you are still able to pass params to the texts. Static = {{staticValue}}, random = {{randomValue}}."
     });

     // Adding a translation table for the Russian language
     $translateProvider.translations('ru_RU', {
     "TITLE"     : "Как пользоваться",
     "HEADER"    : "Вы можете переводить тексты при помощи фильтра.",
     "SUBHEADER" : "А если Вам не нравятся фильтры, Вы можете воспользоваться директивой.",
     "HTML_KEYS" : "Если вам не нравятся пустые элементы, Вы можете записать ключ для перевода в как внутренний HTML директивы.",
     "DATA_TO_FILTER"    : "Ваши переводы также могут содержать любые статичные ({{staticValue}}) или случайные ({{randomValue}}) значения, которые берутся прямо из модели.",
     "DATA_TO_DIRECTIVE" : "И совершенно не важно используете ли Вы фильтр или директиву: статическое значение по прежнему {{staticValue}} и случайное - {{randomValue}}.",
     "RAW_TO_FILTER"     : "Если вы хотите передать \"сырые\" ({{type}}) данные фильтру, Вам всего лишь нужно передать их фильтру в качестве параметров.",
     "RAW_TO_DIRECTIVE"  : "Это также работает и для директив ({{type}}) с небольшими модификациями.",
     "SERVICE"        : "Конечно, Вы можете переводить ваши строки прямо в js коде при помощи сервиса $translate.",
     "SERVICE_PARAMS" : "И вы все еще можете передавать параметры в тексты. Статическое значение = {{staticValue}}, случайное = {{randomValue}}."
     });

     // Tell the module what language to use by default
     $translateProvider.preferredLanguage('en_US');*/
// Register a loader for the dynamic page
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [specified_url]?lang=[langKey].
    //
    // Note that to run this example you have to start a server first.
    // To run the server use a 'grunt server' command
    $translateProvider.useUrlLoader('api/v1/get_lang.php');

    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('EN');

    // Tell the module to store the language in the cookies
    $translateProvider.useCookieStorage();
    $translateProvider.useSanitizeValueStrategy('escape', 'sanitizeParameters');

}])