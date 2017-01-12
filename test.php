<?php
/**
 * Created by PhpStorm.
 * User: Arvind
 * Date: 8/6/16
 * Time: 10:43 AM
 */
include_once 'api/v1/include_all.php';
include_once 'api/chromePHP.php';
$test = new souscategory_coeffprix();
$test->rechUpdateAll();

die();
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');
define('DB_NAME', 'exacom');
$conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
$test = $conn->query("INSERT INTO MODELMETIER(description, category, src) VALUE ('".$_GET["description"]."', ".$_GET["category"].", '".$_GET["src"]."')");
print json_encode("INSERT INTO MODELMETIER(description, category, src) VALUE ('".$_GET["description"]."', ".$_GET["category"].", ".$_GET["src"].")");