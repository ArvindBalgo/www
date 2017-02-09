
<?php
include_once 'include_all.php';
include_once '../chromePHP.php';

$mode = $_GET['mode'];
if($mode == 0) {
    $metier = new listmetier();
    $metier = $metier->rechercher();

    print json_encode($metier);
    return;
}
else if($mode == 1) {
    $metier = new listmetier();
    $metier->setLibelle($_GET["desig"]);
    $metier->setSubLibelle($_GET["sub_desig"]);
    $metier->setActive(1);
    $re= $metier->save();
    print $re;
    return;
}
else if($mode == 2) {
    $metier = new modelmetier();
    $metier = $metier->rechercher();
    print json_encode($metier);
    return;
}
else if($mode == 3) {
    $cata = new cata();
    $cata = $cata->findAllByMetier($_GET["metier"]);
    $row =[];
    foreach($cata as $ligcata){
        $cata_ligne = new cata_ligne();

        $cata_ligne = $cata_ligne->findByPrimaryKey($ligcata["id_front"]);
        $cata_ligne_params = new cata_ligne_params();
        $cata_ligne_params = $cata_ligne_params->findByIdCata($ligcata["id_front"]);

        $arrFront = ["src"=>$cata_ligne->getSrc(),"title"=>$cata_ligne->getTitle(), "elements"=>$cata_ligne_params ];
        $ligcata["front"] = $arrFront;



        $cata_ligne = $cata_ligne->findByPrimaryKey($ligcata["id_back"]);
        $cata_ligne_params = new cata_ligne_params();
        $cata_ligne_params = $cata_ligne_params->findByIdCata($ligcata["id_front"]);
        $arrBack = ["src"=>$cata_ligne->getSrc(),"title"=>$cata_ligne->getTitle(), "elements"=>$cata_ligne_params ];
        $ligcata["back"] = $arrBack;

        $row[] = $ligcata;
    }
print json_encode($row);
    return;
}
else if($mode == 4) {
    $listmetier = new listmetier();
    $listmetier->setLibelle(trim($_GET["libelle"]));
    $listmetier->setSubLibelle(trim($_GET["sub_libelle"]));
    $listmetier->setActive($_GET["actif"]);
    $listmetier->setPays($_GET["pays"]);
    $listmetier->setKeyLibelle($_GET["key_libelle"]);
    $listmetier->setKeySubLibelle($_GET["key_sub_libelle"]);
    $listmetier->save();
}

else if($mode == 5){
    $listmetier  = new listmetier();
    $listmetier = $listmetier->findByPrimaryKey(trim($_GET["id"]));

    $listmetier->setId($listmetier->getId());
    $listmetier->setLibelle(trim($_GET["libelle"]));
    $listmetier->setSubLibelle(trim($_GET["sub_libelle"]));
    $listmetier->setActive($_GET["actif"]);
    $listmetier->setPays($_GET[pays]);
    $listmetier->setKeyLibelle($_GET["key_libelle"]);
    $listmetier->setKeySubLibelle($_GET["key_sub_libelle"]);
    $listmetier->save();
}

else if($mode == 6){
    $model = new modelmetier();
    $model = $model->findByPrimaryKey(trim($_GET["id"]));
    $model->setDescription(trim($_GET["name"]));
    $model->setKeyLibelle(trim($_GET["key"]));
    $model->setQte($_GET["qte"]);
    $model->setActive($_GET["active"]);

    $model->save();
    print "done";
}
else if($mode == 7) {
    $model = new modelmetier_category();
    $model = $model->findByModel($_GET['id']);
    print json_encode($model);
}
else if($mode == 8) {
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
}
else if($mode == 9) {
    $metier = new modelmetier();
    $metier = $metier->rechModelCategory();
    print json_encode($metier);
    return;
}
else if($mode == 10){
    $instruction = new instructions();
    $instruction->setInstruction($_GET["text"]);
    $instruction->save();
}
else if($mode == 11) {
    $pays = $_GET["param"];
    if($pays == "FR") {
        $instruction = new instructions();
        $instruction = $instruction->rechercher();
        print json_encode($instruction);
    }
    else if($pays == "EN") {
        $instruction = new instructions_en();
        $instruction = $instruction->rechercher();
        print json_encode($instruction);
    }
    else if($pays == "AL"){
        $instruction = new instructions_al();
        $instruction = $instruction->rechercher();
        print json_encode($instruction);
    }
    else if($pays == "IT"){
        $instruction = new instructions_it();
        $instruction = $instruction->rechercher();
        print json_encode($instruction);
    }
    else if($pays == "ES"){
        $instruction = new instructions_es();
        $instruction = $instruction->rechercher();
        print json_encode($instruction);
    }

}
else if($mode == 12) {
    $pays = $_GET["param"];
    if($pays == "FR") {
        $instruction = new instructions();
    }
    else if($pays == "EN") {
        $instruction = new instructions_en();
    }
    else if($pays == "AL"){
        $instruction = new instructions_al();

    }
    else if($pays == "IT"){
        $instruction = new instructions_it();

    }
    else if($pays == "ES"){
        $instruction = new instructions_es();

    }
    $instruction = $instruction->findByPrimaryKey($_GET["id"]);
    $instruction->setInstruction($_GET["instruction"]);
    $instruction->save();
}
else if($mode == 13){
    $id_metier = $_GET["id"];
    $arrInfo = array();
    $modelmetier = new modelmetier();
    $modelmetier = $modelmetier->findByPrimaryKey($id_metier);
    $cataDimension = new cata();
    $cataDimension = $cataDimension->findDimsByModelMetier($id_metier);

    $arrInfo = array("qte" => $modelmetier->getQte());
    print json_encode($arrInfo);
}
else if($mode == 14) {
    $cataPapier = new cata_papier();
    $cataPapier->setDescription($_GET["description"]);
    $cataPapier->save();

    $cataPapier1 = new cata_papier();
    $cataPapier1 = $cataPapier1->rechercher();

    print json_encode($cataPapier1);
}
else if($mode == 15){
    //recup tous les type de support
    $cataPapier = new cata_papier();
    $cataPapier = $cataPapier->rechercher();
    print json_encode($cataPapier);
}
else if ($mode == 16) {
    $cataPapier = new cata_papier();
    $cataPapier = $cataPapier->findByPrimaryKey($_GET["id"]);
    $cataPapier->setDescription($_GET["description"]);
    $cataPapier->save();

    $cataPapier1 = new cata_papier();
    $cataPapier1 = $cataPapier1->rechercher();

    print json_encode($cataPapier1);
}
else if($mode == 17) {
    $cataPapier = new cata_papier();
    $cataPapier->delete($_GET["id"]);

    $cataPapier1 = new cata_papier();
    $cataPapier1 = $cataPapier1->rechercher();

    print json_encode($cataPapier1);
}
else if($mode == 18) {
    $subCategory = new modelmetier_category();
    $subCategory = $subCategory->findByPrimaryKey($_GET["id"]);
    $subCategory->setActive($_GET["active"]);
    $subCategory->setDescription($_GET["description"]);
    $subCategory->setKeyDescription($_GET["key_description"]);
    $subCategory->setMessage($_GET["message"]);
    $subCategory->setKeyMessage($_GET["key_message"]);
    $subCategory->save();
    return 'done';
}