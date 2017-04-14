<?php
include_once 'classes/cata.php';

if ( !empty( $_FILES ) ) {

    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    $uploadPath = dirname( __DIR__ ) . DIRECTORY_SEPARATOR . 'assets/img' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
    move_uploaded_file( $tempPath, $uploadPath );
    $cata = new cata();
    $cata = $cata->findByPrimaryKey(intval($_POST["id_cata"]));
    $cata->setSrc('assets/img/'.$_FILES['file']['name']);

    $cata->save();
    echo json_encode("DONE");

} else {
    echo 'No files';
}

