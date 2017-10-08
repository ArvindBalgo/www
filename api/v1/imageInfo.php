<?php
include_once 'include_all.php';

$mode = $_GET['mode'];
if ($mode == 0) {
    $category = new cata_category();
    $category = $category->rechercher();

    print json_encode($category);
    $category = null;
    return;
} else if ($mode == 1) {
    $category = new cata_category();
    $category->setLibelle($_GET["libelle"]);
    $category->setColorCode($_GET["codeCouleur"]);
    $category->setActive($_GET["active"]);
    $category->save();
    $category = null;
    print "done";
} else if ($mode == 2) {
    $category = new cata_category();
    $category = $category->findByPrimaryKey(trim($_GET["id"]));
    $category->setLibelle($_GET["libelle"]);
    $category->setColorCode($_GET["codeCouleur"]);
    $category->setActive($_GET["active"]);
    $category->save();
    $category = null;
    print "done";
} else if ($mode == 3) {
    $cata_image = new cata_image();
    $cata_image = $cata_image->rechercher();
    print json_encode($cata_image);
    $cata_image = null;
} else if ($mode == 4) {
    $cata_image = new cata_image();
    $cata_image = $cata_image->findByPrimaryKey($_GET["id"]);

    $cata_image->setLibelle($_GET["libelle"]);
    $cata_image->setReference($_GET["reference"]);
    $cata_image->setActive($_GET["active"]);

    $cata_image->save();
    print "done";
    $cata_image = null;
} else if ($mode == 5) {
    $cata_image = new cata_image();
    $cata_image->delete($_GET["id"]);
    print "done";
    $cata_image = null;
} else if ($mode == 6) {
    $cata_image = new cata_image();
    $cata_image = $cata_image->findInfoImage();
    print json_encode($cata_image);
    $cata_image = null;
}