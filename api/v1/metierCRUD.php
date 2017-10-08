<?php
session_start();
include_once 'include_all.php';
include_once '../chromePHP.php';
$mode = $_GET['mode'];


if ($mode == 0) {
//delete function to delete a category
    $id = $_GET["id"];

    $modelmetier_category = new modelmetier_category();
    $modelmetier_category = $modelmetier_category->deleteByCategory($id);

    $modelmetier = new modelmetier();
    $modelmetier = $modelmetier->delete($id);
    $modelmetier = null;
    $modelmetier_category = null;
    print "done";
} else if ($mode == 1) {
    $id = $_GET["id"];

    $modelmetier_category = new modelmetier_category();
    $modelmetier_category = $modelmetier_category->delete($id);
    print "done";
    $modelmetier_category = null;
} else if ($mode == 2) {
    $id = $_GET["id"];
    $metier = new listmetier();
    $metier->delete($id);
    $metier = null;
    print "done";
} else if ($mode == 3) {

    /*
     * 0=>apropos
     * 1=>condition de vente
     * 2=>mentions d'utilisation
     * 3=>mentions legales
     */
    $pays = $_GET["param"];
    if ($pays == "") {
        $pays = "FR";
    }
    $type = intval($_GET["type"]);

    if ($pays == "FR") {
        $apropos = new apropos();
        $doc = new docs();
    } else if ($pays == "EN") {
        $apropos = new apropos_en();
        $doc = new docs_en();
    } else if ($pays == "AL") {
        $apropos = new apropos_al();
        $doc = new docs_al();
    } else if ($pays == "ES") {
        $apropos = new apropos_es();
        $doc = new docs_es();
    } else if ($pays == "IT") {
        $apropos = new apropos_it();
        $doc = new docs_it();
    }
    $apropos = $apropos->rechercher();


    $doc = $doc->findByPrimaryKey($_GET['type']);
    $arrData = array('id' => $doc->getId(), 'clef' => $doc->getCle(), 'title' => $doc->getTitle(), 'description' => $doc->getDescription(), 'data' => $apropos);
    print json_encode($arrData);
    $arrData = null;
    $apropos = null;
    $doc = null;
} else if ($mode == 4) {
    //$doc = new docs();
    /*
     * 0=>apropos
     * 1=>condition de vente
     * 2=>mentions d'utilisation
     * 3=>mentions legales
     */
    $pays = $_GET["param"];
    if ($pays == "") {
        $pays = "FR";
    }
    if ($pays == "FR") {
        $docu = new docs();
    } else if ($pays == "EN") {
        $docu = new docs_en();
    } else if ($pays == "AL") {
        $docu = new docs_al();
    } else if ($pays == "ES") {
        $docu = new docs_es();
    } else if ($pays == "IT") {
        $docu = new docs_it();
    }


    $type = intval($_GET['type']);
    //$docu = new docs();
    $docu = $docu->findByPrimaryKey($_GET['id']);
    $docu->setCle($_GET["type"]);
    $docu->setTitle($_GET["title"]);
    $docu->setDescription(addslashes($_GET["contenu"]));
    $docu->save();
    $docu = null;
    print 'done';
} else if ($mode == 5) {
    $pays = $_GET["param"];
    if ($pays == "") {
        $pays = "FR";
    }
    if ($pays == "FR") {
        $apropos = new apropos();
        $apropos1 = new apropos();
        $doc = new docs();
    } else if ($pays == "EN") {
        $apropos = new apropos_en();
        $apropos1 = new apropos_en();
        $doc = new docs_en();
    } else if ($pays == "AL") {
        $apropos = new apropos_al();
        $apropos1 = new apropos_al();
        $doc = new docs_al();
    } else if ($pays == "ES") {
        $apropos = new apropos_es();
        $apropos1 = new apropos_es();
        $doc = new docs_es();
    } else if ($pays == "IT") {
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
    $arrData = array('id' => $doc->getId(), 'clef' => $doc->getCle(), 'title' => $doc->getTitle(), 'description' => $doc->getDescription(), 'data' => $apropos);
    print json_encode($arrData);
    $arrData = null;
    $apropos = null;
    $apropos1 = null;
    $doc = null;
} else if ($mode == 6) {
    $contenu = json_decode($_GET['contenu']);

    $pays = $_GET["param"];
    if ($pays == "") {
        $pays = "FR";
    }
    if ($pays == "FR") {
        $docu = new docs();
    } else if ($pays == "EN") {
        $docu = new docs_en();
    } else if ($pays == "AL") {
        $docu = new docs_al();
    } else if ($pays == "ES") {
        $docu = new docs_es();
    } else if ($pays == "IT") {
        $docu = new docs_it();
    }

    $docu = $docu->findByPrimaryKey($contenu->id);
    $docu->setTitle($contenu->title);
    $docu->setDescription(addslashes($docu->getDescription()));
    $docu->save();
    foreach ($contenu->data as $ligne) {
        if ($pays == "FR") {
            $apropos = new apropos();
        } else if ($pays == "EN") {
            $apropos = new apropos_en();
        } else if ($pays == "AL") {
            $apropos = new apropos_al();
        } else if ($pays == "ES") {
            $apropos = new apropos_es();
        } else if ($pays == "IT") {
            $apropos = new apropos_it();
        }
        $apropos = $apropos->findByPrimaryKey($ligne->id);
        $apropos->setDescription(addslashes($ligne->description));
        $apropos->save();
    }

    return 'done';
    $apropos = null;
    $docu = null;
    $contenu = null;
} else if ($mode == 7) {
    $contenu = json_decode($_GET['contenu']);
    $pays = $_GET["param"];
    if ($pays == "") {
        $pays = "FR";
    }

    if ($pays == "FR") {
        $apropos = new apropos();
    } else if ($pays == "EN") {
        $apropos = new apropos_en();
    } else if ($pays == "AL") {
        $apropos = new apropos_al();
    } else if ($pays == "ES") {
        $apropos = new apropos_es();
    } else if ($pays == "IT") {
        $apropos = new apropos_it();
    }

    $apropos = $apropos->findByPrimaryKey($contenu->id);
    $apropos->setDescription(addslashes($contenu->description));
    $apropos->save();

    return 'done';
    $apropos = null;
    $contenu = null;
} else if ($mode == 8) {
    $pays = $_GET["param"];
    if ($pays == "") {
        $pays = "FR";
    }

    if ($pays == "FR") {
        $apropos = new apropos();
    } else if ($pays == "EN") {
        $apropos = new apropos_en();
    } else if ($pays == "AL") {
        $apropos = new apropos_al();
    } else if ($pays == "ES") {
        $apropos = new apropos_es();
    } else if ($pays == "IT") {
        $apropos = new apropos_it();
    }

    $apropos = $apropos->delete($_GET["id"]);
    return 'done';
    $apropos = null;
} else if ($mode == 9) {
    $contenu = json_decode($_GET['contenu']);
    $pays = $_GET["param"];
    if ($pays == "") {
        $pays = "FR";
    }
    if ($pays == "FR") {
        $docu = new docs();
    } else if ($pays == "EN") {
        $docu = new docs_en();
    } else if ($pays == "AL") {
        $docu = new docs_al();
    } else if ($pays == "ES") {
        $docu = new docs_es();
    } else if ($pays == "IT") {
        $docu = new docs_it();
    }

    $docu = $docu->findByPrimaryKey($contenu->id);
    $docu->setTitle($contenu->title);
    $docu->setDescription(addslashes($docu->getDescription()));
    $docu->save();
    $docu = null;
    $contenu = null;
} else if ($mode == 10) {

    /*
     * 1=>apropos
     * 2=>condition de vente
     * 3=>mentions d'utilisation
     * 4=>mentions legales
     */
    $pays = $_GET["param"];
    if ($pays == "") {
        $pays = "FR";
    }
    $type = intval($_GET["type"]);

    if ($pays == "FR") {
        $conditionvente = new conditionvente();
        $doc = new docs();
    } else if ($pays == "EN") {
        $conditionvente = new conditionvente_en();
        $doc = new docs_en();
    } else if ($pays == "AL") {
        $conditionvente = new conditionvente_al();
        $doc = new docs_al();
    } else if ($pays == "ES") {
        $conditionvente = new conditionvente_es();
        $doc = new docs_es();
    } else if ($pays == "IT") {
        $conditionvente = new conditionvente_it();
        $doc = new docs_it();
    }

    //$conditionvente = new conditionvente();
    $conditionvente = $conditionvente->rechercher();

    // $doc = new docs();
    $doc = $doc->findByPrimaryKey($_GET['type']);
    $arrData = array('id' => $doc->getId(), 'clef' => $doc->getCle(), 'title' => ($doc->getTitle()), 'description' => ($doc->getDescription()), 'data' => $conditionvente);

    print json_encode($arrData);
    $arrData = null;
    $doc = null;
    $conditionvente = null;
} else if ($mode == 11) {

    $pays = $_GET["param"];
    if ($pays == "") {
        $pays = "FR";
    }
    if ($pays == "FR") {
        $conditionvente = new conditionvente();
        $conditionvente1 = new conditionvente();
        $doc = new docs();
    } else if ($pays == "EN") {
        $conditionvente = new conditionvente_en();
        $conditionvente1 = new conditionvente_en();
        $doc = new docs_en();
    } else if ($pays == "AL") {
        $conditionvente = new conditionvente_al();
        $conditionvente1 = new conditionvente_al();
        $doc = new docs_al();
    } else if ($pays == "ES") {
        $conditionvente = new conditionvente_es();
        $conditionvente1 = new conditionvente_es();
        $doc = new docs_es();
    } else if ($pays == "IT") {
        $conditionvente = new conditionvente_it();
        $conditionvente1 = new conditionvente_it();
        $doc = new docs_it();
    }

    //$conditionvente = new conditionvente();
    $conditionvente->setDescription('');
    $conditionvente->save();

    //$conditionvente = new conditionvente();
    $conditionvente1 = $conditionvente1->rechercher();

    //$doc = new docs();
    $doc = $doc->findByPrimaryKey($_GET['type']);
    $arrData = array('id' => $doc->getId(), 'clef' => $doc->getCle(), 'title' => $doc->getTitle(), 'description' => $doc->getDescription(), 'data' => $conditionvente1);
    print json_encode($arrData);
    $arrData = null;
    $conditionvente1 = null;
    $doc = null;
} else if ($mode == 12) {
    $contenu = json_decode($_GET['contenu']);
    $pays = $_GET["param"];
    if ($pays == "") {
        $pays = "FR";
    }
    if ($pays == "FR") {
        $conditionvente = new conditionvente();
    } else if ($pays == "EN") {
        $conditionvente = new conditionvente_en();
    } else if ($pays == "AL") {
        $conditionvente = new conditionvente_al();
    } else if ($pays == "ES") {
        $conditionvente = new conditionvente_es();
    } else if ($pays == "IT") {
        $conditionvente = new conditionvente_it();
    }

    $conditionvente = $conditionvente->findByPrimaryKey($contenu->id);
    $conditionvente->setDescription(addslashes($contenu->description));
    $conditionvente->save();

    return 'done';
    $conditionvente = null;
    $contenu = null;
} else if ($mode == 13) {
    $pays = $_GET["param"];
    if ($pays == "") {
        $pays = "FR";
    }
    if ($pays == "FR") {
        $conditionvente = new conditionvente();
    } else if ($pays == "EN") {
        $conditionvente = new conditionvente_en();
    } else if ($pays == "AL") {
        $conditionvente = new conditionvente_al();
    } else if ($pays == "ES") {
        $conditionvente = new conditionvente_es();
    } else if ($pays == "IT") {
        $conditionvente = new conditionvente_it();
    }


    // $conditionvente = new conditionvente();
    $conditionvente = $conditionvente->delete($_GET["id"]);
    $conditionvente = null;
    return 'done';
} else if ($mode == 14) {
    $contenu = json_decode($_GET['contenu']);
    $pays = $_GET["param"];
    if ($pays == "") {
        $pays = "FR";
    }

    if ($pays == "FR") {
        $conditionvente = new conditionvente();
        $docu = new docs();
    } else if ($pays == "EN") {
        $conditionvente = new conditionvente_en();
        $docu = new docs_en();
    } else if ($pays == "AL") {
        $conditionvente = new conditionvente_al();
        $docu = new docs_al();
    } else if ($pays == "ES") {
        $conditionvente = new conditionvente_es();
        $docu = new docs_es();
    } else if ($pays == "IT") {
        $conditionvente = new conditionvente_it();
        $docu = new docs_it();
    }

    //$docu = new docs();
    $docu = $docu->findByPrimaryKey($contenu->id);
    $docu->setTitle($contenu->title);
    $docu->setDescription(addslashes($docu->getDescription()));
    $docu->save();
    $docu = null;
    $conditionvente = null;
    $contenu = null;
} else if ($mode == 15) {
    $tva = new tva();
    $tva = $tva->rechercher();

    print json_encode($tva);
    $tva = null;
} else if ($mode == 16) {
    $arrData = json_decode($_GET["data"]);
    foreach ($arrData as $item) {
        $tva = new tva();
        $tva = $tva->findByPrimaryKey($item->id);
        $tva->setValue($item->value);
        $tva->save();
    }

    $tva = new tva();
    $tva = $tva->rechercher();
    print json_encode($tva);
    $tva = null;
    $arrData = null;
} else if ($mode == 17) {
    date_default_timezone_set('America/Los_Angeles');
    $coupon_detail = new coupon_details();
    $coupon_detail = $coupon_detail->getCouponUserInfo($_GET["code"], $_SESSION["uid"]);

    if ($coupon_detail) {
        $couponMain = new coupon_main();
        $couponMain = $couponMain->findByPrimaryKey($coupon_detail["id_coupon"]);
        if ($couponMain) {
            $start_ts = strtotime($couponMain->getDateStart());
            $end_ts = strtotime($couponMain->getDateEnd());
            $user_ts = strtotime(date('Y-m-d'));

            // Check that user date is between start & end

            if (($user_ts >= $start_ts) && ($user_ts <= $end_ts)) {
                $row["authentificate"] = "VERIFIED";
                $row["montant"] = $couponMain->getVal();
                $row["id"] = $couponMain->getId();
            } else {
                $row["authentificate"] = "NOTVALID";
                $row["montant"] = "0";
                $row["id"] = 0;
            }
        } else {
            $row["authentificate"] = "NOTVALID";
            $row["montant"] = "0";
            $row["id"] = 0;
        }
    } else {
        $row["authentificate"] = "NOTVALID";
        $row["montant"] = "0";
        $row["id"] = 0;
    }
    print json_encode($row);
    $couponMain = null;
    $row = null;
}