<?php
include_once 'include_all.php';

$mode = $_GET['mode'];
if($mode == 0) {
    $data  = json_decode($_GET["data"]) ;
    $arrSousCategory = json_decode($_GET["listsouscate"]);
    $dimensions = json_decode($_GET["dim"]);
    foreach ($data as $key=>$val){
        foreach ($val->qte  as $skey=>$sval) {
            $cprix = new coeff_prix();
            $cprix = $cprix->findByQteSupportSCategory($skey , $val->id , intval($_GET["id_souscategory"]),  intval($_GET["tarifid"]));
            if($cprix == 'false') {
                $cprix = new coeff_prix();
            }
            $cprix->setQte($skey);
            $cprix->setCoeffPrix($sval->prix);
            $cprix->setCoeffQte($sval->qte);
            $cprix->setIdSousCategory(intval($_GET["id_souscategory"]));
            $cprix->setIdSupport($val->id);
            $cprix->setIdSouscategoryPrix( intval($_GET["tarifid"]));
            $cprix->save();
        }
    }

    //suppression des lignes non existant
    $coeffprix = new coeff_prix();
    $coeffprix = $coeffprix->getListIdPapierSupport(intval($_GET["id_souscategory"]), intval($_GET["tarifid"]));
    $coeffprix = explode("," ,$coeffprix["ligne"]);
    foreach ($coeffprix as $ligneKey=>$ligneVal) {
        if(in_array($ligneVal, $arrSousCategory)){
        }
        else {
            $coeffprix = new coeff_prix();
            $coeffprix->delBySousCategoryPapier(intval($_GET["id_souscategory"]) , $ligneVal, intval($_GET["tarifid"]));
        }
    }


    //sauvegarde des dimensions
    foreach ($dimensions as $key=>$val) {
        $dim = new cata_dimension();
        $dim = $dim->findByPrimaryKey($val->id);
        $dim->setCoeff($val->coeff);
        $dim->save();
    }
    return "done";
}