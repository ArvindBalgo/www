<?php
session_start();
include_once 'include_all.php';
require('../fpdf.php');
require '../PHPMailerAutoload.php';
include_once "../chromePHP.php";

$mode = $_GET['mode'];

if ($mode == 0) {
    $id = $_GET["id"];
    $cata = new cata();
    $results = $cata->findAllByMetier($id);
    /*$sample = new gabarits();
    $sample = $sample->findByIdModel($id);*/
    print json_encode($results);
    return;
} else if ($mode == 1) {
    $type = $_GET["type"];
    $sample = new gabarits();
    $sample = $sample->findByType($type);
    $cata = new cata();
    $cata = $cata->rechercher();
    if (count($cata) == 0) {
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
    foreach ($cata as $ligne) {
        $img_src = [];
        $arrFront = [];
        $arrBack = [];
        $arrElem = [];

        $cata_ligne = new cata_ligne();
        $cata_ligne = $cata_ligne->findByPrimaryKey($ligne["id_front"]);
        $cata_ligne_params = new cata_ligne_params();
        $cata_ligne_params = $cata_ligne_params->findByIdCata($cata_ligne->getId());
        $arrFront = array('id' => $cata_ligne->getId(), 'src' => $cata_ligne->getSrc(), 'title' => $cata_ligne->getTitle(), 'params' => $cata_ligne_params);

        $cata_back = $cata_ligne->findByPrimaryKey($ligne["id_back"]);
        $cata_ligne_params1 = new cata_ligne_params();
        $cata_ligne_params1 = $cata_ligne_params1->findByIdCata($cata_back->getId());

        $arrBack = array('id' => $cata_back->getId(), 'src' => $cata_back->getSrc(), 'title' => $cata_back->getTitle(), 'params' => $cata_ligne_params1);

        //$img_src[] =array('id'=>$cata_ligne->getId(), "src"=>$cata_ligne->getSrc());
        //$arrData[] = array('id'=>$ligne["id"], 'title'=>$ligne["libelle"], 'thumbnail_src'=>$ligne["src"], 'img_src'=>$img_src);
        $arrData[] = array('id' => $ligne["id"], 'title' => $ligne["libelle"], 'thumbnail_src' => $ligne["src"], 'elemfront' => $arrFront, 'elemback' => $arrBack);
    }
    print json_encode($arrData);
    //print json_encode($sample);
    return;
} else if ($mode == 2) {
    $data = json_encode($_GET["data"]);
    $sample = new sample();
    $sample->setIdModelMetier(2);
    $sample->setDescription("1324568");
    $sample->setContent(($data));
    $sample->save();
    print json_decode($data);
} else if ($mode == 3) {
    $cata_metier = new cata_metier();
    $cata_metier = $cata_metier->findByMetier($_GET["metier"]);
    $arrIdCata = [];
    foreach ($cata_metier as $ligne) {
        $arrIdCata[] = $ligne["id_cata"];
    }
    $strCata = implode(",", $arrIdCata);
    $cata = new cata();
    $cata = $cata->findAllByIdCataRange($strCata);

    $arrData = [];
    foreach ($cata as $ligne) {
        $img_src = [];
        $arrFront = [];
        $arrBack = [];
        $arrElem = [];

        $cata_ligne = new cata_ligne();
        if ($ligne["id_front"] > 0) {
            $cata_ligne = $cata_ligne->findByPrimaryKey($ligne["id_front"]);
            $cata_ligne_params = new cata_ligne_params();
            $cata_ligne_params = $cata_ligne_params->findByIdCata($cata_ligne->getId());
            $arrFront = array('id' => $cata_ligne->getId(), 'src' => $cata_ligne->getSrc(), 'title' => $cata_ligne->getTitle(), 'params' => $cata_ligne_params);
        }
        if ($ligne["id_back"] > 0) {
            $cata_back = $cata_ligne->findByPrimaryKey($ligne["id_back"]);
            $cata_ligne_params1 = new cata_ligne_params();
            $cata_ligne_params1 = $cata_ligne_params1->findByIdCata($cata_back->getId());

            $arrBack = array('id' => $cata_back->getId(), 'src' => $cata_back->getSrc(), 'title' => $cata_back->getTitle(), 'params' => $cata_ligne_params1);

        }
        $arrData[] = array('id' => $ligne["id"], 'title' => $ligne["libelle"], 'thumbnail_src' => $ligne["src"], 'elemfront' => $arrFront, 'elemback' => $arrBack);

    }
    print json_encode($arrData);
    return;
} else if ($mode == 4) {
    $cata = new cata();
    $results = $cata->findAllBySousCategory($_GET["id"]);
    print json_encode($results);
    return;
} else if ($mode == 5) {
    $cata = new cata();
    $cata = $cata->findByPrimaryKey($_GET["id"]);
    if (count($cata) == 0) {
        print "null";
        return;
    }

    $cataMetier = new cata_metier();
    $cataMetier = $cataMetier->findByIdCata($_GET["id"]);
    $modelMetier = new modelmetier();
    $modelMetier = $modelMetier->findByPrimaryKey($cataMetier->getIdMetier());
    $fraisLivr = new frais_livraison();
    $fraisLivr = $fraisLivr->findByIdModelMetier($modelMetier->getId(), $_GET["id"]);
    $arrData = [];

    //foreach($cata as $ligne) {
    $ligne = $cata;
    $img_src = [];
    $arrFront = [];
    $arrBack = [];
    $arrElem = [];

    $cata_ligne = new cata_ligne();
    $cata_ligne = $cata_ligne->findByPrimaryKey($cata->getIdFront());
    if ($cata_ligne != null) {
        $cata_ligne_params = new cata_ligne_params();
        $cata_ligne_params = $cata_ligne_params->findByIdCata($cata_ligne->getId());
        $arrFront = array('id' => $cata_ligne->getId(), 'src' => $cata_ligne->getSrc(), 'title' => $cata_ligne->getTitle(), 'params' => $cata_ligne_params);
    } else {
        $arrFront = array();
    }

    $cata_ligne = new cata_ligne();
    $cata_back = $cata_ligne->findByPrimaryKey($cata->getIdBack());
    if ($cata_back != null) {
        $cata_ligne_params1 = new cata_ligne_params();
        $cata_ligne_params1 = $cata_ligne_params1->findByIdCata($cata_back->getId());

        $arrBack = array('id' => $cata_back->getId(), 'src' => $cata_back->getSrc(), 'title' => $cata_back->getTitle(), 'params' => $cata_ligne_params1);

    } else {
        $arrBack = array();
    }

    //$img_src[] =array('id'=>$cata_ligne->getId(), "src"=>$cata_ligne->getSrc());
    //$arrData[] = array('id'=>$ligne["id"], 'title'=>$ligne["libelle"], 'thumbnail_src'=>$ligne["src"], 'img_src'=>$img_src);
    $arrData[] = array('id' => $cata->getId_Cata(),
        'title' => $cata->getLibelle(),
        'thumbnail_src' => $cata->getSrc(),
        'escargot' => $cata->getEscargot(),
        'contours' => $cata->getContours(),
        'liserai' => $cata->getLiserai(),
        'coucher' => $cata->getCoucher(),
        'dimensions' => $cata->getDimensions(),
        'qte' => $modelMetier->getQte(),
        'frais_livraison' => $fraisLivr,
        'elemfront' => $arrFront,
        'elemback' => $arrBack);
    //}
    print json_encode($arrData);
    //print json_encode($sample);
    return;
} else if ($mode == 6) {
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
} else if ($mode == 7) {
    $id = $_GET["id"];
    $cata = new cata();
    $cata = $cata->findByPrimaryKey($id);

    $cataMetier = new cata_metier();
    $cataMetier = $cataMetier->findByIdCata($_GET["id"]);

    $modelMetier = new modelmetier();
    $modelMetier = $modelMetier->findByPrimaryKey($cataMetier->getIdMetier());

    $arrCata = array('id' => $cata->getId_Cata(),
        'libelle' => $cata->getLibelle(),
        'reference' => $cata->getReference(),
        'description' => $cata->getDescription(),
        'dimensions' => $cata->getDimensions(),
        'escargot' => $cata->getEscargot(),
        'contours' => $cata->getContours(),
        'liserai' => $cata->getLiserai(),
        'coucher' => $cata->getCoucher(),
        'gabarit' => $cata->getGabarit(),
        'qte' => $modelMetier->getQte()
    );
    print json_encode($arrCata);
} else if ($mode == 8) {
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
} else if ($mode == 9) {
    $cata = new cata();
    $cata = $cata->findByPrimaryKey($_GET["id_model"]);
    if (count($cata) == 0) {
        print "null";
        return;
    }
    $id_souscategory_coeffprix = $cata->getIdSousCategoryCoeffPrix();
    $tarif_man = new tarif_manuel();
    $tarif_man = $tarif_man->findByIDCata($cata->getId_Cata());

    $coeffprix = new coeff_prix();
    $coeffprix = $coeffprix->findByProduit($id_souscategory_coeffprix);

    $cata_metier = new cata_metier();
    $cata_metier = $cata_metier->findByIdCata($_GET["id_model"]);

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
    $cata_ligne = $cata_ligne->findByPrimaryKey($cata->getIdFront());
    if ($cata_ligne != null) {
        $cata_ligne_params = new cata_ligne_params();
        $cata_ligne_params = $cata_ligne_params->findByIdCata($cata_ligne->getId());
        $arrFront = array('id' => $cata_ligne->getId(), 'src' => $cata_ligne->getSrc(), 'title' => $cata_ligne->getTitle(), 'params' => $cata_ligne_params);
    } else {
        $arrFront = array();
    }

    $cata_ligne = new cata_ligne();
    $cata_back = $cata_ligne->findByPrimaryKey($cata->getIdBack());
    if ($cata_back != null) {
        $cata_ligne_params1 = new cata_ligne_params();
        $cata_ligne_params1 = $cata_ligne_params1->findByIdCata($cata_back->getId());

        $arrBack = array('id' => $cata_back->getId(), 'src' => $cata_back->getSrc(), 'title' => $cata_back->getTitle(), 'params' => $cata_ligne_params1);

    } else {
        $arrBack = array();
    }

    //$img_src[] =array('id'=>$cata_ligne->getId(), "src"=>$cata_ligne->getSrc());
    //$arrData[] = array('id'=>$ligne["id"], 'title'=>$ligne["libelle"], 'thumbnail_src'=>$ligne["src"], 'img_src'=>$img_src);
    $arrData[] = array('id' => $cata->getId_Cata(),
        'title' => $cata->getLibelle(),
        'thumbnail_src' => $cata->getSrc(),
        'escargot' => $cata->getEscargot(),
        'contours' => $cata->getContours(),
        'liserai' => $cata->getLiserai(),
        'coucher' => $cata->getCoucher(),
        'dimensions' => $cata->getDimensions(),
        'qte' => $modelMetier->getQte(),
        'idmodelmetier' => $modelMetier->getId(),
        'elemfront' => $arrFront,
        'elemback' => $arrBack,
        'type_support' => $cata_papier,
        'info_prix' => $coeffprix,
        'coeff_dims' => $cata_dim,
        'type_tarif' => $id_souscategory_coeffprix,
        'tarifManuel' => $tarif_man);
    //}

    print json_encode($arrData);
    //print json_encode($sample);
    return;
} else if ($mode == 10) {
    $modelMetier = new modelmetier();

    $modelMetier = $modelMetier->rechTous();
    print json_encode($modelMetier);

} else if ($mode == 11) {
    $id = $_GET["id"];
    $cata = new cata();
    $results = $cata->fnFindAllModelCategory($id);
    /*$sample = new gabarits();
    $sample = $sample->findByIdModel($id);*/
    print json_encode($results);
    return;
} else if ($mode == 12) {
    $id = $_GET["id"];
    $cata = new cata();
    $results = $cata->findAllBySousCategory($id);
    print json_encode($results);
    return;
} else if ($mode == 13) {
    $id_produit = $_GET["id_produit"];
    $id_subcategory = $_GET["id_category"];

    $cataMetier = new cata_metier();
    $cataMetier = $cataMetier->fnUpdateSubCat($id_produit, $id_subcategory);
    print json_encode($cataMetier);
} else if ($mode == 14) {
    $id = $_GET["id"];
    $cata = new cata();
    $results = $cata->findAllByModelMetier($id);
    /*$sample = new gabarits();
    $sample = $sample->findByIdModel($id);*/
    print json_encode($results);
    return;
} else if ($mode == 15) {
    $pays = new pays();
    $pays = $pays->rechercher();
    print json_encode($pays);
} else if ($mode == 16) {
    //fill all delivery charges
    $id_produit = $_GET["id"];
    $cata = new cata();
    $cata = $cata->findDimsQte($id_produit);
    $arrDims = explode(",", $cata["str_dimensions"]);
    $arrQte = explode(",", $cata["str_qte"]);
    $arrPays = array("FR", "ES", "AL", "EN", "IT");
    foreach ($arrPays as $pays) {
        foreach ($arrDims as $dimension) {
            foreach ($arrQte as $qte) {
                $fraisLivr = new frais_livraison();
                //findByDimensionQteProduit
                $fraisLivr = $fraisLivr->findByIdDimQte($id_produit, $dimension, intval(trim($qte)), $pays);
                if (!$fraisLivr) {
                    $fraisLivr = new frais_livraison();
                    $fraisLivr->setIdProduit($id_produit);
                    $fraisLivr->setIdModelMetier($cata["id_modelmetier"]);
                    $fraisLivr->setDimension($dimension);
                    $fraisLivr->setQte(intval(trim($qte)));
                    $fraisLivr->setWeight(0);
                    $fraisLivr->setPrice(0);
                    $fraisLivr->setPays($pays);
                    $fraisLivr->save();
                }
            }
        }
    }
    $arrResponse = array();
    //pays == FR
    $fraisLivraison = new frais_livraison();
    $fraisLivraison = $fraisLivraison->findByIdProd($id_produit, "FR");
    $arrResponse["FR"] = $fraisLivraison;

    //pays == EN
    $fraisLivraison = new frais_livraison();
    $fraisLivraison = $fraisLivraison->findByIdProd($id_produit, "EN");
    $arrResponse["EN"] = $fraisLivraison;

    //pays == ES
    $fraisLivraison = new frais_livraison();
    $fraisLivraison = $fraisLivraison->findByIdProd($id_produit, "ES");
    $arrResponse["ES"] = $fraisLivraison;

    //pays == AL
    $fraisLivraison = new frais_livraison();
    $fraisLivraison = $fraisLivraison->findByIdProd($id_produit, "AL");
    $arrResponse["AL"] = $fraisLivraison;

    //pays == AL
    $fraisLivraison = new frais_livraison();
    $fraisLivraison = $fraisLivraison->findByIdProd($id_produit, "IT");
    $arrResponse["IT"] = $fraisLivraison;

    print json_encode($arrResponse);
} else if ($mode == 17) {
    $arrData = json_decode($_GET["data"]);
    foreach ($arrData as $item) {
        $livr = new frais_livraison();
        $livr = $livr->findByPrimaryKey($item->id);
        $livr->setPrice($item->price);
        $livr->setWeight($item->weight);
        $livr->save();
    }
    return "done";
} else if ($mode == 18) {
    $item = json_decode($_GET["data"]);
    $livr = new frais_livraison();
    $livr = $livr->findByPrimaryKey($item->id);
    $livr->setPrice($item->price);
    $livr->setWeight($item->weight);
    $livr->save();
    return "done";
} else if ($mode == 19) {
    $tva = new tva();
    $tva = $tva->findByPays($_SESSION['pays']);

    $arrData = json_decode($_GET["data"]);
    $arrFrais = array();
    foreach ($arrData as $ligne) {
        $fraisLivraison = new frais_livraison();
        $fraisLivraison = $fraisLivraison->findByIdDimQte($ligne->idprod, $ligne->dimension, $ligne->qte, $_SESSION["pays"]);
        $arrFrais[$fraisLivraison["id"]] = array('id_modelmetier' => $fraisLivraison["id_modelmetier"],
            'id_produit' => $fraisLivraison["id_produit"],
            'dimension' => $fraisLivraison["dimension"],
            'qte' => $fraisLivraison["qte"],
            'weight' => $fraisLivraison["weight"],
            'price' => $fraisLivraison["price"],
            'pays' => $fraisLivraison["pays"]);
    }
    print json_encode(array('frais_livraison' => $arrFrais, 'tax' => $tva->getValue(), 'pays' => $tva->getPays()));
} else if ($mode == 20) {
    $arrListKeys = json_decode($_GET["list"]);
    $id_user = $_SESSION['uid'];
    $tva = new tva();
    $tva = $tva->findByPays($_SESSION['pays']);
    $frais_livraison = 0;
    $totalPrixHT = 0;
    foreach ($arrListKeys as $val) {
        foreach ($val as $key => $item) {
            $tempProd = new temp_prod();
            $tempProd = $tempProd->findByComboKeyRandom($key, $item);
            if ($tempProd) {
                $fraisLivraison = new frais_livraison();
                $fraisLivraison = $fraisLivraison->findByIdDimQte($tempProd->getIdProduit(), $tempProd->getDimension(), $tempProd->getQte(), $_SESSION["pays"]);
                $frais_livraison = $frais_livraison + floatval($fraisLivraison["price"]);

                $totalPrixHT = $totalPrixHT + ($tempProd->getUnitPrix() * $tempProd->getQte());
            }
        }
    }
    $orders = new orders_main();
    $orders->setIdUser($id_user);
    $orders->setTotalLivraisonHT($frais_livraison);
    $orders->setTotalLivraisonTTC(number_format(($frais_livraison * $tva->getValue()) / 100 + $frais_livraison, 2, '.', ''));
    $orders->setTotalPrixHT(number_format($totalPrixHT, 2, '.', ''));
    $orders->setTotalPrixTTC(number_format((($totalPrixHT * $tva->getValue()) / 100) + $totalPrixHT, 2, '.', ''));
    $orders->setTax(number_format((($totalPrixHT * $tva->getValue()) / 100), 2, '.', ''));
    $orders->setTotalPrixNet(number_format((($totalPrixHT * $tva->getValue()) / 100) + $totalPrixHT, 2, '.', ''));
    $orders->setTax(number_format((($totalPrixHT * $tva->getValue()) / 100), 2, '.', ''));
    $orders->setStatus("NEW");
    $orders->setCreatedBy($id_user);
    $orders->setModifiedBy($id_user);
    $orders->setDateCreated(date("Y-m-d H:i:s"));
    $orders->setDateModified(date("Y-m-d H:i:s"));
    $orders->save();
    $lastID = $orders->fnGetLastId();

    if($_GET["coupon"] != "") {
        $couponMain = new coupon_main();
        $couponMain = $couponMain->findByPrimaryKey($_GET["coupon"]);
        if($couponMain){
            $ordersMain = new orders_main();
            $ordersMain = $ordersMain->findByPrimaryKey($lastID["id"]);
            $discountVal = 1 - ($couponMain->getVal()/100);
            if($ordersMain){
                $ordersMain->setTotalPrixNet(number_format((($ordersMain->getTotalPrixTTC() + $ordersMain->getTotalLivraisonTTC()) * ($discountVal)), 2, '.', ''));
                $ordersMain->save();
            }
            $couponDetail = new coupon_details();
            $couponDetail = $couponDetail->findByCouponUser($_GET["coupon"], $_SESSION["uid"]);
            $couponDetail->setFlag("USED");
            $couponDetail->setDateUsed(date("Y-m-d"));
            $couponDetail->setIdOrder($lastID["id"]);
            $couponDetail->save();
        }
    }

    foreach ($arrListKeys as $val1) {
        foreach ($val1 as $key => $item) {
            $tempProd = new temp_prod();
            $tempProd = $tempProd->findByComboKeyRandom($key, $item);

            if ($tempProd) {
                $fraisLivraison = new frais_livraison();
                $fraisLivraison = $fraisLivraison->findByIdDimQte($tempProd->getIdProduit(), $tempProd->getDimension(), $tempProd->getQte(), $_SESSION["pays"]);
                $frais_livraison = $frais_livraison + floatval($fraisLivraison["price"]);

                $totalPrixHT = $totalPrixHT + ($tempProd->getUnitPrix() * $tempProd->getQte());
                $orders_details = new orders_details();
                $orders_details->setIdOrder($lastID["id"]);
                $orders_details->setBase64Image($tempProd->getbase64Image());
                $orders_details->setBonRepli($tempProd->getBonRepli());
                $orders_details->setCommentaire($tempProd->getCommentaire());
                $orders_details->setDimension($tempProd->getDimension());
                $orders_details->setIdDimension($tempProd->getIdDimension());
                $orders_details->setEscargot($tempProd->getEscargot());
                $orders_details->setEscargotVal($tempProd->getEscargotVal());
                $orders_details->setContours($tempProd->getContours());
                $orders_details->setLiserai($tempProd->getLiserai());
                $orders_details->setOpt($tempProd->getOpt());
                $orders_details->setPrixHT(number_format(($tempProd->getUnitPrix() * $tempProd->getQte()), 2, '.', ''));
                $orders_details->setPrixTTC(number_format(((($tempProd->getUnitPrix() * $tempProd->getQte()) * $tva->getValue()) / 100) + ($tempProd->getUnitPrix() * $tempProd->getQte()), 2, '.', ''));
                $orders_details->setUnitPrix($tempProd->getUnitPrix());
                $orders_details->setPrixLivraisonHT(number_format($fraisLivraison["price"], 2, '.', ''));
                $orders_details->setPrixLivraisonTTC(number_format(($fraisLivraison["price"] * $tva->getValue()) / 100 + $fraisLivraison["price"], 2, '.', ''));
                $orders_details->setIdSupport($tempProd->getIdSupport());
                $orders_details->setSupport($tempProd->getSupport());
                $orders_details->setQte($tempProd->getQte());
                $orders_details->setIdQte($tempProd->getIdQte());
                $orders_details->setTitle($tempProd->getTitle());
                $orders_details->setData(json_encode($tempProd->getData()));
                $orders_details->setFlag("NEW");
                $orders_details->setStatus("INCOMPLETE");
                $orders_details->setDateCreated(date("Y-m-d H:i:s"));
                $orders_details->setDateModified(date("Y-m-d H:i:s"));
                $orders_details->setCreatedBy($id_user);
                $orders_details->setModifiedBy($id_user);
                $orders_details->save();
                $orders_details = new orders_details();
                $orders_details = $orders_details->getMaxId();

                $TEMPIMGLOC = 'tempimg.png';

                $dataURI = $tempProd->getbase64Image();
            }
        }
    }

    /*
     * Appel à création pdf
     */
    /*$mode = 0;
    $post_id = $lastID['id'];

    include_once 'pdf_generation_order.php';*/

    $mail = new PHPMailer;
    $mailAdmin = new PHPMailer;

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

    $idUser = $_SESSION['uid'];
    $user = new users();
    $user = $user->findByPrimaryKey($idUser);
    $paysClient = $user->getPays();
    $pays = $paysClient;

    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = 'mail.exakom.fr';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Username = 'contact@exakom.fr';                 // SMTP username
    $mail->Password = '95961b98';                           // SMTP password
    $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 25;                                    // TCP port to connect to

    $mail->setFrom('contact@exakom.fr', 'Exakom');
    $mail->addAddress($user->getEmail(), strtoupper($user->getName()) . " " . strtoupper($user->getSurname()));     // Add a recipient
//$mail->addAddress('ellen@example.com');               // Name is optional
    $mail->addReplyTo('contact@exakom.fr', 'Information');
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');

//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
    $mail->isHTML(true);                                  // Set email format to HTML

    if ($pays == 'FR') {
        $mail->Subject = utf8_decode('Réception de commande Exakom');
        $mail->Body = utf8_decode('Bonjour ' . strtoupper($user->getName()) . " " . strtoupper($user->getSurname()) . ", <br> Votre commande N° " . $lastID["id"] . " a bien été enregistré, vous recevrez bientôt votre facture. <br> Cordialment <br> Exakom");

    } else if ($pays == "EN") {
        $mail->Subject = utf8_decode('Exakom order receipt');
        $mail->Body = utf8_decode('Hello ' . strtoupper($user->getName()) . " " . strtoupper($user->getSurname()) . ", <br> Your order N° " . $lastID["id"] . " has been registered, you will soon receive your invoice. <br> Regards <br> Exakom");
    } else if ($pays == "AL") {
        $mail->Subject = utf8_decode('Exakom bestellen quittung');
        $mail->Body = utf8_decode('Hallo ' . strtoupper($user->getName()) . " " . strtoupper($user->getSurname()) . ", <br> Ihre Bestellung Nr " . $lastID["id"] . " registriert worden ist, werden Sie bald Ihre Rechnung. <br> Grüße <br> Exakom");
    } else if ($pays == "ES") {
        $mail->Subject = utf8_decode('Recibo de pedido de Exakom');
        $mail->Body = utf8_decode('Holla ' . strtoupper($user->getName()) . " " . strtoupper($user->getSurname()) . ", <br> Su orden N ° " . $lastID["id"] . " haya sido registrada, pronto recibirá su factura. <br> Saludos <br> Exakom");
    } else if ($pays == "IT") {
        $mail->Subject = utf8_decode('Ricevuta di ordine Exakom');
        $mail->Body = utf8_decode('Ciao ' . strtoupper($user->getName()) . " " . strtoupper($user->getSurname()) . ", <br> Il tuo ordine N °  " . $lastID["id"]. " è stato registrato, riceverai presto la tua fattura.<br> Saluti <br> Exakom");
    }

    if (!$mail->send()) {
        //echo 'Message could not be sent.';
        // echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        // echo 'Message has been sent';
    }

    $mailAdmin->isSMTP();                                      // Set mailer to use SMTP
    $mailAdmin->Host = 'mail.exakom.fr';  // Specify main and backup SMTP servers
    $mailAdmin->SMTPAuth = true;                               // Enable SMTP authentication
    $mailAdmin->Username = 'contact@exakom.fr';                 // SMTP username
    $mailAdmin->Password = '95961b98';                           // SMTP password
    $mailAdmin->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    $mailAdmin->Port = 25;                                    // TCP port to connect to

    $mailAdmin->setFrom('contact@exakom.fr', 'Exakom');
    $mailAdmin->addAddress('contact@exakom.fr', "Admin");     // Add a recipient     // Name is optional
    $mailAdmin->addAddress('balgo_arvind@hotmail.com');               // Name is optional
    $mailAdmin->addReplyTo('contact@exakom.fr', 'Information');
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');

//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
    $mailAdmin->isHTML(true);                                  // Set email format to HTML

    $mailAdmin->Subject = utf8_decode('Réception de commande');
    $mailAdmin->Body = utf8_decode('Bonjour Exakom' . " <br> Une nouvelle commande a été fait par le client " . $user->getName() . " " . $user->getSurname() . " <br> No Commande: " . $orders_details['id'] . " <br> Bien à vous, <br> Exakom.");

    if (!$mailAdmin->send()) {
        //echo 'Message could not be sent.';
        // echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        // echo 'Message has been sent';
    }


    print_r(json_encode($lastID));
} else if ($mode == 21) {

    $langue  = new langue();
    $langue = $langue->rechMultiKeys($_GET['lang']);
    print json_encode($langue);
}