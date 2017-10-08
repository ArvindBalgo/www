<?php

require 'authFN.php';
$db = new DbHandler();
$session = $db->destroySession();
$response["status"] = "info";
$response["message"] = "Logged out successfully";
echoResponse(200, $response);
?>