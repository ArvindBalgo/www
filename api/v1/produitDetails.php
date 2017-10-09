<?php
include_once 'include_all.php';
include_once '../chromePHP.php';
$mode = $_POST['mode'];


if ($mode == 0){
    $id = $_POST['idProd'];

    $orderDetail = new orders_details();
    $orderDetail = $orderDetail->findByPrimaryKey1($id);


    print json_encode($orderDetail);
    $orderDetail=null;
}