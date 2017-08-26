var app = angular.module('adminApp', ['ngRoute', 'ngAnimate', 'toaster', 'angularFileUpload', 'ui.grid', 'ui.grid.edit', 'ui.grid.selection', 'ngSanitize', 'ngMaterial', 'ngTable']);

app.config(['$routeProvider',
    function ($routeProvider) {
        console.log($routeProvider);
        $routeProvider.when('/login', {
            title: 'Login',
            templateUrl: 'sections/login/login.tpl.html',
            controller: 'loginController as login'
        })
            .when('/home', {
                title: 'Admin Dashboard',
                templateUrl: 'sections/admin/home/home.tpl.html',
                controller: 'homeController as home'
            })
            .when('/operateurs', {
                title: 'Operateurs Dashboard',
                templateUrl: 'sections/admin/operateurs/operateurs.tpl.html',
                controller: 'operateursController as operateurs'
            })
            .when('/param', {
                title: 'Parametrage',
                templateUrl: 'sections/admin/param/param.tpl.html',
                controller: 'paramController as param'
            })
            .when('/produitclient/:idCommDetail', {
                title: 'Produit Client',
                templateUrl: 'sections/admin/prod_client/prod_client.tpl.html',
                controller: 'prodClientController as prod'
            })
            .when('/maquette', {
                title: 'Maquette',
                templateUrl: 'sections/admin/maquette/maquette.tpl.html',
                controller: 'maquetteController as maquette'
            })
            .when('/commande', {
                title: 'Commande',
                templateUrl: 'sections/admin/commande/commande.tpl.html',
                controller: 'commandeController as comm'
            })
            .when('/client', {
                title: 'Clients',
                templateUrl: 'sections/admin/client/client.tpl.html',
                controller: 'clientController as client'
            })
            .when('/sample', {
                title: 'Sample Gabarits',
                templateUrl: 'sections/admin/sample/sample.tpl.html',
                controller: 'sampleController as sample'
            })
            .when('/samplemodel', {
                title: 'Sample Modele',
                templateUrl: 'sections/admin/samplemodel/sample.tpl.html',
                controller: 'sampleModelController as sample'
            })
            .when('/revendeurs', {
                title: 'Revendeur',
                templateUrl: 'sections/admin/revendeur/revendeur.tpl.html',
                controller: 'revendeurController as revendeur'
            })
            .when('/compte', {
                title: 'Compte',
                templateUrl: 'sections/admin/compte/compte.tpl.html',
                controller: 'CompteController as compte'
            })
            .when('/model', {
                title: 'Model',
                templateUrl: 'sections/admin/model/model.tpl.html',
                controller: 'modelController as model'
            })
            .when('/imgProduits', {
                title: 'Produits',
                templateUrl: 'sections/admin/produits/produits.tpl.html',
                controller: 'produitsController as produits'
            })
            .when('/metier', {
                title: 'Metier',
                templateUrl: 'sections/admin/metier/metier.tpl.html',
                controller: 'metierController as metier'
            })
            .when('/gallery', {
                title: 'Gallery',
                templateUrl: 'sections/admin/gallery/gallery.tpl.html',
                controller: 'galleryController as gallery'
            })
            .when('/instructions', {
                title: 'Instructions',
                templateUrl: 'sections/admin/instructions/instructions.tpl.html',
                controller: 'instructionsController as instructions'
            })
            .when('/config_divers', {
                title: 'Configuration Divers',
                templateUrl: 'sections/admin/config_divers/config_divers.tpl.html',
                controller: 'configDiversController as configDivers'
            })
            .when('/support', {
                title: 'Type de Support',
                templateUrl: 'sections/admin/type_support/type_support.tpl.html',
                controller: 'typeSupportController as support'
            })
            .when('/apropos', {
                title: 'Qui sommes nous?',
                templateUrl: 'sections/admin/apropos/apropos.tpl.html',
                controller: 'aproposController as apropos'
            })
            .when('/conditionvente', {
                title: 'Condition de vente',
                templateUrl: 'sections/admin/conditionvente/conditionvente.tpl.html',
                controller: 'conditionventeController as conditionvente'
            })
            .when('/utilisation', {
                title: "Mentions d'utilisation",
                templateUrl: 'sections/admin/utilisation/utilisation.tpl.html',
                controller: 'utilisationController as utilisation'
            })
            .when('/legale', {
                title: 'Mentions légales',
                templateUrl: 'sections/admin/legale/legale.tpl.html',
                controller: 'legaleController as legale'
            })
            .when('/langue', {
                title: 'Language',
                templateUrl: 'sections/admin/langue/langue.tpl.html',
                controller: 'langueController as langue'
            })
            .when('/pub', {
                title: 'Publicité',
                templateUrl: 'sections/admin/pub/pub.tpl.html',
                controller: 'pubController as pub'
            })
            .when('/polices', {
                title: 'Polices',
                templateUrl: 'sections/admin/polices/polices.tpl.html',
                controller: 'policesController as polices'
            })
            .when('/coupon', {
                title: 'Coupon',
                templateUrl: 'sections/admin/coupon/coupon.tpl.html',
                controller: 'couponController as coupon'
            })
            .when('/youtube', {
                title: 'Youtube',
                templateUrl: 'sections/admin/youtube/youtube.tpl.html',
                controller: 'youtubeController as youtube'
            })
            .when('/list_orders', {
                title: 'Liste des commandes',
                templateUrl: 'sections/admin/list_orders/list_orders.tpl.html',
                controller: 'listOrdersController as orders'
            })
            .when('/list_factures', {
                title: 'Liste des factures',
                templateUrl: 'sections/admin/list_factures/list_factures.tpl.html',
                controller: 'listFacturesController as factures'
            })
            .when('/commerciaux', {
                title: 'Commerciaux',
                templateUrl: 'sections/admin/commerciaux/commerciaux.tpl.html',
                controller: 'commerciauxController as commerciaux'
            })
            .when('/', {
                title: 'Login',
                templateUrl: 'sections/login/login.tpl.html',
                controller: 'loginController as login'
            })
            .otherwise({
                redirectTo: '/login'
            });
    }])
    .run(function ($rootScope, $location, Data) {
        console.log('error checkgin');
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.authenticated = false;
            Data.get('session.php').then(function (results) {
                console.log("SESSION CHECKED: ", results);
            });
        });
    });
