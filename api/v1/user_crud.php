<?php
session_start();
include_once 'include_all.php';
date_default_timezone_set('America/Los_Angeles');
$mode = $_GET['mode'];
if ($mode == 1) {
    $user = new users();
    $user = $user->findByPrimaryKey($_SESSION['uid']);
    if ($user) {
        $arrInfo = array('id' => $user->getUid(),
            'name' => $user->getName(),
            'surname' => $user->getSurname(),
            'company' => $user->getCompanyName(),
            'telephone'=> $user->getPhone(),
            'address'=>$user->getAddress(),
            'postalcode'=>$user->getPostalCode(),
            'country'=>$user->getPays(),
            'city'=>$user->getCity(),
            'email'=>$user->getEmail()
        );

        print json_encode($arrInfo);
    }
    else {
        print "no session";
    }

}
else if($mode == 2) {
    $user = new users();
    $user = $user->rechCommercial();

    print json_encode($user);
}