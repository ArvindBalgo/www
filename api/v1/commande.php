<?php
session_start();
include_once 'include_all.php';
include_once '../chromePHP.php';
require '../PHPMailerAutoload.php';
date_default_timezone_set('America/Los_Angeles');
$mode = $_POST['mode'];
if ($mode == 1) {
    $orders = new orders_main();
    $orders = $orders->findAllOngoingOrders();

    $rows = [];
    foreach ($orders as $item) {
        $user = new users();
        $user = $user->findByPrimaryKey($item["id_user"]);

        $commercial = new users();
        $commercial = $commercial->findByPrimaryKey($item['id_commercial']);
        if (!$user) {
            break;
        }
        $item["name"] = $user->getName();
        $item["surname"] = $user->getSurname();
        if($commercial) {
            $item["comm_name"] = $commercial->getName();
            $item["comm_surname"] = $commercial->getSurname();
        }
        else {
            $item["comm_name"] = "";
            $item["comm_surname"] = "";
        }


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
    $user = new users();
    $user = $user->findByPrimaryKey($idClient);

    $orderMain = new orders_main();
    if($user->getSalesman() == 1) {
        $orderMain = $orderMain->findByIdCommercial($idClient);
    }
    else {
        $orderMain = $orderMain->findByUser($idClient);
    }
    $rows = [];
    foreach ($orderMain as $item) {
        $ordersDetails = new orders_details();
        $facture  = new factures();
        $client = new users();
        $client = $client->findByPrimaryKey($item['id_user']);

        $facture = $facture->findByIdOrder($item["id"]);
        if($facture) {
            $item['pdf_src'] = $facture->getPdfSrc();
        }else {
            $item['pdf_src'] = null;
        }

        $ordersDetails = $ordersDetails->getCountProds($item["id"]);
        $item["num_prods"] = $ordersDetails["prods"];
        $item["client_name"] = $client->getSurname() ." ". $client->getName();
        $item["postalcode"] = $client->getPostalCode();
        $item["displayDetails"] = false;
        $dateTime = new DateTime($item["date_created"]);
        $item["date_commande"] = $dateTime->format("h:m d/m/Y");
        $item["status_val"] = "-";
        if ($item["status"] == 'NEW') {
            $item["status_val"] = "-";
        } else if ($item["status"] == 'BON_TIRER') {
            $item["status_val"] = 1;
        } else if ($item["status"] == 'MONTAGE_MAQUETTE') {
            $item["status_val"] = 2;
        } else if ($item["status"] == 'IMPRESSION') {
            $item["status_val"] = 3;
        } else if ($item["status"] == 'PELLICULAGE_VERNISSAGE') {
            $item["status_val"] = 4;
        } else if ($item["status"] == 'COUPDE_DECOUPE') {
            $item["status_val"] = 5;
        } else if ($item["status"] == 'FACONNAGE') {
            $item["status_val"] = 6;
        } else if ($item["status"] == 'LIVRAISON') {
            $item["status_val"] = 7;
        } else {
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
        $row["dimension"] = $item["dimension"];
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

} else if ($mode == 8) {
    $idClient = $_SESSION["uid"];
    $user = new users();
    $user = $user->findByPrimaryKey($idClient);
    $row = [];
    $row["id"] = $user->getUid();
    $row["name"] = $user->getName();
    $row["company_name"] = $user->getCompanyName();
    $row["surname"] = $user->getSurname();
    $row["email"] = $user->getEmail();
    $row["phone"] = $user->getPhone();
    $row["address"] = $user->getAddress();
    $row["city"] = $user->getCity();
    $row["pays"] = $user->getPays();
    $row["postalcode"] = $user->getPostalCode();
    $row["siret"] = $user->getSiret();
    print json_encode($row);
} else if ($mode == 9) {
    $idClient = $_SESSION["uid"];

    if ($idClient <= 0) {
        print "NO SESSION";
    } else {
        $user = new users();
        $user = $user->findByPrimaryKey($idClient);
        $clientOrig = array(
            "surname"=>$user->getSurname(),
            "name"=>$user->getName(),
            "company_name"=>$user->getCompanyName(),
            "address"=>$user->getAddress(),
            "postalCode"=>$user->getPostalCode(),
            "phone"=>$user->getPhone(),
            "city"=>$user->getCity(),
            "pays"=>$user->getPays(),
            "siret"=>$user->getSiret()
        );

        $user->setSurname($_POST["surname"]);
        $user->setName($_POST["name"]);
        $user->setCompanyName($_POST["company_name"]);
        $user->setAddress($_POST["address"]);
        $user->setPostalCode($_POST["postalcode"]);
        $user->setPhone($_POST["phone"]);
        $user->setCity($_POST["city"]);
        $user->setPays($_POST["pays"]);
        $user->setSiret($_POST["siret"]);
        $user->save();


        $mailAdmin = new PHPMailer;
        $mailAdmin->isSMTP();                                      // Set mailer to use SMTP
        $mailAdmin->Host = 'mail.exakom.fr';  // Specify main and backup SMTP servers
        $mailAdmin->SMTPAuth = true;                               // Enable SMTP authentication
        $mailAdmin->Username = 'contact@exakom.fr';                 // SMTP username
        $mailAdmin->Password = '95961b98';                           // SMTP password
        $mailAdmin->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
        $mailAdmin->Port = 25;                                    // TCP port to connect to

        $mailAdmin->setFrom('contact@exakom.fr', 'Exakom');
        $mailAdmin->addAddress('contact@exakom.fr', "Admin");     // Add a recipient     // Name is optional
        $mailAdmin->addAddress('balgo_arvind@hotmail.com');               // Name is optional
        $mailAdmin->addReplyTo('contact@exakom.fr', 'Information Client');

        $mailAdmin->isHTML(true);                                  // Set email format to HTML

        $mailAdmin->Subject = utf8_decode('Info client');
        $mailAdmin->Body    = utf8_decode('Bonjour Exakom'. " <br> Une mise-à-jour des info a été fait par le client ".$clientOrig["surname"]
            . " ". $clientOrig["name"]
            ." <br> Nom : ".$clientOrig["surname"]." ==> " . $_POST["surname"]
            ." <br> Prénom : ".$clientOrig["name"]." ==> " . $_POST["name"]
            ." <br> Societé : ".$clientOrig["company_name"]." ==> " . $_POST["company_name"]
            ." <br> Address : ".$clientOrig["address"]." ==> " . $_POST["address"]
            ." <br> Code Postal : ".$clientOrig["postalCode"]." ==> " . $_POST["postalcode"]
            ." <br> Phone: ".$clientOrig["phone"]." ==> " . $_POST["phone"]
            ." <br> Phone: ".$clientOrig["city"]." ==> " . $_POST["city"]
            ." <br> Phone: ".$clientOrig["pays"]." ==> " . $_POST["pays"]
            ." <br> Phone: ".$clientOrig["siret"]." ==> " . $_POST["siret"]
            ." <br> Bien à vous, <br> Exakom.");

        if(!$mailAdmin->send()) {
            //echo 'Message could not be sent.';
            // echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            // echo 'Message has been sent';
        }

        print json_encode("DONE");
    }
}