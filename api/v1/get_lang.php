<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 1/23/2017
 * Time: 10:16 PM
 */
include_once 'include_all.php';
include_once '../chromePHP.php';

$mode = $_GET['lang'];
if($mode == "") {
    $mode = "FR";
}
$langue = new langue();
$langue = $langue->rechByLang($mode);
print json_encode($langue);
