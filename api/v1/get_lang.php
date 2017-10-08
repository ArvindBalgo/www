<?php
session_start();
include_once 'include_all.php';
include_once '../chromePHP.php';

$mode = $_GET['lang'];
if ($mode == "") {
    $mode = "FR";
}
$langue = new langue();
$langue = $langue->rechByLang('FR');
unset($mode);
print json_encode($langue);
$langue = null;
