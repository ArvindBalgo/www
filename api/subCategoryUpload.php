<?php
include_once 'classes/modelmetier.php';
include_once 'classes/modelmetier_category.php';

if ( !empty( $_FILES ) ) {

    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    $uploadPath = dirname( __DIR__ ) . DIRECTORY_SEPARATOR . 'assets/img' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
    move_uploaded_file( $tempPath, $uploadPath );

    $subCategory = new modelmetier_category();
    $subCategory = $subCategory->findByPrimaryKey($_POST["id"]);
    $subCategory->setActive($_POST["active"]);
    $subCategory->setSrc('assets/img/'.$_FILES['file']['name']);
    $subCategory->setDescription($_POST["description"]);
    $subCategory->setKeyDescription($_POST["key_description"]);
    $subCategory->setMessage($_POST["message"]);
    $subCategory->setKeyMessage($_POST["key_message"]);
    $subCategory->save();
    $subCategory = null;
    echo json_encode("DONE");

} else {
    echo 'No files';
}