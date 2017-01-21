<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Exakom</title>
    <link rel="icon" type="image/png" href="assets/images/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href='http://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css'>
    <!-- build:css assets/css/styles.css -->
    <link rel="stylesheet" href="assets/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="sections/home/home.css"/>
    <link href="css/select2.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="sections/fiche/fiche.css"/>
    <link rel="stylesheet" href="sections/apropos/apropos.css"/>
    <link rel="stylesheet" href="sections/client/client.css"/>
    <!-- The CSS for the plugin itself - required -->
    <link rel="stylesheet" type="text/css" href="css/FancyProductDesigner-all.min.css" />
    <!-- Optional - only when you would like to use custom fonts - optional -->
    <link rel="stylesheet" type="text/css" href="css/jquery.fancyProductDesigner-fonts.css" />
    <link rel="stylesheet" type="text/css" href="css/toastr.min.css" />
    <!-- CSSMap STYLESHEET - EUROPE -->
    <link rel="stylesheet" type="text/css" href="cssmap-europe/cssmap-europe.css" media="screen" />

    <!-- endbuild -->
</head>
<body data-ng-app="myApp" ng-controller="mainController" style="margin: 5px; overflow-y: hidden">
<section id="main" style="overflow-y: hidden">
    <div>
        <ng-view></ng-view>
    </div>
</section>

<!-- build:assets assets.min.js -->
<!-- ASSETS -->
<script src="assets/js/jquery.js"></script>
<script src="js/jquery-ui.min.js"></script>
<script src="js/jquery.ui.core.min.js"></script>
<script src="js/jquery.ui.widget.min.js"></script>
<script src="js/jquery.ui.mouse.min.js"></script>
<script src="js/jquery.ui.draggable.min.js"></script>
<script src="js/jquery.ui.sortable.min.js"></script>
<script src="assets/js/endless_scroll_min.js"></script>
<!-- jQuery -->
<!--script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script-->

<!-- CSSMap SCRIPT -->
<script type="text/javascript" src="https://cssmapsplugin.com/5/jquery.cssmap.min.js"></script>

<script src="js/page.js"></script>
<script src="js/bootbox.min.js"></script>
<script src="js/fabric.min.js"></script>
<script src="js/FancyProductDesigner-all.min.js"></script>
<script src="assets/js/angular-1.5.7/angular.js"></script>
<script src="assets/js/angular-1.5.7/angular-animate.js"></script>
<script src="assets/js/angular-1.5.7/angular-route.js"></script>
<script src="assets/js/bootstrap.min.js"></script>
<script src="assets/js/ui-bootstrap-tpls-1.1.2.min.js"></script>
<script src="js/es5-shim.min.js"></script>
<script src="js/console-sham.min.js"></script>
<script src="js/select2.min.js"></script>
<script src="js/angular-file-upload.min.js"></script>
<script src="js/angular-file-upload.min.js.map"></script>
<script src="js/toaster.js"></script>
<script src="js/toastr.min.js"></script>
<script src="app/app.js"></script>
<script src="app/data.js"></script>
<script src="app/directives.js"></script>
<script src="app/authCtrl.js"></script>
<script src="js/angular-sanitize.min.js"></script>
<!-- / -->
<!-- endbuild -->
<!-- endbuild -->
<!-- CONTROLLERS -->
<script src="sections/mainController.js"></script>
<script src="sections/home/home.ctrl.js"></script>
<script src="sections/fiche/fiche.ctrl.js"></script>
<script src="sections/admin/admin.ctrl.js"></script>
<script src="sections/apropos/apropos.ctrl.js"></script>
<script src="sections/conditionvente/conditionvente.ctrl.js"></script>
<script src="sections/legale/legale.ctrl.js"></script>
<script src="sections/utilisation/utilisation.ctrl.js"></script>
<script src="sections/client/client.ctrl.js"></script>
<!--script src="sections/premieres/premieres.ctrl.js"></script>
<script src="sections/search/search.ctrl.js"></script>
<script src="sections/view/view.ctrl.js"></script>
<script src="components/bar/bar.ctrl.js"></script>
<script src="sections/popular/popular.ctrl.js"></script>
<!-- / -->
<!-- SERVICES -->
<!--script src="services/show.fct.js"></script>
<script src="services/page.val.js"></script>
<!-- / -->
<!-- DIRECTIVES -->
<!--script src="components/show/show.drct.js"></script>
<script src="directives/ngEnter.drct.js"></script-->
<!-- / -->
<!-- inject:js -->
<!-- endinject -->
<!-- endbuild -->
</body>
</html>