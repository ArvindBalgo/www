<?php
include_once 'classes/gabarits.php';
if ( !empty( $_FILES ) ) {

    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    $uploadPath = dirname( __DIR__ ) . DIRECTORY_SEPARATOR . 'images/gabarits' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
    $arrID = explode("," , $_POST["id"]);

    move_uploaded_file( $tempPath, $uploadPath );
    foreach($arrID as $value){
        $gabarit = new gabarits();
        $gabarit->setIdModelMetier($value);
        $gabarit->setDescription($_POST["nom"]);
        $gabarit->setSrc("images/gabarits/".$_FILES['file']['name']);
        $gabarit->setType('0');
        $gabarit->setReference($_POST["reference"]);
        $gabarit->save();
    }

   // $answer = array( $_POST );
    echo json_encode("DONE");

} else {
    echo 'No files';
}