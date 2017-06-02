<?php
session_start();
include_once 'classes/polices.php';
include_once 'chromePHP.php';

if ( !empty( $_FILES ) ) {
   /* $filename = dirname( __DIR__ ) . DIRECTORY_SEPARATOR ."php_scripts".DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.$_SESSION["id"];
    if (file_exists($filename)) {

    } else {
        mkdir($filename, 0777);
    }*/
    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    $uploadPath = dirname( __DIR__ ) . DIRECTORY_SEPARATOR ."fonts" . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
    move_uploaded_file( $tempPath,$uploadPath);
    $filenme = "/fonts/" . $_FILES[ 'file' ][ 'name' ];
    $police = new polices();
    $police->setNom($_POST['nom']);
    $police->setActive(1);
    $police->setPath($filenme);
    $police->save();

    echo 'test';

} else {

    echo 'No files';

}