<?php
include_once '../chromePHP.php';
//get the base-64 from data
$base64_str = substr($_POST['base64_image'], strpos($_POST['base64_image'], ",")+1);

//decode base64 string
$decoded = base64_decode($base64_str);

$url = "image_".strtotime('now').".png";
//$png_url = "../imgs_temp/".$url;
$png_url = "../imgs_temp/".$_POST["randomStr"].".png";
//create png from decoded base 64 string and save the image in the parent folder
$result = file_put_contents($png_url, $decoded);
//send result - the url of the png or
header('Content-Type: application/json');
if($result) {
    echo json_encode($url);
}
else {
    echo json_encode(0);
}