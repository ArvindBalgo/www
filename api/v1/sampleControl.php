<?php
include_once 'include_all.php';
include_once "../chromePHP.php";

$mode = $_GET['mode'];
if($mode == 0) {
    $id = $_GET["id"];
    $cata = new cata();
    $results = $cata->findAllByMetier($id);
    /*$sample = new gabarits();
    $sample = $sample->findByIdModel($id);*/
    print json_encode($results);
    return;
}
else if($mode == 1) {
    $type = $_GET["type"];
    $sample = new gabarits();
    $sample = $sample->findByType($type);
    $cata  = new cata();
    $cata = $cata->rechercher();
    if(count($cata) == 0) {
        print "null";
        return;
    }


    $arrData = [];
/*    foreach($sample as $ligne) {
        $img_src = [];
        $img_src[] =array('id'=>$ligne["id"], "src"=>$ligne["src"]);
        $arrData[] = array('id'=>$ligne["id"], 'title'=>$ligne["description"], 'thumbnail_src'=>$ligne["src"], 'img_src'=>$img_src);
    }
*/
    foreach($cata as $ligne) {
        $img_src = [];
        $arrFront = [];
        $arrBack = [];
        $arrElem = [];

        $cata_ligne = new cata_ligne();
        $cata_ligne = $cata_ligne->findByPrimaryKey($ligne["id_front"]);
        $cata_ligne_params = new cata_ligne_params();
        $cata_ligne_params = $cata_ligne_params->findByIdCata($cata_ligne->getId());
        $arrFront = array('id'=>$cata_ligne->getId(), 'src'=>$cata_ligne->getSrc(), 'title'=>$cata_ligne->getTitle(), 'params' =>$cata_ligne_params);

        $cata_back = $cata_ligne->findByPrimaryKey($ligne["id_back"]);
        $cata_ligne_params1 = new cata_ligne_params();
        $cata_ligne_params1 =  $cata_ligne_params1->findByIdCata($cata_back->getId());

        $arrBack = array('id'=>$cata_back->getId(), 'src'=>$cata_back->getSrc(), 'title'=>$cata_back->getTitle(), 'params'=>$cata_ligne_params1);

        //$img_src[] =array('id'=>$cata_ligne->getId(), "src"=>$cata_ligne->getSrc());
        //$arrData[] = array('id'=>$ligne["id"], 'title'=>$ligne["libelle"], 'thumbnail_src'=>$ligne["src"], 'img_src'=>$img_src);
        $arrData[] = array('id'=>$ligne["id"], 'title'=>$ligne["libelle"], 'thumbnail_src'=>$ligne["src"], 'elemfront'=>$arrFront, 'elemback'=>$arrBack);
    }
    print json_encode($arrData);
    //print json_encode($sample);
    return;
}
else if($mode == 2){
    $data = json_encode($_GET["data"]);
    $sample = new sample();
    $sample->setIdModelMetier(2);
    $sample->setDescription("1324568");
    $sample->setContent(($data));
    $sample->save();
    print json_decode($data);
}
else if($mode == 3){
    $cata_metier = new cata_metier();
    $cata_metier = $cata_metier->findByMetier($_GET["metier"]);
    $arrIdCata = [];
    foreach($cata_metier as $ligne){
        $arrIdCata[] = $ligne["id_cata"];
    }
    $strCata = implode(",", $arrIdCata);
    $cata  = new cata();
    $cata = $cata->findAllByIdCataRange($strCata);

    $arrData = [];
    /*    foreach($sample as $ligne) {
            $img_src = [];
            $img_src[] =array('id'=>$ligne["id"], "src"=>$ligne["src"]);
            $arrData[] = array('id'=>$ligne["id"], 'title'=>$ligne["description"], 'thumbnail_src'=>$ligne["src"], 'img_src'=>$img_src);
        }
    */
    foreach($cata as $ligne) {
        $img_src = [];
        $arrFront = [];
        $arrBack = [];
        $arrElem = [];

        $cata_ligne = new cata_ligne();
        if($ligne["id_front"] > 0){
            $cata_ligne = $cata_ligne->findByPrimaryKey($ligne["id_front"]);
            $cata_ligne_params = new cata_ligne_params();
            $cata_ligne_params = $cata_ligne_params->findByIdCata($cata_ligne->getId());
            $arrFront = array('id'=>$cata_ligne->getId(), 'src'=>$cata_ligne->getSrc(), 'title'=>$cata_ligne->getTitle(), 'params' =>$cata_ligne_params);
        }
        if($ligne["id_back"] > 0) {
            $cata_back = $cata_ligne->findByPrimaryKey($ligne["id_back"]);
            $cata_ligne_params1 = new cata_ligne_params();
            $cata_ligne_params1 =  $cata_ligne_params1->findByIdCata($cata_back->getId());

            $arrBack = array('id'=>$cata_back->getId(), 'src'=>$cata_back->getSrc(), 'title'=>$cata_back->getTitle(), 'params'=>$cata_ligne_params1);

        }
        $arrData[] = array('id'=>$ligne["id"], 'title'=>$ligne["libelle"], 'thumbnail_src'=>$ligne["src"], 'elemfront'=>$arrFront, 'elemback'=>$arrBack);

    }
    print json_encode($arrData);
    return;
}
else if($mode == 4){
    $cata = new cata();
    $results = $cata->findAllBySousCategory($_GET["id"]);
    /*$sample = new gabarits();
    $sample = $sample->findByIdModel($id);*/
    print json_encode($results);
    return;
}
else if($mode == 5) {
    $cata  = new cata();
    $cata = $cata->findByPrimaryKey($_GET["id"]);
    if(count($cata) == 0) {
        print "null";
        return;
    }
    
    $cataMetier = new cata_metier();
    $cataMetier = $cataMetier->findByIdCata($_GET["id"]);
    $modelMetier = new modelmetier();
    $modelMetier = $modelMetier->findByPrimaryKey($cataMetier->getIdMetier());

    $arrData = [];
    /*    foreach($sample as $ligne) {
            $img_src = [];
            $img_src[] =array('id'=>$ligne["id"], "src"=>$ligne["src"]);
            $arrData[] = array('id'=>$ligne["id"], 'title'=>$ligne["description"], 'thumbnail_src'=>$ligne["src"], 'img_src'=>$img_src);
        }
    */

    //foreach($cata as $ligne) {
    $ligne = $cata;
        $img_src = [];
        $arrFront = [];
        $arrBack = [];
        $arrElem = [];

        $cata_ligne = new cata_ligne();
        $cata_ligne = $cata_ligne->findByPrimaryKey( $cata->getIdFront());
    if($cata_ligne != null){
        $cata_ligne_params = new cata_ligne_params();
        $cata_ligne_params = $cata_ligne_params->findByIdCata($cata_ligne->getId());
        $arrFront = array('id'=>$cata_ligne->getId(), 'src'=>$cata_ligne->getSrc(), 'title'=>$cata_ligne->getTitle(), 'params' =>$cata_ligne_params);
    }
    else{
        $arrFront = array();
    }

    $cata_ligne = new cata_ligne();
        $cata_back = $cata_ligne->findByPrimaryKey($cata->getIdBack());
    if($cata_back != null) {
        $cata_ligne_params1 = new cata_ligne_params();
        $cata_ligne_params1 =  $cata_ligne_params1->findByIdCata($cata_back->getId());

        $arrBack = array('id'=>$cata_back->getId(), 'src'=>$cata_back->getSrc(), 'title'=>$cata_back->getTitle(), 'params'=>$cata_ligne_params1);

    }
    else {
        $arrBack = array();
    }

        //$img_src[] =array('id'=>$cata_ligne->getId(), "src"=>$cata_ligne->getSrc());
        //$arrData[] = array('id'=>$ligne["id"], 'title'=>$ligne["libelle"], 'thumbnail_src'=>$ligne["src"], 'img_src'=>$img_src);
        $arrData[] = array( 'id'=>$cata->getId_Cata(),
                            'title'=>$cata->getLibelle(),
                            'thumbnail_src'=>$cata->getSrc(),
                            'escargot'=>$cata->getEscargot(),
                            'contours'=>$cata->getContours(),
                            'liserai'=>$cata->getLiserai(),
                            'coucher'=>$cata->getCoucher(),
                            'dimensions'=>$cata->getDimensions(),
                            'qte'=>$modelMetier->getQte(),
                            'elemfront'=>$arrFront,
                            'elemback'=>$arrBack);
    //}
    print json_encode($arrData);
    //print json_encode($sample);
    return;
}
else if($mode == 6) {
    $cata_metier = new cata_metier();
    $cata_metier->deleteIdCata($_GET["id"]);


    $cata_ligne_params = new cata_ligne_params();
    $cata_ligne_params->delByIdCataLigne($_GET["id_back"]);
    $cata_ligne_params->delByIdCataLigne($_GET["id_front"]);

    $cata_ligne = new cata_ligne();
    $cata_ligne->delete($_GET["id_back"]);
    $cata_ligne->delete($_GET["id_front"]);

    $cata = new cata();
    $cata->delete($_GET["id"]);

    print "done";
}
else if($mode == 7) {
    $id = $_GET["id"];
    $cata = new cata();
    $cata = $cata->findByPrimaryKey($id);

    $cataMetier = new cata_metier();
    $cataMetier = $cataMetier->findByIdCata($_GET["id"]);

    $modelMetier = new modelmetier();
    $modelMetier = $modelMetier->findByPrimaryKey($cataMetier->getIdMetier());

    $arrCata = array('id'=>$cata->getId_Cata(),
        'libelle'=>$cata->getLibelle(),
        'reference'=>$cata->getReference(),
        'description'=>$cata->getDescription(),
        'dimensions' =>$cata->getDimensions(),
        'escargot' =>$cata->getEscargot(),
        'contours' =>$cata->getContours(),
        'liserai' =>$cata->getLiserai(),
        'coucher' =>$cata->getCoucher(),
        'gabarit' =>$cata->getGabarit(),
        'qte' => $modelMetier->getQte()
        );
    print json_encode($arrCata);
}
else if($mode == 8) {
    $arrData = [];
    $metier = new listmetier();
    $metier = $metier->rechTous();
    $arrData["metier"] = $metier;

    $modelMetier = new modelmetier();

    $modelMetier = $modelMetier->rechTous();
    $arrData["modelsmetier"] = $modelMetier;
    //print json_encode($modelMetier);
    //print json_encode($metier);
    print json_encode($arrData);
}
else if($mode == 9) {
    $cata  = new cata();
    $cata = $cata->findByPrimaryKey($_GET["id_model"]);
    if(count($cata) == 0) {
        print "null";
        return;
    }
    $id_souscategory_coeffprix = $cata->getIdSousCategoryCoeffPrix();
    $tarif_man = new tarif_manuel();
    $tarif_man  = $tarif_man->findByIDCata($cata->getId_Cata());

    $coeffprix = new coeff_prix();
    $coeffprix = $coeffprix->findByProduit($id_souscategory_coeffprix);

    $cata_metier = new cata_metier();
    $cata_metier = $cata_metier->findByIdCata($_GET["id_model"]);

    $coeffprix1 = new coeff_prix();
    $coeffprix1 = $coeffprix1->getListIdPapierSupport($cata_metier->getIdModelMetier() , $id_souscategory_coeffprix);

    if($coeffprix1['ligne'] != null){
        $cata_papier = new cata_papier();
        $cata_papier = $cata_papier->findByList($coeffprix1['ligne']);
    }
    else{
        $cata_papier = array();
    }
    
    $cata_dim = new cata_dimension();
    $cata_dim = $cata_dim->findByIDSCategory($cata_metier->getIdModelMetier() , $id_souscategory_coeffprix);


    $cataMetier = new cata_metier();
    $cataMetier = $cataMetier->findByIdCata($_GET["id_model"]);

    $modelMetier = new modelmetier();
    $modelMetier = $modelMetier->findByPrimaryKey($cataMetier->getIdMetier());
    $arrData = [];

    //foreach($cata as $ligne) {
    $ligne = $cata;
    $img_src = [];
    $arrFront = [];
    $arrBack = [];
    $arrElem = [];

    $cata_ligne = new cata_ligne();
    $cata_ligne = $cata_ligne->findByPrimaryKey( $cata->getIdFront());
    if($cata_ligne != null){
        $cata_ligne_params = new cata_ligne_params();
        $cata_ligne_params = $cata_ligne_params->findByIdCata($cata_ligne->getId());
        $arrFront = array('id'=>$cata_ligne->getId(), 'src'=>$cata_ligne->getSrc(), 'title'=>$cata_ligne->getTitle(), 'params' =>$cata_ligne_params);
    }
    else{
        $arrFront = array();
    }

    $cata_ligne = new cata_ligne();
    $cata_back = $cata_ligne->findByPrimaryKey($cata->getIdBack());
    if($cata_back != null) {
        $cata_ligne_params1 = new cata_ligne_params();
        $cata_ligne_params1 =  $cata_ligne_params1->findByIdCata($cata_back->getId());

        $arrBack = array('id'=>$cata_back->getId(), 'src'=>$cata_back->getSrc(), 'title'=>$cata_back->getTitle(), 'params'=>$cata_ligne_params1);

    }
    else {
        $arrBack = array();
    }

    //$img_src[] =array('id'=>$cata_ligne->getId(), "src"=>$cata_ligne->getSrc());
    //$arrData[] = array('id'=>$ligne["id"], 'title'=>$ligne["libelle"], 'thumbnail_src'=>$ligne["src"], 'img_src'=>$img_src);
    $arrData[] = array(     'id'=>$cata->getId_Cata(),
                            'title'=>$cata->getLibelle(),
                            'thumbnail_src'=>$cata->getSrc(),
                            'escargot'=>$cata->getEscargot(),
                            'contours'=>$cata->getContours(),
                            'liserai'=>$cata->getLiserai(),
                            'coucher'=>$cata->getCoucher(),
                            'dimensions'=>$cata->getDimensions(),
                            'qte'=>$modelMetier->getQte(),
                            'elemfront'=>$arrFront,
                            'elemback'=>$arrBack,
                            'type_support'=>$cata_papier,
                            'info_prix'=>$coeffprix,
                            'coeff_dims'=>$cata_dim,
                            'type_tarif'=>$id_souscategory_coeffprix,
                            'tarifManuel'=>$tarif_man);
    //}

    print json_encode($arrData);
    //print json_encode($sample);
    return;
}
else if($mode == 10) {
    $modelMetier = new modelmetier();

    $modelMetier = $modelMetier->rechTous();
    print json_encode($modelMetier);

}
else if($mode == 11) {
    $id = $_GET["id"];
    $cata = new cata();
    $results = $cata->fnFindAllModelCategory($id);
    /*$sample = new gabarits();
    $sample = $sample->findByIdModel($id);*/
    print json_encode($results);
    return;
}
else if($mode == 12) {
    $id = $_GET["id"];
    $cata = new cata();
    $results  = $cata->findAllBySousCategory($id);
    print json_encode($results);
    return;
}
else if($mode == 13) {
    $id_produit = $_GET["id_produit"];
    $id_subcategory = $_GET["id_category"];

    $cataMetier = new cata_metier();
    $cataMetier = $cataMetier->fnUpdateSubCat($id_produit, $id_subcategory);
    print json_encode($cataMetier);
}
else if($mode == 14) {
    $id = $_GET["id"];
    $cata = new cata();
    $results = $cata->findAllByModelMetier($id);
    /*$sample = new gabarits();
    $sample = $sample->findByIdModel($id);*/
    print json_encode($results);
    return;
}
else if($mode == 15) {
    $pays = new pays();
    $pays = $pays->rechercher();
    print json_encode($pays);
}
