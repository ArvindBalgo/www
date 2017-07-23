<?php
session_start();
include_once 'include_all.php';
include_once '../chromePHP.php';
$mode = $_POST['mode'];
if ($mode == 1) {
    $orders = new orders_main();
    $orders = $orders->findAllOngoingOrders();

    $rows = [];
    foreach ($orders as $item) {
        $user = new users();
        $user = $user->findByPrimaryKey($item["id_user"]);
        $item["name"] = $user->getName();
        $item["surname"] = $user->getSurname();
        $item["codepostale"] = $user->getPostalCode();
        $modifUser = new users();
        $modifUser = $modifUser->findByPrimaryKey($item["modified_by"]);
        $item["modified_user"] = "";
        if ($modifUser) {
            $item["modified_user"] = $modifUser->getSurname() . " " . $modifUser->getName();
        }
        $ordersDetails = new orders_details();
        $ordersDetails = $ordersDetails->getCountProds($item["id"]);
        $item["num_prods"] = $ordersDetails["prods"];
        $item["displayDetails"] = false;
        $rows[] = $item;
    }

    print json_encode($rows);
} elseif ($mode == 2) {
    $idOrder = $_POST["idOrder"];
    $ordersDetails = new orders_details();
    $ordersDetails = $ordersDetails->getProds($idOrder);
    print json_encode($ordersDetails);
} elseif ($mode == 3) {
    $idOrder = $_POST["idOrder"];
    $status = $_POST["status"];
    $order = new orders_main();
    $order = $order->findByPrimaryKey($idOrder);
    $order->setStatus($status);
    $order->setModifiedBy($_SESSION['uid']);
    $order->setDateModified(date("Y-m-d H:i:s"));
    $order->save();

    $orderDetails = new orders_details();
    $ordersDetails = $orderDetails->updateStatusProds($idOrder, $status);

    $orders = new orders_main();
    $orders = $orders->findAllOngoingOrders();

    $rows = [];
    foreach ($orders as $item) {
        $user = new users();
        $user = $user->findByPrimaryKey($item["id_user"]);
        $item["name"] = $user->getName();
        $item["surname"] = $user->getSurname();
        $item["codepostale"] = $user->getPostalCode();
        $ordersDetails = new orders_details();
        $ordersDetails = $ordersDetails->getCountProds($item["id"]);
        $item["num_prods"] = $ordersDetails["prods"];
        $item["displayDetails"] = false;
        $rows[] = $item;
    }

    print json_encode($rows);
} else if ($mode == 4) {
    $idOrder = $_POST["idOrder"];
    $status = $_POST["status"];
    $message = $_POST["comments"];

    $orderMain = new orders_main();
    $orderMain = $orderMain->findByPrimaryKey($idOrder);
    if ($orderMain) {
        $orderMain->setStatus($status);
        $orderMain->setComments($message);
        $orderMain->setModifiedBy($_SESSION['uid']);
        $orderMain->setDateModified(date("Y-m-d H:i:s"));
        $orderMain->save();
    }

    $orderDetails = new orders_details();
    $ordersDetails = $orderDetails->updateStatusProds($idOrder, $status);

    $orders = new orders_main();
    $orders = $orders->findAllOngoingOrders();

    $rows = [];
    foreach ($orders as $item) {
        $user = new users();
        $user = $user->findByPrimaryKey($item["id_user"]);
        $item["name"] = $user->getName();
        $item["surname"] = $user->getSurname();
        $item["codepostale"] = $user->getPostalCode();
        $ordersDetails = new orders_details();
        $ordersDetails = $ordersDetails->getCountProds($item["id"]);
        $item["num_prods"] = $ordersDetails["prods"];
        $item["displayDetails"] = false;
        $rows[] = $item;
    }

    print json_encode($rows);
} else if ($mode == 5) {
    $idOrder = $_POST["idOrder"];
    $status = $_POST["status"];

    $orderMain = new orders_main();
    $orderMain = $orderMain->findByPrimaryKey($idOrder);
    if ($orderMain) {
        $orderMain->setStatus($status);
        $orderMain->setModifiedBy($_SESSION['uid']);
        $orderMain->setDateModified(date("Y-m-d H:i:s"));
        $orderMain->save();
    }

    $orderDetails = new orders_details();
    $ordersDetails = $orderDetails->updateStatusProds($idOrder, $status);

    $orders = new orders_main();
    $orders = $orders->findAllOngoingOrders();

    $rows = [];
    foreach ($orders as $item) {
        $user = new users();
        $user = $user->findByPrimaryKey($item["id_user"]);
        $item["name"] = $user->getName();
        $item["surname"] = $user->getSurname();
        $item["codepostale"] = $user->getPostalCode();
        $ordersDetails = new orders_details();
        $ordersDetails = $ordersDetails->getCountProds($item["id"]);
        $item["num_prods"] = $ordersDetails["prods"];
        $item["displayDetails"] = false;
        $rows[] = $item;
    }

    print json_encode($rows);
} else if ($mode == 6) {
    $idClient = $_SESSION['uid'];
    $orderMain = new orders_main();
    $orderMain = $orderMain->findByUser($idClient);
    $rows = [];
    foreach ($orderMain as $item) {
        $ordersDetails = new orders_details();

        $ordersDetails = $ordersDetails->getCountProds($item["id"]);
        $item["num_prods"] = $ordersDetails["prods"];
        $item["displayDetails"] = false;
        $dateTime = new DateTime($item["date_created"]);
        $item["date_commande"] = $dateTime->format("h:m d/m/Y");
        $item["status_val"] = "-";
        if($item["status"] == 'NEW') {
            $item["status_val"] = "-";
        }
        else if($item["status"] == 'BON_TIRER') {
            $item["status_val"] = 1;
        }
        else if($item["status"] == 'MONTAGE_MAQUETTE') {
            $item["status_val"] = 2;
        }
        else if($item["status"] == 'IMPRESSION') {
            $item["status_val"] = 3;
        }
        else if($item["status"] == 'PELLICULAGE_VERNISSAGE') {
            $item["status_val"] = 4;
        }
        else if($item["status"] == 'COUPDE_DECOUPE') {
            $item["status_val"] = 5;
        }
        else if($item["status"] == 'FACONNAGE') {
            $item["status_val"] = 6;
        }
        else if($item["status"] == 'LIVRAISON') {
            $item["status_val"] = 7;
        }
        else {
            $item["status_val"] = "-";
        }

        $rows[] = $item;
    }

    print json_encode($rows);

} else if ($mode == 7) {
    $idClient = $_SESSION['uid'];
    $orderMain = new orders_main();
    $orderMain = $orderMain->findByUser($idClient);
    $orderDetails = new orders_details();
    $orderDetails = $orderDetails->getProds($_POST["id"]);
    $rows = [];
    foreach ($orderDetails as $item) {
        $row = [];
        $row["id"] = $item["id"];
        $row["title"] = $item["title"];
        $row["escargot_val"] = $item["escargot_val"];
        $row["contours"] = $item["contours"];
        $row["liserai"] = $item["liserai"];
        $row["opt"] = $item["opt"];
        $row["qte"] = $item["qte"];
        $row["unitprix"] = $item["unitprix"];
        $row["prix_ttc"] = $item["prix_ttc"];
        $row["commentaire"] = $item["commentaire"];
        $rows[] = $row;
    }

    print json_encode($rows);

}
else if ($mode == 8) {
    $idClient = $_SESSION["uid"];
    $user = new users();
    $user = $user->findByPrimaryKey($idClient);
    $row = [];
    $row["id"] = $user->getUid();
    $row["name"] = $user->getName();
    $row["surname"] = $user->getSurname();
    $row["email"] = $user->getEmail();
    $row["phone"] = $user->getPhone();
    $row["address"] = $user->getAddress();
    $row["city"] = $user->getCity();
    $row["pays"] = $user->getPays();
    $row["postalcode"] = $user->getPostalCode();
    print json_encode($row);
}