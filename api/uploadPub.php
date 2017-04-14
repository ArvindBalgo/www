<?php
include_once 'classes/pub.php';
include_once 'chromePHP.php';

if ( !empty( $_FILES ) ) {

    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    $uploadPath = dirname( __DIR__ ) . DIRECTORY_SEPARATOR . 'assets/pubs' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
    move_uploaded_file($tempPath, $uploadPath);

    $pub = new pub();
    $pub = $pub->findByPays($_POST["pays"]);
    $pub->setPays($_POST["pays"]);
    $pub->setActif(1);
    $pub->setlink('assets/pubs/' . $_FILES['file']['name']);
    $pub->save();

    echo json_encode("DONE");

} else {
    echo 'No files';
}

