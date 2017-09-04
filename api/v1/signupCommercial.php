<?php
include_once 'include_all.php';
require 'authFN.php';
require_once '../classes/passwordHash.php';
require '../PHPMailerAutoload.php';
$response = array();
date_default_timezone_set('America/Los_Angeles');
//$r = json_decode($app->request->getBody());
//verifyRequiredParams(array('email', 'name', 'password'),$r->customer);
//require_once 'passwordHash.php';
$db = new DbHandler();

$phone = $_GET["telephone"];
$name = $_GET["prenom"];
$surname = $_GET["nom"];
$email = $_GET["email"];
$address = $_GET["address"];
$postalcode = $_GET["postalCode"];
$nosiret = '';
$pays = $_GET["pays"];
$city = $_GET["city"];
$min_val = $_GET["min_val"];
$max_val = $_GET["max_val"];
$department= $_GET["department"];

$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
$charactersLength = strlen($characters);
$randomString = '';
for ($i = 0; $i < 9; $i++) {
    $randomString .= $characters[rand(0, $charactersLength - 1)];
}

$password = $randomString;
if ($surname == "" || $name == "" || $email == "") {
    $response["status"] = "error";
    $response["message"] = "An user with the provided phone or email exists!";
    echoResponse(201, $response);
    return;
}

$isUserExists = $db->getOneRecord("select 1 from customers_auth where (phone='$phone' or email='$email') and admin=0");
if (!$isUserExists) {
    $passwordHash = passwordHash::hash($password);
    $users = new users();
    $users->setCompanyName("Exakom");
    $users->setToken('');
    $users->setEmail($email);
    $users->setSiret('');
    $users->setPays($pays);
    $users->setCity($city);
    $users->setPhone($phone);
    $users->setPostalCode($postalcode);
    $users->setAddress($address);
    $users->setName($name);
    $users->setSurname($surname);
    $users->setPassword($passwordHash);
    $users->setAdmintype(0);
    $users->setSalesman(1);
    $users->setMinVal($min_val);
    $users->setMaxVal($max_val);
    $users->setDepartment($department);
    $users->save();

    $mail = new PHPMailer;
    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = 'mail.exakom.fr';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Username = 'contact@exakom.fr';                 // SMTP username
    $mail->Password = '95961b98';                           // SMTP password
    $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 25;

    $mail->setFrom('contact@exakom.fr', 'Exakom');
    $mail->addAddress($email, strtoupper($name) . " " . strtoupper($surname));     // Add a recipient
//$mail->addAddress('ellen@example.com');               // Name is optional
    $mail->addReplyTo('contact@exakom.fr', 'Information');
    $mail->isHTML(true);

    $mail->Subject = utf8_decode('Compte Commerciale');
    $mail->Body = utf8_decode('Bonjour ' . strtoupper($name) . " " . strtoupper($surname) . ", <br> Votre compte commerciale est maintenant actif. Voici vos identifiants de connexion <br>Utilisateur:" . $email . "<br> Mot de passe:" . $password . "  <br> Cordialement <br> Exakom");

    if (!$mail->send()) {
        //echo 'Message could not be sent.';
        // echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        // echo 'Message has been sent';
    }

    $mailAdmin = new PHPMailer;
    $mailAdmin->isSMTP();                                      // Set mailer to use SMTP
    $mailAdmin->Host = 'mail.exakom.fr';  // Specify main and backup SMTP servers
    $mailAdmin->SMTPAuth = true;                               // Enable SMTP authentication
    $mailAdmin->Username = 'contact@exakom.fr';                 // SMTP username
    $mailAdmin->Password = '95961b98';                           // SMTP password
    $mailAdmin->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    $mailAdmin->Port = 25;

    $mailAdmin->setFrom('contact@exakom.fr', 'Exakom');
    $mailAdmin->addAddress('contact@exakom.fr', strtoupper($name) . " " . strtoupper($surname));     // Add a recipient
//$mail->addAddress('ellen@example.com');               // Name is optional
    $mailAdmin->addReplyTo('contact@exakom.fr', 'Information');
    $mailAdmin->isHTML(true);

    $mailAdmin->Subject = utf8_decode('Compte Commercial');
    $mailAdmin->Body = utf8_decode('Bonjour ' . strtoupper($name) . " " . strtoupper($surname) . ", <br> Votre compte commercial est maintenant actif. Voici vos identifiants de connexion <br>Utilisateur:" . $email . "<br> Mot de passe:" . $password . "  <br> Cordialement <br> Exakom");

    if (!$mailAdmin->send()) {
        //echo 'Message could not be sent.';
        // echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        // echo 'Message has been sent';
    }

    echo "done";
    /*$table_name = "customers_auth";
    $column_names = array('phone', 'name','surname', 'email', 'password', 'city', 'address', 'pays', 'postalcode', 'nosiret');
    $result = $db->insertIntoTable($r->customer, $column_names, $table_name);
    *//*if ($result != NULL) {
        $response["status"] = 1;
        $response["message"] = "User account created successfully";
        $response["uid"] = $result;
        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['uid'] = $response["uid"];
        $_SESSION['phone'] = $phone;
        $_SESSION['name'] = $name;
        $_SESSION['surname'] = $surname;
        $_SESSION['email'] = $email;
        $_SESSION['admin'] = 0;
        echoResponse(200, $response);
    } else {
        $response["status"] = 0;
        $response["message"] = "Failed to create customer. Please try again";
        echoResponse(201, $response);
    }*/
} else {
    $response["status"] = "error";
    $response["message"] = "An user with the provided phone or email exists!";
    echoResponse(201, $response);
}