<?php
/**
 * Created by PhpStorm.
 * User: Arvind
 * Date: 11/20/2016
 * Time: 4:19 PM
 */

include_once 'include_all.php';

$mode = intval($_GET['mode']);

if ($mode == 0) {
    $arrData = array();

    $cata = new cata();
    $cata = $cata->findDimsByModel($_GET["id"]);
    $cata = trim($cata, ',');
    $arrDims = explode(",", $cata);

    foreach ($arrDims as $dim) {
        if ($dim == '') {
            continue;
        }
        $cata_dimension = new cata_dimension();
        $cata_dimension = $cata_dimension->findBySubCatDim($_GET["id"], $dim, intval($_GET["tarifid"]));
        if ($cata_dimension == 0) {
            $dimension = new cata_dimension();
            $dimension->setIdSubCategory($_GET["id"]);
            $dimension->setDimension(($dim));
            $dimension->setCoeff(0);
            $dimension->setIdSousCategoryCoeffPrix(intval($_GET["tarifid"]));
            $dimension->save();
        }
    }

    //recup de tous les ligne de dimension par sous category
    $dimensionAll = new cata_dimension();
    $dimensionAll = $dimensionAll->findByIDSCategory($_GET["id"], intval($_GET["tarifid"]));
    $arrData["dimension"] = $dimensionAll;

    $cata_metier = new modelmetier();
    $cata_metier = $cata_metier->findByPrimaryKey($_GET["id_metier"]);

    $arrQte = explode(',', trim($cata_metier->getQte(), ','));
    $arrData["qte"] = $arrQte;
    $test = array();
    foreach ($arrQte as $qte) {
        $test[$qte] = array('qte' => 0, 'prix' => 0);
    }
    //type de support
    $cata_papier = new cata_papier();
    $cata_papier = $cata_papier->rechercher();
    $arrData["papier"] = $cata_papier;

    foreach ($arrData["papier"] as $key => $ligne) {
        $arrData["papier"][$key]["qte"] = $test;
    }


    //tarif actuels
    $cata_support = new cata_support();
    $cata_support = $cata_support->findBySousCategory($_GET["id"]);
    $arrData["tarif"] = $cata_support;

    //prix sauvegarder
    $cprix = new coeff_prix();
    $cprix = $cprix->findBySousCategory(intval($_GET["id"]), intval($_GET["tarifid"]));
    $arrData["tarifactuel"] = $cprix;

    $cprix = new coeff_prix();
    $cprix = $cprix->getListIdPapierSupport(intval($_GET["id"]), intval($_GET["tarifid"]));
    $arrData["selsupport"] = $cprix["ligne"];

    print json_encode($arrData);
    $cprix = null;
    $arrData = null;
    $cata_support = null;
    $cata_papier = null;
    $test = null;
    $arrQte = null;
    $cata_metier = null;
    $dimensionAll = null;
    $arrDims = null;
    $cata = null;

} else if ($mode == 1) {
    $souscategory_coeffprix = new souscategory_coeffprix();
    $souscategory_coeffprix = $souscategory_coeffprix->findBySousCategory(intval($_GET["id"]));
    print json_encode($souscategory_coeffprix);
    $souscategory_coeffprix = null;
} else if ($mode == 2) {
    //new tarif
    $souscategory_coeffprix = new souscategory_coeffprix();
    if (intval($_GET["id"]) > 0) {
        $souscategory_coeffprix = $souscategory_coeffprix->findByPrimaryKey(intval($_GET["id"]));
    }
    $souscategory_coeffprix->setNom($_GET["nom"]);
    $souscategory_coeffprix->setSousCategory(intval($_GET["souscategory"]));
    $souscategory_coeffprix->save();
    $souscategory_coeffprix = null;
} else if ($mode == 3) {
    $coeff_prix = new coeff_prix();
    $coeff_prix->delByIdSousCategoryCoeffPrix(intval($_GET["id"]));
    $souscategory_coeffprix = new souscategory_coeffprix();
    $souscategory_coeffprix->delete(intval($_GET["id"]));
    print 'done';
    $souscategory_coeffprix = null;
} else if ($mode == 4) {
    $id_souscategory = intval($_GET["souscategory"]);
    $souscategory_coeffprix = new souscategory_coeffprix();
    $souscategory_coeffprix = $souscategory_coeffprix->rechBySousCate1($id_souscategory);

    print json_encode($souscategory_coeffprix);
    $souscategory_coeffprix = null;
} else if ($mode == 5) {
    $cata = new cata();
    $cata = $cata->findByPrimaryKey(intval($_GET["id_cata"]));
    $cata->setIdSousCategoryCoeffPRix(intval($_GET["id_tarif"]));
    $cata->save();
    print 'done';
    $cata = null;
} else if ($mode == 6) {
    $cata = new cata();
    $cata = $cata->findByPrimaryKey(intval($_GET["id_cata"]));
    $arrDimensions = explode(',', $cata->getDimensions());

    $arrDims = array();
    $cata_dimension = new cata_dimension();
    if (intval($_GET["id_tarif"]) == -1) {
        $tarif_man = new tarif_manuel();
        $tarif_man = $tarif_man->getDimsByCata(intval($_GET["id_cata"]));
        foreach ($tarif_man as $item) {
            $dim = new cata_dimension();
            $dim = $dim->findByPrimaryKey($item['id_dim']);

            $arrDims[] = array('id' => $dim->getId(), 'dimension' => $dim->getDimension(), 'coeff' => $dim->getCoeff());
        }
    } else {
        foreach ($arrDimensions as $ligne) {
            $cata_dimension = $cata_dimension->findByDimension(intval($_GET["id_tarif"]), $ligne);
            $arrDims[] = array('id' => $cata_dimension->getId(), 'dimension' => $cata_dimension->getDimension(), 'coeff' => $cata_dimension->getCoeff());
        }
    }


    $metier = new modelmetier();
    $metier = $metier->findByPrimaryKey(intval($_GET["id_metier"]));
    $arrQtes = explode(',', $metier->getQte());

    if (intval($_GET["id_tarif"]) == -1) {
        $tarifmanuel = new tarif_manuel();
        $tarifmanuel = $tarifmanuel->findByIDCata(intval($_GET["id_cata"]));

        $tarifmanuel1 = new tarif_manuel();
        $tarifmanuel1 = $tarifmanuel1->getListIdPapierSupport(intval($_GET["id_cata"]));

        $cata_papier = new cata_papier();
        $cata_papier = $cata_papier->findByList($tarifmanuel1["ligne"]);

        $arrData = array('dimensions' => $arrDimensions, 'qte' => $arrQtes, 'coeff' => $tarifmanuel, 'dimensions_coeff' => $arrDims, 'papier' => $cata_papier);
    } else {
        $coeff_prix = new coeff_prix();
        $coeff_prix = $coeff_prix->findBySousCategory(intval($_GET["id_souscategory"]), intval($_GET["id_tarif"]));


        $coeff_prix1 = new coeff_prix();
        $coeff_prix1 = $coeff_prix1->getListIdPapierSupport(intval($_GET["id_souscategory"]), intval($_GET["id_tarif"]));
        $cata_papier = new cata_papier();
        $cata_papier = $cata_papier->findByList($coeff_prix1["ligne"]);

        $arrData = array('dimensions' => $arrDimensions, 'qte' => $arrQtes, 'coeff' => $coeff_prix, 'dimensions_coeff' => $arrDims, 'papier' => $cata_papier);
    }
    print json_encode($arrData);
    $cata = null;
    $arrDimensions = null;
    $arrDims = null;
    $cata_dimension = null;
    $metier = null;
    $arrQtes = null;
    $arrData = null;
}