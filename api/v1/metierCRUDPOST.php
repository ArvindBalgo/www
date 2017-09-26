<?php
include_once 'include_all.php';
include_once '../chromePHP.php';
if (!isset($_SESSION)) {
    session_start();
}
$mode = $_POST['mode'];


if ($mode == 0) {
//delete function to delete a category
    $id = $_POST["id"];

    $modelmetier_category = new modelmetier_category();
    $modelmetier_category = $modelmetier_category->deleteByCategory($id);

    $modelmetier = new modelmetier();
    $modelmetier = $modelmetier->delete($id);
    print json_encode("done");
} else if ($mode == 1) {
    $id = $_POST["id"];

    $modelmetier_category = new modelmetier_category();
    $modelmetier_category = $modelmetier_category->delete($id);
    print json_encode("done");
} else if ($mode == 2) {
    $id = $_POST["id"];
    $metier = new listmetier();
    $metier->delete($id);
    print json_encode("done");
} else if ($mode == 3) {

    /*
     * 0=>apropos
     * 1=>condition de vente
     * 2=>mentions d'utilisation
     * 3=>mentions legales
     */
    $type = intval($_POST["type"]);

    $apropos = new apropos();
    $apropos = $apropos->rechercher();

    $doc = new docs();
    $doc = $doc->findByPrimaryKey($_POST['type']);
    $arrData = array('id' => $doc->getId(), 'clef' => $doc->getCle(), 'title' => $doc->getTitle(), 'description' => $doc->getDescription(), 'data' => $apropos);
    print json_encode($arrData);
} else if ($mode == 4) {
    $doc = new docs();
    /*
     * 0=>apropos
     * 1=>condition de vente
     * 2=>mentions d'utilisation
     * 3=>mentions legales
     */

    $type = intval($_POST['type']);
    $docu = new docs();
    $docu = $docu->findByPrimaryKey($_POST['id']);
    $docu->setCle($_POST["type"]);
    $docu->setTitle($_POST["title"]);
    $docu->setDescription(addslashes($_POST["contenu"]));
    $docu->save();

    print 'done';
} else if ($mode == 5) {
    $apropos = new apropos();
    $apropos->setDescription('');
    $apropos->save();

    $apropos = new apropos();
    $apropos = $apropos->rechercher();

    $doc = new docs();
    $doc = $doc->findByPrimaryKey($_POST['type']);
    $arrData = array('id' => $doc->getId(), 'clef' => $doc->getCle(), 'title' => $doc->getTitle(), 'description' => $doc->getDescription(), 'data' => $apropos);
    print json_encode($arrData);
} else if ($mode == 6) {
    $contenu = json_decode($_POST['contenu']);

    $docu = new docs();
    $docu = $docu->findByPrimaryKey($contenu->id);
    $docu->setTitle($contenu->title);
    $docu->setDescription(addslashes($docu->getDescription()));
    $docu->save();
    foreach ($contenu->data as $ligne) {
        $apropos = new apropos();
        $apropos = $apropos->findByPrimaryKey($ligne->id);
        $apropos->setDescription(addslashes($ligne->description));
        $apropos->save();
    }

    echo json_encode('done');

} else if ($mode == 7) {
    $contenu = json_decode($_POST['contenu']);

    $apropos = new apropos();
    $apropos = $apropos->findByPrimaryKey($contenu->id);
    $apropos->setDescription(addslashes($contenu->description));
    $apropos->save();

    echo json_encode('done');

} else if ($mode == 8) {
    $apropos = new apropos();
    $apropos = $apropos->delete($_POST["id"]);
    echo json_encode('done');

} else if ($mode == 9) {
    $contenu = json_decode($_POST['contenu']);

    $docu = new docs();
    $docu = $docu->findByPrimaryKey($contenu->id);
    $docu->setTitle($contenu->title);
    $docu->setDescription(addslashes($docu->getDescription()));
    $docu->save();
} else if ($mode == 10) {

    /*
     * 1=>apropos
     * 2=>condition de vente
     * 3=>mentions d'utilisation
     * 4=>mentions legales
     */
    $type = intval($_POST["type"]);

    $conditionvente = new conditionvente();
    $conditionvente = $conditionvente->rechercher();

    $doc = new docs();
    $doc = $doc->findByPrimaryKey($_POST['type']);
    $arrData = array('id' => $doc->getId(), 'clef' => $doc->getCle(), 'title' => ($doc->getTitle()), 'description' => ($doc->getDescription()), 'data' => $conditionvente);

    print json_encode($arrData);
} else if ($mode == 11) {

    $conditionvente = new conditionvente();
    $conditionvente->setDescription('');
    $conditionvente->save();

    $conditionvente = new conditionvente();
    $conditionvente = $conditionvente->rechercher();

    $doc = new docs();
    $doc = $doc->findByPrimaryKey($_POST['type']);
    $arrData = array('id' => $doc->getId(), 'clef' => $doc->getCle(), 'title' => $doc->getTitle(), 'description' => $doc->getDescription(), 'data' => $conditionvente);
    print json_encode($arrData);
} else if ($mode == 12) {
    $contenu = json_decode($_POST['contenu']);

    $conditionvente = new conditionvente();
    $conditionvente = $conditionvente->findByPrimaryKey($contenu->id);
    $conditionvente->setDescription(addslashes($contenu->description));
    $conditionvente->save();

    echo json_encode('done');

} else if ($mode == 13) {
    $conditionvente = new conditionvente();
    $conditionvente = $conditionvente->delete($_POST["id"]);

    echo json_encode('done');
} else if ($mode == 14) {
    $contenu = json_decode($_POST['contenu']);

    $docu = new docs();
    $docu = $docu->findByPrimaryKey($contenu->id);
    $docu->setTitle($contenu->title);
    $docu->setDescription(addslashes($docu->getDescription()));
    $docu->save();
} else if ($mode == 15) {
    // delete by session
    $temp_prod = new temp_prod();
    $temp_prod->delBySessionKey(session_id());
    echo "done";
} else if ($mode == 16) {
    //add instructions
    $pays = $_POST["param"];
    $arrData = [];
    if ($pays == "FR") {
        $instruction = new instructions();
        $instruction = $instruction->rechercher();
        //print json_encode($instruction);
    } else if ($pays == "EN") {
        $instruction = new instructions_en();
        $instruction = $instruction->rechercher();
        //print json_encode($instruction);
    } else if ($pays == "AL") {
        $instruction = new instructions_al();
        $instruction = $instruction->rechercher();
        //print json_encode($instruction);
    } else if ($pays == "IT") {
        $instruction = new instructions_it();
        $instruction = $instruction->rechercher();
        //print json_encode($instruction);
    } else if ($pays == "ES") {
        $instruction = new instructions_es();
        $instruction = $instruction->rechercher();
        //print json_encode($instruction);
    }
    $arrData["instruction"] = $instruction;


    //list des metiers
    $metier = new listmetier();
    $metier = $metier->rechercher();
    $arrData["metier"] = $metier;

    //listes des modelmetiers
    $metier = new modelmetier();
    $metier = $metier->rechercher();
    $arrData["modelmetier"] = $metier;

    //load pub
    $pub = new pub();
    $pub = $pub->findByPays($pays);

    if ($pub == null) {
        $arrData["pub"] = null;
    } else {
        $arrPub = array(
            "id" => $pub->getId(),
            "actif" => $pub->getActif(),
            "link" => $pub->getLink(),
            "pays" => $pub->getPays()
        );
        $arrData["pub"] = $arrPub;
    }

    print json_encode($arrData);
} else if ($mode == 17) {
    $customSalesman = new custom_salesman();
    $customSalesman->setIdCata($_POST["id_cata"]);
    $customSalesman->setTitle($_POST["title"]);
    $customSalesman->setImageSrc($_POST["image_url"].".png");
    $customSalesman->setIdSalesman($_SESSION['uid']);
    $customSalesman->setData(json_encode($_POST["data"]));
    $customSalesman->save();
} else if ($mode == 18) {
    $customSalesman = new custom_salesman();
    $customSalesman = $customSalesman->rechSalesman($_SESSION['uid']);
    /*$rows = [];
    foreach ($customSalesman as $val) {

        $cata = new cata();
        $cata = $cata->findByPrimaryKey($val['id_cata']);
        $val['src'] = $cata->getSrc();
        $rows[] = $val;
    }*/
    print json_encode($customSalesman);

}
else if($mode == 19) {
    $customSalesman = new custom_salesman();
    $customSalesman = $customSalesman->findByPrimaryKey($_POST['id']);
    if($customSalesman) {
        $row = [];
        $row['id'] = $customSalesman->getId();
        $row['idCata'] = $customSalesman->getIdCata();
        $row['data'] = ($customSalesman->getData());
        $cata = new cata();
        $cata = $cata->findByPrimaryKey($customSalesman->getIdCata());
        $id_souscategory_coeffprix = $cata->getIdSousCategoryCoeffPrix();
        $tarif_man = new tarif_manuel();
        $tarif_man = $tarif_man->findByIDCata($cata->getId_Cata());

        $coeffprix = new coeff_prix();
        $coeffprix = $coeffprix->findByProduit($id_souscategory_coeffprix);

        $cata_metier = new cata_metier();
        $cata_metier = $cata_metier->findByIdCata($customSalesman->getIdCata());

        if ($id_souscategory_coeffprix >= 0) {
            $coeffprix1 = new coeff_prix();
            $coeffprix1 = $coeffprix1->getListIdPapierSupport($cata_metier->getIdModelMetier(), $id_souscategory_coeffprix);

        } else {
            $tarif_manuel = new tarif_manuel();
            $tarif_manuel = $tarif_manuel->getSupportById($cata->getId_Cata());
            $coeffprix1 = $tarif_manuel;
        }

        if ($coeffprix1['ligne'] != null) {
            $cata_papier = new cata_papier();
            $cata_papier = $cata_papier->findByList($coeffprix1['ligne']);
        } else {
            $cata_papier = array();
        }

        $cata_dim = new cata_dimension();
        $cata_dim = $cata_dim->findByIDSCategory($cata_metier->getIdModelMetier(), $id_souscategory_coeffprix);

        $cataMetier = new cata_metier();
        $cataMetier = $cataMetier->findByIdCata($customSalesman->getIdCata());

        $modelMetier = new modelmetier();
        $modelMetier = $modelMetier->findByPrimaryKey($cataMetier->getIdMetier());

        $row['title'] = $cata->getLibelle();
        $row["escargot"] = $cata->getEscargot();
        $row["contours"] = $cata->getContours();
        $row["liserai"] = $cata->getLiserai();
        $row["coucher"] = $cata->getCoucher();
        $row["dimensions"] = $cata ->getDimensions();
        $row["qte"] = $modelMetier->getQte();
        $row["idmodelmetier"] = $modelMetier->getId();
        $row["type_support"] = $cata_papier;
        $row["info_prix"] = $coeffprix;
        $row["coeff_dims"] = $cata_dim;
        $row["type_tarif"] = $id_souscategory_coeffprix;
        $row["tarifManuel"] = $tarif_man;


        print json_encode($row);
    }
}