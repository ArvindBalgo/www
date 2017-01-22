<?php
include_once 'include_all.php';
include_once '../chromePHP.php';
$mode = $_GET['mode'];


if ($mode == 0){
//delete function to delete a category
    $id = $_GET["id"];

    $modelmetier_category = new modelmetier_category();
    $modelmetier_category = $modelmetier_category->deleteByCategory($id);

    $modelmetier = new modelmetier();
    $modelmetier = $modelmetier->delete($id);
    print "done";
}
else if($mode == 1) {
    $id = $_GET["id"];

    $modelmetier_category = new modelmetier_category();
    $modelmetier_category = $modelmetier_category->delete($id);
    print "done";
}
else if ($mode == 2) {
    $id = $_GET["id"];
    $metier  = new listmetier();
    $metier->delete($id);
    print "done";
}
else if($mode == 3) {

    /*
     * 0=>apropos
     * 1=>condition de vente
     * 2=>mentions d'utilisation
     * 3=>mentions legales
     */
    $pays = $_GET["param"];
    $type = intval($_GET["type"]);

    if($pays == "FR") {
        $apropos = new apropos();
        $doc = new docs();
    }
    else if($pays == "EN"){
        $apropos = new apropos_en();
        $doc = new docs_en();
    }
    else if($pays == "AL"){
        $apropos = new apropos_al();
        $doc = new docs_al();
    }
    else if($pays == "ES"){
        $apropos = new apropos_es();
        $doc = new docs_es();
    }
    else if($pays == "IT"){
        $apropos = new apropos_it();
        $doc = new docs_it();
    }
    $apropos = $apropos->rechercher();


    $doc = $doc->findByPrimaryKey($_GET['type']);
    $arrData = array('id'=>$doc->getId(), 'clef'=>$doc->getCle() , 'title'=>$doc->getTitle() , 'description'=>$doc->getDescription(), 'data'=>$apropos);
    print json_encode($arrData);
}
else if($mode == 4) {
    $doc = new docs();
    /*
     * 0=>apropos
     * 1=>condition de vente
     * 2=>mentions d'utilisation
     * 3=>mentions legales
     */

    $type = intval($_GET['type']);
    $docu = new docs();
    $docu = $docu->findByPrimaryKey($_GET['id']);
    $docu->setCle($_GET["type"]);
    $docu->setTitle($_GET["title"]);
    $docu->setDescription(addslashes($_GET["contenu"]));
    $docu->save();

    print 'done';
}
else if($mode == 5) {
    $pays = $_GET["param"];
    if($pays == "FR") {
        $apropos = new apropos();
        $apropos1 = new apropos();
        $doc = new docs();
    }
    else if($pays == "EN"){
        $apropos = new apropos_en();
        $apropos1 = new apropos_en();
        $doc = new docs_en();
    }
    else if($pays == "AL"){
        $apropos = new apropos_al();
        $apropos1 = new apropos_al();
        $doc = new docs_al();
    }
    else if($pays == "ES"){
        $apropos = new apropos_es();
        $apropos1 = new apropos_es();
        $doc = new docs_es();
    }
    else if($pays == "IT"){
        $apropos = new apropos_it();
        $apropos1 = new apropos_it();
        $doc = new docs_it();
    }

    //$apropos = new apropos();
    $apropos->setDescription('');
    $apropos->save();

    //$apropos = new apropos1();
    $apropos = $apropos1->rechercher();


    $doc = $doc->findByPrimaryKey($_GET['type']);
    $arrData = array('id'=>$doc->getId(), 'clef'=>$doc->getCle() , 'title'=>$doc->getTitle() , 'description'=>$doc->getDescription(), 'data'=>$apropos);
    print json_encode($arrData);
}
else if($mode == 6) {
    $contenu = json_decode($_GET['contenu']);

    $pays = $_GET["param"];
    if($pays == "FR") {
        $docu = new docs();
    }
    else if($pays == "EN"){
        $docu = new docs_en();
    }
    else if($pays == "AL"){
        $docu = new docs_al();
    }
    else if($pays == "ES"){
        $docu = new docs_es();
    }
    else if($pays == "IT"){
        $docu = new docs_it();
    }

    $docu = $docu->findByPrimaryKey($contenu->id);
    $docu->setTitle($contenu->title);
    $docu->setDescription(addslashes($docu->getDescription()));
    $docu->save();
    foreach ($contenu->data as $ligne){
        if($pays == "FR") {
            $apropos = new apropos();
        }
        else if($pays == "EN"){
            $apropos = new apropos_en();
        }
        else if($pays == "AL"){
            $apropos = new apropos_al();
        }
        else if($pays == "ES"){
            $apropos = new apropos_es();
        }
        else if($pays == "IT"){
            $apropos = new apropos_it();
        }
        $apropos = $apropos->findByPrimaryKey($ligne->id);
        $apropos->setDescription(addslashes($ligne->description));
        $apropos->save();
    }

    return 'done';

}

