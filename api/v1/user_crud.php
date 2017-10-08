<?php
session_start();
include_once 'include_all.php';
include_once '../chromePHP.php';
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
            'email'=>$user->getEmail(),
            'department'=>$user->getDepartment()
        );

        print json_encode($arrInfo);
    }
    else {
        print "no session";
    }
    $user = null;
    $arrInfo = null;
}
else if($mode == 2) {
    $user = new users();
    $user = $user->rechCommercial();

    print json_encode($user);
    $user = null;
}
else if($mode == 3) {
    $user = new users();
    $user = $user->findByPrimaryKey($_GET['id']);
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
            'email'=>$user->getEmail(),
            'department'=>$user->getDepartment(),
            'minval'=>$user->getMinVal(),
            'maxval'=>$user->getMaxVal()
        );

        print json_encode($arrInfo);
    }
    else {
        print "no session";
    }
    $user = null;
    $arrInfo = null;
}
else if($mode == 4) {
    $userCommercial = new users();
    $userCommercial = $userCommercial->findByPrimaryKey($_SESSION['uid']);
    if($userCommercial) {
        $users = new users();
        $users = $users->rechClientParCommercial($userCommercial->getUid(), $userCommercial->getDepartment());
        print json_encode($users);
    }
    $userCommercial = null;
    $users = null;
}
else if ($mode == 5){
    $users = new users();
    $users = $users->rechercher();
    print json_encode($users);
    $users = null;
}