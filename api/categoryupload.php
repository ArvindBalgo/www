<?php
include_once 'v1/modelmetier.php';
if($_POST["id_model"] > 0 && $_POST["img_modified"] == 0){
    $modelmetier = new modelmetier();
    $modelmetier = $modelmetier->findByPrimaryKey($_POST["id_model"]);
    $modelmetier->setDescription($_POST["name"]);
    $modelmetier->setCategory($_POST["id"]);
    $modelmetier->setQte($_POST["qte"]);
    $modelmetier->setActive(intval($_POST["active"]));
    $modelmetier->save();
    echo "done";
}
else{
    if ( !empty( $_FILES ) ) {

        $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
        $uploadPath = dirname( __DIR__ ) . DIRECTORY_SEPARATOR . 'assets/img' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
        move_uploaded_file( $tempPath, $uploadPath );
        $modelmetier = new modelmetier();
        if($_POST["id_model"] > 0) {
            $modelmetier = $modelmetier->findByPrimaryKey($_POST["id_model"]);
            //$modelmetier->setId($_POST["id_model"]);
        }
        $modelmetier->setDescription($_POST["name"]);
        $modelmetier->setCategory($_POST["id"]);
        $modelmetier->setQte($_POST["qte"]);
        $modelmetier->setSrc('assets/img/'.$_FILES['file']['name']);
        $modelmetier->setActive(intval($_POST["active"]));
        $modelmetier->save();
        echo json_encode("DONE");

    } else {
        echo 'No files';
    }
}