else if($mode == 7) {
    $contenu = json_decode($_GET['contenu']);
    $pays = $_GET["param"];

    if($pays == "FR") {
        $apropos = new apropos();
    }
    else if($pays == "EN"){
        $apropos = new apropos_en();
    }
    else if($pays == "AL"){
        $apropos = new apropos_al();
    }
    else if($pays == "ES"){
        $apropos = new apropos_es();
    }
    else if($pays == "IT"){
        $apropos = new apropos_it();
    }

    $apropos = $apropos->findByPrimaryKey($contenu->id);
    $apropos->setDescription(addslashes($contenu->description));
    $apropos->save();

    return 'done';

}

else if($mode == 8) {
    $pays = $_GET["param"];

    if($pays == "FR") {
        $apropos = new apropos();
    }
    else if($pays == "EN"){
        $apropos = new apropos_en();
    }
    else if($pays == "AL"){
        $apropos = new apropos_al();
    }
    else if($pays == "ES"){
        $apropos = new apropos_es();
    }
    else if($pays == "IT"){
        $apropos = new apropos_it();
    }

    $apropos = $apropos->delete($_GET["id"]);
    return 'done';

}
else if($mode == 9) {
    $contenu = json_decode($_GET['contenu']);
    $pays = $_GET["param"];
    if($pays == "FR") {
        $docu = new docs();
    }
    else if($pays == "EN"){
        $docu = new docs_en();
    }
    else if($pays == "AL"){
        $docu = new docs_al();
    }
    else if($pays == "ES"){
        $docu = new docs_es();
    }
    else if($pays == "IT"){
        $docu = new docs_it();
    }

    $docu = $docu->findByPrimaryKey($contenu->id);
    $docu->setTitle($contenu->title);
    $docu->setDescription(addslashes($docu->getDescription()));
    $docu->save();
}
else if($mode == 10) {

    /*
     * 1=>apropos
     * 2=>condition de vente
     * 3=>mentions d'utilisation
     * 4=>mentions legales
     */
    $type = intval($_GET["type"]);

    $conditionvente = new conditionvente();
    $conditionvente = $conditionvente->rechercher();

    $doc = new docs();
    $doc = $doc->findByPrimaryKey($_GET['type']);
    $arrData = array('id'=>$doc->getId(), 'clef'=>$doc->getCle() , 'title'=>($doc->getTitle()) , 'description'=>($doc->getDescription()), 'data'=>$conditionvente);

    print json_encode($arrData);
}
else if($mode == 11) {

    $conditionvente = new conditionvente();
    $conditionvente->setDescription('');
    $conditionvente->save();

    $conditionvente = new conditionvente();
    $conditionvente = $conditionvente->rechercher();

    $doc = new docs();
    $doc = $doc->findByPrimaryKey($_GET['type']);
    $arrData = array('id'=>$doc->getId(), 'clef'=>$doc->getCle() , 'title'=>$doc->getTitle() , 'description'=>$doc->getDescription(), 'data'=>$conditionvente);
    print json_encode($arrData);
}

else if($mode == 12) {
    $contenu = json_decode($_GET['contenu']);

    $conditionvente = new conditionvente();
    $conditionvente = $conditionvente->findByPrimaryKey($contenu->id);
    $conditionvente->setDescription(addslashes($contenu->description));
    $conditionvente->save();

    return 'done';

}
else if($mode == 13) {
    $conditionvente = new conditionvente();
    $conditionvente = $conditionvente->delete($_GET["id"]);

    return 'done';
}
else if($mode == 14) {
    $contenu = json_decode($_GET['contenu']);

    $docu = new docs();
    $docu = $docu->findByPrimaryKey($contenu->id);
    $docu->setTitle($contenu->title);
    $docu->setDescription(addslashes($docu->getDescription()));
    $docu->save();
}