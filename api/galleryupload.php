<?php
include_once 'chromePHP.php';
include_once 'classes/cata_image.php';
    if ( !empty( $_FILES ) ) {
        $pathCategory = preg_replace('/\s+/', '', trim($_POST["category_name"]));
$pathCategory = "groupe";
        $filename = dirname( __DIR__ ) . DIRECTORY_SEPARATOR ."images/gallery/$pathCategory";
        if (file_exists($filename)) {

        } else {
            mkdir($filename, 0777);
        }
        $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
        $uploadPath = dirname( __DIR__ ) . DIRECTORY_SEPARATOR . 'images/gallery/'.$pathCategory . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
        move_uploaded_file( $tempPath, $uploadPath );

        $cata_image = new cata_image();

        if($_POST["id"] == 0){
            $cata_image = new cata_image();
        }
        else{
            $cata_image = $cata_image->findByPrimaryKey($_POST["id"]);
        }
        $cata_image->setReference($_POST["reference"]);
        $cata_image->setLibelle($_POST["libelle"]);
        $cata_image->setActive($_POST["active"]);
        $cata_image->setIdCategory($_POST["id_category"]);
        if($_POST["displaySrc"] == true) {
            $cata_image->setDisplaySrc("images/gallery/".$pathCategory."/".$_FILES['file']['name']);
        }
        else {
            $cata_image->setSrc("images/gallery/".$pathCategory."/".$_FILES['file']['name']);
        }

        $cata_image->save();
        echo json_encode("DONE");

    } else {
        echo 'No files';
    }

