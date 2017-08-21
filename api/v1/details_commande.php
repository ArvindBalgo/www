<?php
session_start();
include_once 'include_all.php';
require_once '../PHPMailerAutoload.php';
$mode = $_GET['mode'];
if ($mode == 1) {
    $details = new orders_details();
    $details = $details->rechCustom();

    print json_encode($details);

} else if ($mode == 2) {
    $factures = new factures();
    $factures = $factures->rechByOrder();

    print json_encode($factures);
} else if ($mode == 3) {
    date_default_timezone_set('America/Los_Angeles');
    $mail = new PHPMailer;
    $mailAdmin = new PHPMailer;

//$mail->SMTPDebug = 3;                               // Enable verbose debug output
    $orders = new orders_main();
    $orders = $orders->findByPrimaryKey($_GET["id_order"]);

    $idUser = $orders->getIdUser();
    $user = new users();
    $user = $user->findByPrimaryKey($idUser);
    $paysClient = $user->getPays();
    $pays = $paysClient;

    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = 'mail.exakom.fr';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Username = 'contact@exakom.fr';                 // SMTP username
    $mail->Password = '95961b98';                           // SMTP password
    $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 25;                                    // TCP port to connect to

    $mail->setFrom('contact@exakom.fr', 'Exakom');
    $mail->addAddress($user->getEmail(), strtoupper($user->getName()) . " " . strtoupper($user->getSurname()));     // Add a recipient
    $mail->addReplyTo('contact@exakom.fr', 'Information');
    $mail->addAttachment('../pdf/'.$_GET["id_order"].".pdf");         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
    $mail->isHTML(true);                                  // Set email format to HTML

    if ($pays == 'FR') {
        $mail->Subject = utf8_decode('Facture de commande');
        $mail->Body = utf8_decode('Bonjour ' . strtoupper($user->getName()) . " " . strtoupper($user->getSurname()) . ", <br> Votre commande N° " . $_GET["id_order"] . " a bien été enregistré, ci-joint est votre facture d'Exakom.<br> Cordialment <br> Exakom");

    } else if ($pays == "EN") {
        $mail->Subject = utf8_decode('Exakom order receipt');
        $mail->Body = utf8_decode('Hello ' . strtoupper($user->getName()) . " " . strtoupper($user->getSurname()) . ", <br> Your order N° " . $_GET["id_order"] . " has been registered. Please find attached your bill from Exakom. <br> Regards <br> Exakom");
    } else if ($pays == "AL") {
        $mail->Subject = utf8_decode('Exakom bestellen quittung');
        /*$mail->Body = utf8_decode('Hallo ' . strtoupper($user->getName()) . " " . strtoupper($user->getSurname()) . ", <br> Ihre Bestellung Nr " . $orders_details['id'] . " registriert worden ist, werden Sie bald Ihre Rechnung. <br> Grüße <br> Exakom");*/
    } else if ($pays == "ES") {
        $mail->Subject = utf8_decode('Recibo de pedido de Exakom');
        /*$mail->Body = utf8_decode('Holla ' . strtoupper($user->getName()) . " " . strtoupper($user->getSurname()) . ", <br> Su orden N ° " . $orders_details['id'] . " haya sido registrada, pronto recibirá su factura. <br> Saludos <br> Exakom");*/
    } else if ($pays == "IT") {
        $mail->Subject = utf8_decode('Ricevuta di ordine Exakom');
        /*$mail->Body = utf8_decode('Ciao ' . strtoupper($user->getName()) . " " . strtoupper($user->getSurname()) . ", <br> Il tuo ordine N °  " . $orders_details['id'] . " è stato registrato, riceverai presto la tua fattura.<br> Saluti <br> Exakom");*/
    }

    if (!$mail->send()) {
        //echo 'Message could not be sent.';
        // echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        // echo 'Message has been sent';
    }
}