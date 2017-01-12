<?php
include_once 'include_all.php';

$mode = $_POST['mode'];
if($mode == 0) {
    $data  = json_decode($_POST["data"]) ;
    $arrSousCategory = json_decode($_POST["listsouscate"]);
    $dimensions = json_decode($_POST["dim"]);
    foreach ($data as $key=>$val){
        foreach ($val->qte  as $skey=>$sval) {
            $cprix = new coeff_prix();
            $cprix = $cprix->findByQteSupportSCategory($skey , $val->id , intval($_POST["id_souscategory"]),  intval($_POST["tarifid"]));
            if($cprix == 'false') {
                $cprix = new coeff_prix();
            }
            $cprix->setQte($skey);
            $cprix->setCoeffPrix($sval->prix);
            $cprix->setCoeffQte($sval->qte);
            $cprix->setIdSousCategory(intval($_POST["id_souscategory"]));
            $cprix->setIdSupport($val->id);
            $cprix->setIdSouscategoryPrix( intval($_POST["tarifid"]));
            $cprix->save();
        }
    }

    //suppression des lignes non existant
    $coeffprix = new coeff_prix();
    $coeffprix = $coeffprix->getListIdPapierSupport(intval($_POST["id_souscategory"]), intval($_POST["tarifid"]));
    $coeffprix = explode("," ,$coeffprix["ligne"]);
    foreach ($coeffprix as $ligneKey=>$ligneVal) {
        if(in_array($ligneVal, $arrSousCategory)){
        }
        else {
            $coeffprix = new coeff_prix();
            $coeffprix->delBySousCategoryPapier(intval($_POST["id_souscategory"]) , $ligneVal, intval($_POST["tarifid"]));
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