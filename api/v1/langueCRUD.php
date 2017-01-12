<?php
/**
 * Created by PhpStorm.
 * User: balgo
 * Date: 12/27/2016
 * Time: 11:05 PM
 */
include_once 'include_all.php';
$mode = $_GET['mode'];

if($mode == 0) {
    $langue = new langue();
    $langue = $langue->rechercher();
    print json_encode($langue);
}
else if($mode == 1) {
    $langue = new langue();
    $langue = $langue->findDoublon(strtolower($_GET['keyword']));
    if(intval($langue) > 0) {
        print 1;
    }
    else {
        $langue = new langue();
        $langue->setKeyIdentifier(strtolower($_GET['keyword']));
        $langue->save();
        print 0;
    }
}
else if($mode == 2) {
    $obj = json_decode($_GET["obj"]);
    $langue = new langue();
    $langue = $langue->findByPrimaryKey($obj->id);
    if(!$langue) {
        $langue = new langue();
    }
    $langue->setEnglish($obj->english);
    $langue->setFrench($obj->french);
    $langue->setSpanish($obj->spanish);
    $langue->setGerman($obj->german);
    $langue->setItalien($obj->italien);
    $langue->save();

    $lang = new langue();
    $lang = $lang->rechercher();
    print json_encode($lang);
}
else if($mode == 3) {
    $lang = $_GET['lang'];
    $langue = new langue();
    $langue = $langue->rechByLang($lang);
    print json_encode($langue);
}
