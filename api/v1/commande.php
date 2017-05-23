<?php
include_once 'include_all.php';
include_once '../chromePHP.php';
$mode = $_POST['mode'];
if($mode == 1) {
    $orders = new orders_main();
    $orders = $orders->findAllOngoingOrders();

    $rows = [];
    foreach ($orders as $item) {
        $user = new users();
        $user  = $user->findByPrimaryKey($item["id_user"]);
        $item["name"] = $user->getName();
        $item["surname"] = $user->getSurname();
        $ordersDetails = new orders_details();
        $ordersDetails = $ordersDetails->getCountProds($item["id"]);
        $item["num_prods"] = $ordersDetails["prods"];
        $item["displayDetails"] = false;
        $rows[] = $item;
    }

    print json_encode($rows);
}
elseif ($mode == 2) {
    $idOrder  =$_POST["idOrder"];
    $ordersDetails = new orders_details();
    $ordersDetails = $ordersDetails->getProds($idOrder);
    print json_encode($ordersDetails);
}
elseif($mode == 3) {
    $idOrder = $_POST["idOrder"];
    $status = $_POST["status"];
    $order = new orders_main();
    $order = $order->findByPrimaryKey($idOrder);
    $order->setStatus($status);
    $order->setDateModified(date("Y-m-d H:i:s"));
    $order->save();

    $orderDetails = new orders_details();
    $ordersDetails = $orderDetails->updateStatusProds($idOrder, $status);

    $orders = new orders_main();
    $orders = $orders->findAllOngoingOrders();

    $rows = [];
    foreach ($orders as $item) {
        $user = new users();
        $user  = $user->findByPrimaryKey($item["id_user"]);
        $item["name"] = $user->getName();
        $item["surname"] = $user->getSurname();
        $ordersDetails = new orders_details();
        $ordersDetails = $ordersDetails->getCountProds($item["id"]);
        $item["num_prods"] = $ordersDetails["prods"];
        $item["displayDetails"] = false;
        $rows[] = $item;
    }

    print json_encode($rows);
}
