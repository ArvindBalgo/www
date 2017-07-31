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
        $user  = new users();
        $user = $user->findByPrimaryKey($item["id_user"]);

        $item1["fullname"] = $user->getSurname(). " " . $user->getName();
        $item1["email"] = $item["email"];
        $item1["flag"] = $item["flag"];

        $rows[] = $item1;
    }
    print json_encode($rows);
}