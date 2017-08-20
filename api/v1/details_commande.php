<?php
session_start();
include_once 'include_all.php';
$mode = $_GET['mode'];
if ($mode == 1) {
    $details = new orders_details();
    $details = $details->rechCustom();

    print json_encode($details);
}