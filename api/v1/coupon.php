<?php
session_start();
include_once 'include_all.php';
include_once '../chromePHP.php';
require '../PHPMailerAutoload.php';
$mode = $_POST['mode'];
if ($mode == 1) {
    $coupon = new coupon_main();
    $coupon = $coupon->rechercher();

    $rows = [];
    foreach ($coupon as $item) {
        $couponDetail = new coupon_details();
        $couponDetail = $couponDetail->getCountByCoupon($item["id"]);
        $item["nb_users"] = $couponDetail["cnt"];
        $couponDetail = new coupon_details();
        $couponDetail = $couponDetail->getCountByCouponUsed($item["id"]);
        $item["nb_users_used"] = $couponDetail["usedCnt"];
        $rows[] = $item;
    }
    print json_encode($rows);
} else if ($mode == 2) {
    $user = new users();
    $user = $user->rechercher();

    $rows = [];
    foreach ($user as $item) {
        $item1 = [];
        $item1["id"] = $item["uid"];
        $item1["fullname"] = $item["surname"] . " " . $item["name"];
        $item1["email"] = $item["email"];
        $rows[] = $item1;
    }
    print json_encode($rows);
} else if ($mode == 3) {
    $code = $_POST["code"];
    $discount = $_POST["discount"];
    $dateDebut = $_POST["dateDebut"];
    $dateFin = $_POST["dateFin"];
    $arrUsers = json_decode($_POST["arrUsers"]);
    /* chromePHP::log($code);
     chromePHP::log($discount);
     chromePHP::log($dateDebut);
     chromePHP::log($dateFin);
     chromePHP::log(json_decode($arrUsers));*/

    $couponMain = new coupon_main();
    $couponMain->setCouponCode($code);
    $couponMain->setDateStart($dateDebut);
    $couponMain->setDateEnd($dateFin);
    $couponMain->setVal($discount);
    $couponMain->save();
    $couponMain = new coupon_main();
    $maxId = $couponMain->getMaxId();

    foreach ($arrUsers as $key => $item) {
        chromePHP::log($item);
        $user = new users();
        $user = $user->findByPrimaryKey($item);
        if ($user) {
            $couponDetail = new coupon_details();
            $couponDetail->setIdUser($user->getUid());
            $couponDetail->setIdCoupon($maxId["id"]);
            $couponDetail->setIdOrder(0);
            $couponDetail->setEmail($user->getEmail());
            $couponDetail->setDateUsed(date("Y-m-d"));
            $couponDetail->setFlag("UNUSED");
            $couponDetail->save();
        }
    }
    print json_encode("DONE");
} else if ($mode == 4) {
    $idCoupon = $_POST["id"];
    $couponDetail = new coupon_details();
    $couponDetail = $couponDetail->findByCouponCode($idCoupon);

    $rows = [];
    foreach ($couponDetail as $item) {
        $item1 = [];
        $user = new users();
        $user = $user->findByPrimaryKey($item["id_user"]);

        $item1["fullname"] = $user->getSurname() . " " . $user->getName();
        $item1["email"] = $item["email"];
        $item1["flag"] = $item["flag"];

        $rows[] = $item1;
    }
    print json_encode($rows);
} else if ($mode == 5) {
    $idCoupon = $_POST["id"];
    $couponMain = new coupon_main();
    $couponMain->delete($idCoupon);
    $couponDetail = new coupon_details();
    $couponDetail->delByIdCoupon($idCoupon);
    print json_encode("DONE");
}
else if ($mode == 6) {
    $idCoupon = $_POST["id"];
    $couponMain = new coupon_main();
    $couponMain = $couponMain->findByPrimaryKey($idCoupon);
    $couponMain->setEmailingFlag(1);
    $couponMain->save();

    $couponDetail = new coupon_details();
    $couponDetail = $couponDetail->findByCouponCode($idCoupon);
    foreach ($couponDetail as $item){
        $mail = new PHPMailer;
        $mailAdmin = new PHPMailer;

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

        $idUser = $_SESSION['uid'];
        $user = new users();
        $user = $user->findByPrimaryKey($item["id_user"]);
        $paysClient  = $user->getPays();

        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'mail.exakom.fr';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'contact@exakom.fr';                 // SMTP username
        $mail->Password = '95961b98';                           // SMTP password
        $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 25;                                    // TCP port to connect to

        $mail->setFrom('contact@exakom.fr', 'Exakom');
        $mail->addAddress($user->getEmail(), strtoupper($user->getName() ). " " . strtoupper($user->getSurname()));
        $mail->addReplyTo('contact@exakom.fr', 'Information');
        $mail->isHTML(true);                                  // Set email format to HTML

        //if($pays == 'FR') {
            $mail->Subject = utf8_decode('Coupon remise');
            $mail->Body    = utf8_decode('Bonjour '. strtoupper($user->getName() ). " " . strtoupper($user->getSurname()) .", <br> Félicitation,  vous avez reçu un coupon remise de ".$couponMain->getVal()."%. Veuillez utiliser le code suivant pour avoir votre remise sur votre prochaine commande. <b>CODE:</b>.".$couponMain->getCouponCode()."<br> Cordialment <br> Exakom");

        //}
      /*  else if($pays == "EN") {
            $mail->Subject = utf8_decode('Exakom order receipt');
            $mail->Body    = utf8_decode('Hello '. strtoupper($user->getName() ). " " . strtoupper($user->getSurname()) .", <br> Your order N° ".$orders_details['id']." has been registered, you will soon receive your invoice. <br> Regards <br> Exakom");
        }
        else if($pays == "AL") {
            $mail->Subject = utf8_decode('Exakom bestellen quittung');
            $mail->Body    = utf8_decode('Hallo '. strtoupper($user->getName() ). " " . strtoupper($user->getSurname()) .", <br> Ihre Bestellung Nr ".$orders_details['id']." registriert worden ist, werden Sie bald Ihre Rechnung. <br> Grüße <br> Exakom");
        }
        else if($pays == "ES") {
            $mail->Subject = utf8_decode('Recibo de pedido de Exakom');
            $mail->Body    = utf8_decode('Holla '. strtoupper($user->getName() ). " " . strtoupper($user->getSurname()) .", <br> Su orden N ° ".$orders_details['id']." haya sido registrada, pronto recibirá su factura. <br> Saludos <br> Exakom");
        }
        else if($pays == "IT") {
            $mail->Subject = utf8_decode('Ricevuta di ordine Exakom');
            $mail->Body    = utf8_decode('Ciao '. strtoupper($user->getName() ). " " . strtoupper($user->getSurname()) .", <br> Il tuo ordine N °  ".$orders_details['id']." è stato registrato, riceverai presto la tua fattura.<br> Saluti <br> Exakom");
        }*/

        if(!$mail->send()) {
            //echo 'Message could not be sent.';
            // echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            // echo 'Message has been sent';
        }

    }
    print json_encode("DONE");

}
