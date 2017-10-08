<?php
session_start();
include_once 'include_all.php';
include_once '../chromePHP.php';
$mode = $_GET['mode'];
if ($mode == 1) {
    $youtube = new youtube_links();
    $youtube = $youtube->rechercher();

    print json_encode($youtube);
    $youtube = null;
}
else if ($mode == 2) {
    $youtube = new youtube_links();
    $youtube->setTitle('');
    $youtube->setDescription('');
    $youtube->setyoutubeLink('');
    $youtube->save();

    $youtube = new youtube_links();
    $youtube = $youtube->rechercher();

    print json_encode($youtube);
    $youtube = null;
}
else if($mode == 3) {
    $youtube = new youtube_links();
    $youtube = $youtube->findByPrimaryKey($_GET['id']);
    $youtube->setTitle($_GET['title']);
    $youtube->setDescription($_GET['description']);
    $youtube->setyoutubeLink($_GET['links']);
    $youtube->save();

    $youtube = new youtube_links();
    $youtube = $youtube->rechercher();

    print json_encode($youtube);
    $youtube = null;
}