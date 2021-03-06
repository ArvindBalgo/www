<?php
include_once 'include_all.php';
include_once '../chromePHP.php';

$mode = $_GET['mode'];
if ($mode == 0) {

    $metier = new listmetier();

    $metier = $metier->rechercher();
    print json_encode($metier);
    $metier = null;
    return;
} else if ($mode == 1) {
    $metier = new listmetier();
    $metier->setLibelle($_GET["desig"]);
    $metier->setSubLibelle($_GET["sub_desig"]);
    $metier->setActive(1);
    $re = $metier->save();
    print $re;
    $metier = null;
    $re = null;
    return;
} else if ($mode == 2) {
    $metier = new modelmetier();
    $metier = $metier->rechercher();
    print json_encode($metier);
    $metier = null;
    return;
} else if ($mode == 3) {
    $cata = new cata();
    $cata = $cata->findAllByMetier($_GET["metier"]);
    $row = [];
    foreach ($cata as $ligcata) {
        $cata_ligne = new cata_ligne();

        $cata_ligne = $cata_ligne->findByPrimaryKey($ligcata["id_front"]);
        $cata_ligne_params = new cata_ligne_params();
        $cata_ligne_params = $cata_ligne_params->findByIdCata($ligcata["id_front"]);

        $arrFront = ["src" => $cata_ligne->getSrc(), "title" => $cata_ligne->getTitle(), "elements" => $cata_ligne_params];
        $ligcata["front"] = $arrFront;


        $cata_ligne = $cata_ligne->findByPrimaryKey($ligcata["id_back"]);
        $cata_ligne_params = new cata_ligne_params();
        $cata_ligne_params = $cata_ligne_params->findByIdCata($ligcata["id_front"]);
        $arrBack = ["src" => $cata_ligne->getSrc(), "title" => $cata_ligne->getTitle(), "elements" => $cata_ligne_params];
        $ligcata["back"] = $arrBack;

        $row[] = $ligcata;
    }
    print json_encode($row);
    $cata = null;
    $row = null;
    return;
} else if ($mode == 4) {
    $listmetier = new listmetier();
    $listmetier->setLibelle(trim($_GET["libelle"]));
    $listmetier->setSubLibelle(trim($_GET["sub_libelle"]));
    $listmetier->setActive($_GET["actif"]);
    $listmetier->setPays($_GET["pays"]);
    $listmetier->setKeyLibelle($_GET["key_libelle"]);
    $listmetier->setKeySubLibelle($_GET["key_sub_libelle"]);
    $listmetier->save();
    $listmetier = null;
} else if ($mode == 5) {
    $listmetier = new listmetier();
    $listmetier = $listmetier->findByPrimaryKey(trim($_GET["id"]));

    $listmetier->setId($listmetier->getId());
    $listmetier->setLibelle(trim($_GET["libelle"]));
    $listmetier->setSubLibelle(trim($_GET["sub_libelle"]));
    $listmetier->setActive($_GET["actif"]);
    $listmetier->setPays($_GET[pays]);
    $listmetier->setKeyLibelle($_GET["key_libelle"]);
    $listmetier->setKeySubLibelle($_GET["key_sub_libelle"]);
    $listmetier->save();
    $listmetier = null;
} else if ($mode == 6) {
    $model = new modelmetier();
    $model = $model->findByPrimaryKey(trim($_GET["id"]));
    $model->setDescription(trim($_GET["name"]));
    $model->setKeyLibelle(trim($_GET["key"]));
    $model->setQte($_GET["qte"]);
    $model->setActive($_GET["active"]);

    $model->save();
    print "done";
    $model = null;
} else if ($mode == 7) {
    $model = new modelmetier_category();
    $model = $model->findByModel($_GET['id']);
    print json_encode($model);
    $model = null;
} else if ($mode == 8) {
    $model = new modelmetier_category();
    $model->setDescription($_GET["description"]);
    $model->setKeyDescription($_GET["key_description"]);
    $model->setIdModelMetier($_GET["id_modelmetier"]);
    $model->setSrc($_GET["src"]);
    $model->setQte($_GET["qte"]);
    $model->setActive($_GET["active"]);
    $model->save();

    $model = new modelmetier_category();
    $model = $model->findByModel($_GET['id_modelmetier']);
    print json_encode($model);
    $model = null;
} else if ($mode == 9) {
    $metier = new modelmetier();
    $metier = $metier->rechModelCategory();
    print json_encode($metier);
    $metier = null;
    return;
} else if ($mode == 10) {
    $instruction = new instructions();
    $instruction->setInstruction($_GET["text"]);
    $instruction->save();
    $instruction = null;
} else if ($mode == 11) {
    $pays = $_GET["param"];
    if (!isset($pays)) {
        $pays = 'FR';
    }
    if ($pays == "FR") {
        $instruction = new instructions();
        $instruction = $instruction->rechercher();
        print json_encode($instruction);
    } else if ($pays == "EN") {
        $instruction = new instructions_en();
        $instruction = $instruction->rechercher();
        print json_encode($instruction);
    } else if ($pays == "AL") {
        $instruction = new instructions_al();
        $instruction = $instruction->rechercher();
        print json_encode($instruction);
    } else if ($pays == "IT") {
        $instruction = new instructions_it();
        $instruction = $instruction->rechercher();
        print json_encode($instruction);
    } else if ($pays == "ES") {
        $instruction = new instructions_es();
        $instruction = $instruction->rechercher();
        print json_encode($instruction);
    }
    $instruction = null;
} else if ($mode == 12) {
    $pays = $_GET["param"];
    if (!isset($pays)) {
        $pays = 'FR';
    }
    if ($pays == "FR") {
        $instruction = new instructions();
    } else if ($pays == "EN") {
        $instruction = new instructions_en();
    } else if ($pays == "AL") {
        $instruction = new instructions_al();

    } else if ($pays == "IT") {
        $instruction = new instructions_it();

    } else if ($pays == "ES") {
        $instruction = new instructions_es();

    }
    $instruction = $instruction->findByPrimaryKey($_GET["id"]);
    $instruction->setInstruction($_GET["instruction"]);
    $instruction->save();
    $instruction = null;
} else if ($mode == 13) {
    $id_metier = $_GET["id"];
    $arrInfo = array();
    $modelmetier = new modelmetier();
    $modelmetier = $modelmetier->findByPrimaryKey($id_metier);
    $cataDimension = new cata();
    $cataDimension = $cataDimension->findDimsByModelMetier($id_metier);

    $arrInfo = array("qte" => $modelmetier->getQte());
    print json_encode($arrInfo);
    $arrInfo = null;
    $modelmetier = null;
    $cataDimension = null;
} else if ($mode == 14) {
    $cataPapier = new cata_papier();
    $cataPapier->setDescription($_GET["description"]);
    $cataPapier->setDescriptionEN($_GET["description_en"]);
    $cataPapier->setDescriptionES($_GET["description_es"]);
    $cataPapier->setDescriptionAL($_GET["description_al"]);
    $cataPapier->setDescriptionIT($_GET["description_it"]);
    $cataPapier->save();

    $cataPapier1 = new cata_papier();
    $cataPapier1 = $cataPapier1->rechercher();

    print json_encode($cataPapier1);
    $cataPapier = null;
    $cataPapier1 = null;
} else if ($mode == 15) {
    //recup tous les type de support
    $cataPapier = new cata_papier();
    $cataPapier = $cataPapier->rechercher();
    print json_encode($cataPapier);
    $cataPapier = null;
} else if ($mode == 16) {
    $cataPapier = new cata_papier();
    $cataPapier = $cataPapier->findByPrimaryKey($_GET["id"]);
    $cataPapier->setDescription($_GET["description"]);
    $cataPapier->setDescriptionEN($_GET["description_en"]);
    $cataPapier->setDescriptionES($_GET["description_es"]);
    $cataPapier->setDescriptionAL($_GET["description_al"]);
    $cataPapier->setDescriptionIT($_GET["description_it"]);
    $cataPapier->save();

    $cataPapier1 = new cata_papier();
    $cataPapier1 = $cataPapier1->rechercher();

    print json_encode($cataPapier1);
    $cataPapier1 = null;
    $cataPapier = null;
} else if ($mode == 17) {
    $cataPapier = new cata_papier();
    $cataPapier->delete($_GET["id"]);

    $cataPapier1 = new cata_papier();
    $cataPapier1 = $cataPapier1->rechercher();

    print json_encode($cataPapier1);
    $cataPapier1 = null;
    $cataPapier = null;
} else if ($mode == 18) {
    $subCategory = new modelmetier_category();
    $subCategory = $subCategory->findByPrimaryKey($_GET["id"]);
    $subCategory->setActive($_GET["active"]);
    $subCategory->setDescription($_GET["description"]);
    $subCategory->setKeyDescription($_GET["key_description"]);
    $subCategory->setMessage($_GET["message"]);
    $subCategory->setKeyMessage($_GET["key_message"]);
    $subCategory->save();
    $subCategory = null;
    return 'done';
} else if ($mode == 19) {
    $modelmetier = new modelmetier();
    $modelmetier = $modelmetier->findByPrimaryKey($_GET["id"]);
    $arrQte = explode(",", $modelmetier->getQte());
    foreach ($arrQte as $ligne) {
        $frais_livr = new frais_livraison();
        $frais_livr = $frais_livr->findByIdParentModelMetierQte($_GET["id"], intval($ligne), 0);

        if (!$frais_livr) {
            $frais_livr = new frais_livraison();
            $frais_livr->setIdModelMetier($_GET["id"]);
            $frais_livr->setWeight(0);
            $frais_livr->setPrice(0);
            $frais_livr->setQte(intval($ligne));
            $frais_livr->setIdProduit(0);
            $frais_livr->setManuel(0);
            $frais_livr->save();
        }
        $frais_livr = null;
        $frais_livr1 = new frais_livraison();
        $frais_livr1 = $frais_livr1->findByIdParentModelMetierQte($_GET["id"], intval($ligne), 0);
        $arrListProds = new cata_metier();
        $arrListProds = $arrListProds->findByMetier($_GET["id"]);
        foreach ($arrListProds as $ligne1) {
            $frais_livr3 = new frais_livraison();
            $frais_livr3 = $frais_livr3->findByIdParentModelMetierQte($_GET["id"], intval($ligne), $ligne1["id_cata"]);
            if (!$frais_livr3) {
                $frais_livr3 = new frais_livraison();
                $frais_livr3->setIdModelMetier($_GET["id"]);
                $frais_livr3->setWeight($frais_livr1->getWeight());
                $frais_livr3->setPrice($frais_livr1->getPrice());
                $frais_livr3->setQte($frais_livr1->getQte());
                $frais_livr3->setIdProduit($ligne1["id_cata"]);
                $frais_livr3->setManuel(0);
                $frais_livr3->save();
            }
            $frais_livr3 = null;
        }
    }

    //recup de toutes les lignes pour cette modelmetier
    $frais_livraison = new frais_livraison();
    $frais_livraison = $frais_livraison->findByIdModelMetier($_GET["id"], 0);
    echo json_encode(array("livraison" => $frais_livraison, "libelle" => $modelmetier->getDescription(), "id" => $_GET["id"]));
    $modelmetier = null;
} else if ($mode == 20) {
    $arrLivr = json_decode($_GET["data"]);
    foreach ($arrLivr as $ligne) {
        $livraison = new frais_livraison();
        $livraison->updateByBulk($_GET["id"], $ligne->qte, $ligne->weight, $ligne->price);
        $livraison = null;
    }
    echo "success";
    $arrLivr = null;
} else if ($mode == 21) {
    $id_modelmetier = $_GET["id_modelmetier"];
    $id_produit = $_GET["id_produit"];
    $modelmetier = new modelmetier();
    $modelmetier = $modelmetier->findByPrimaryKey($_GET["id_modelmetier"]);

    $livraison = new frais_livraison();
    $livraison = $livraison->findByIdModelMetier($id_modelmetier, $id_produit);

    $livraison1 = new frais_livraison();
    $livraison1 = $livraison1->findByIdModelMetier($id_modelmetier, 0);

    $isManuel = 0;
    foreach ($livraison as $item) {
        $isManuel = intval($item["manuel"]);
    }
    echo json_encode(array("parentLivraison" => $livraison1, "livraison" => $livraison, "isManuel" => $isManuel, "libelle" => $modelmetier->getDescription(), "id" => $_GET["id_modelmetier"]));
    $modelmetier = null;
    $livraison = null;
    $livraison1 = null;
} else if ($mode == 22) {
    $arrLivr = json_decode($_GET["data"]);

    foreach ($arrLivr as $item) {
        foreach ($item as $ligne) {
        }
    }
    echo "success";
    $arrLivr = null;
} else if ($mode == 23) {
    $frais_livr = new frais_livraison();
    $frais_livr = $frais_livr->deleleDuplicates();
    $frais_livr = null;
}
