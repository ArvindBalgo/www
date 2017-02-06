<?php
include_once 'v1/modelmetier.php';
include_once 'v1/modelmetier_category.php';

if ( !empty( $_FILES ) ) {

    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    $uploadPath = dirname( __DIR__ ) . DIRECTORY_SEPARATOR . 'assets/img' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
    move_uploaded_file( $tempPath, $uploadPath );

    $subCategory = new modelmetier_category();
    $subCategory = $subCategory->findByPrimaryKey($_POST["id"]);
    $subCategory->setActive($_POST["active"]);
    $subCategory->setSrc('assets/img/'.$_FILES['file']['name']);
    $subCategory->setDescription($_POST["description"]);
    $subCategory->setDescriptionEN($_POST["description_en"]);
    $subCategory->setDescriptionES($_POST["description_es"]);
    $subCategory->setDescriptionAL($_POST["description_al"]);
    $subCategory->setDescriptionIT($_POST["description_it"]);
    $subCategory->setMessage($_POST["message"]);
    $subCategory->setMessageEn($_POST["message_en"]);
    $subCategory->setMessageEs($_POST["message_es"]);
    $subCategory->setMessageAl($_POST["message_al"]);
    $subCategory->setMessageIt($_POST["message_it"]);
    $subCategory->save();
    echo json_encode("DONE");

} else {
    echo 'No files';
}