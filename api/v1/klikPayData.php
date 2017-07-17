<?php
/**
 * Created by PhpStorm.
 * User: Arvind
 * Date: 16/07/2017
 * Time: 16:14
 */

include_once 'include_all.php';
$kliknpay = new kliknpay();
if(isset($_POST["NUMXKP"])) {
    $kliknpay->setNUMXKP($_POST["NUMXKP"]);
}

if(isset($_POST["PAIEMENT"])) {
    $kliknpay->setPAIEMENT($_POST["PAIEMENT"]);
}

if(isset($_POST["MONTANTXKP"])) {
    $kliknpay->setNUMXKP($_POST["MONTANTXKP"]);
}

if(isset($_POST["DEVISEXKP"])) {
    $kliknpay->setNUMXKP($_POST["DEVISEXKP"]);
}

if(isset($_POST["IPXKP"])) {
    $kliknpay->setNUMXKP($_POST["IPXKP"]);
}

if(isset($_POST["PAYSRXKP"])) {
    $kliknpay->setNUMXKP($_POST["PAYSRXKP"]);
}

if(isset($_POST["SCOREXKP"])) {
    $kliknpay->setNUMXKP($_POST["SCOREXKP"]);
}

if(isset($_POST["PAYSBXKP"])) {
    $kliknpay->setNUMXKP($_POST["PAYSBXKP"]);
}

$kliknpay->save();