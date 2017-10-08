<?php
    if ( !empty( $_FILES ) ) {
        //$pathCategory = preg_replace('/\s+/', '', trim($_POST["category_name"]));
//$pathCategory = "groupe";
       /* $filename = dirname( __DIR__ ) . DIRECTORY_SEPARATOR ."tmp/$pathCategory";
        if (file_exists($filename)) {

        } else {
            mkdir($filename, 0777);
        }*/
        $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
        $uploadPath = dirname( __DIR__ ) . DIRECTORY_SEPARATOR . 'tmp_admin'. DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
        move_uploaded_file( $tempPath, $uploadPath );

        echo ('tmp_admin/' . $_FILES[ 'file' ][ 'name' ]);
        $tempPath = null;
        $uploadPath = null;

    } else {
        echo '';
    }

