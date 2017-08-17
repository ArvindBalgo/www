<?php
session_start();
include_once 'include_all.php';
$mode = $_POST['mode'];
require('../fpdf.php');
include_once "../chromePHP.php";

class PDF extends FPDF
{
// Page footer
    function Footer()
    {
        // Position at 1.5 cm from bottom
        $this->SetY(-15);
        // Arial italic 8
        $this->SetFont('Arial', 'I', 8);
        // Page number
        $this->Cell(0, 10, utf8_decode("Pour la communauté Européene, TVA à défalquer sur la base de l'article 259-A et 259-B"), 0, 0, 'C');
        $this->Cell(0, 10, 'Page ' . $this->PageNo(), 0, 0, 'C');
    }
}

if ($mode == 0) {
//generate facture


    $id = $_POST["id"];
    $orderInfo = new orders_main();
    $orderInfo = $orderInfo->findByPrimaryKey($id);

    $orderDetailInfo = new orders_details();
    $orderDetailInfo = $orderDetailInfo->getProds($id);
    $userInfo = new users();
    $userInfo = $userInfo->findByPrimaryKey($orderInfo->getIdUser());
    chromePHP::log($orderDetailInfo);
    chromePHP::log($orderInfo);
    chromePHP::log($userInfo);
    $facture = new PDF();
    $facture->AddPage();
    $facture->SetFont('Arial', 'B', 16);
    $facture->Cell(40, 10, 'EXAKOM');
    $facture->Cell(0, 10, 'Facture No. ' . $orderInfo->getId(), 0, 0, 'R');
    $facture->Ln(5);
    $facture->SetTextColor(105, 105, 105);
    $facture->SetFont('Arial', 'I', 12);
    $facture->Cell(40, 10, '7, Rue de Castellane');
    $facture->Ln(5);
    $facture->Cell(40, 10, '75008 PARIS');
    $facture->Ln(5);
    $facture->Cell(40, 10, 'FR81 822624334 00014');
    $facture->Ln(15);

    $facture->SetFont('Arial', '', 12);
    $facture->Cell(40, 10, 'Date: ');
    $facture->Cell(65, 10, $orderInfo->getDateCreated());
    $facture->Ln(5);

    $facture->Cell(40, 10, 'Nom: ');
    $facture->Cell(65, 10, $userInfo->getName() . " " . $userInfo->getSurname());
    $facture->Ln(5);

    $facture->Cell(40, 10, 'No Siret ');
    $facture->Cell(65, 10, $userInfo->getSiret());
    $facture->Ln(10);
    // Colors, line width and bold font
    $facture->SetFillColor(230, 191, 255);
    $facture->SetTextColor(0);
    $facture->SetDrawColor(128, 0, 0);
    $facture->SetLineWidth(.3);
    $facture->SetFont('', 'B');
    // Header
    $header = array("Quantité", 'Description', 'Prix Unitaire HT', 'Total');
    $w = array(40, 35, 40, 45);
    for ($i = 0; $i < count($header); $i++)
        $facture->Cell($w[$i], 7, utf8_decode($header[$i]), 1, 0, 'C', true);
    $facture->Ln();

    // Color and font restoration
    $facture->SetFillColor(224, 235, 255);
    $facture->SetTextColor(0);
    $facture->SetFont('');
    $fill = false;
    if($orderDetailInfo) {
        foreach ($orderDetailInfo as $row) {
            $facture->Cell($w[0], 6, $row['qte'], 'LRB', 0, 'L', $fill);
            $facture->Cell($w[1], 6, $row['title'], 'LRB', 0, 'L', $fill);
            $facture->Cell($w[2], 6, $row['unitprix'], 'LRB', 0, 'R', $fill);
            $facture->Cell($w[3], 6, $row['prix_ht'], 'LRB', 0, 'R', $fill);
            $facture->Ln();
            $fill = !$fill;
        }
    }

    $facture->Ln();
    $facture->Cell($w[0], 6, utf8_decode("Modalité de Paiement"), 0, 0, 'L', false);
    $facture->Cell($w[1], 6, (""), 0, 0, 'L', false);
    $facture->Cell($w[2], 6, ("Montant Total HT"), 0, 0, 'L', true);
    $facture->Cell($w[3], 6, number_format((float)$orderInfo->getTotalPrixHT(), 2, '.', ''), "LRTB", 0, 'R', false);
    $facture->Ln();
    $facture->Cell($w[0], 6, "", 0, 0, 'L', false);
    $facture->Cell($w[1], 6, (""), 0, 0, 'L', false);
    $facture->Cell($w[2], 6, ("Coupon Remise"), 0, 0, 'L', true);
    $facture->Cell($w[3], 6, (""), "LRTB", 0, 'R', false);
    $facture->Ln();
    $facture->Cell($w[0], 6, "", 0, 0, 'L', false);
    $facture->Cell($w[1], 6, (""), 0, 0, 'L', false);
    $facture->Cell($w[2], 6, ("Frais Livraison HT"), 0, 0, 'L', true);
    $facture->Cell($w[3], 6, number_format((float)$orderInfo->getTotalLivraisonHT(), 2, '.', ''), "LRTB", 0, 'R', false);
    $facture->Ln();
    $facture->Cell($w[0], 6, "", 0, 0, 'L', false);
    $facture->Cell($w[1], 6, (""), 0, 0, 'L', false);
    $facture->Cell($w[2], 6, ("Montant TVA "), 0, 0, 'L', true);
    $facture->Cell($w[3], 6, number_format((float)$orderInfo->getTax(), 2, '.', ''), "LRTB", 0, 'R', false);
    $facture->Ln();
    $facture->Cell($w[0], 6, "", 0, 0, 'L', false);
    $facture->Cell($w[1], 6, (""), 0, 0, 'L', false);
    $facture->Cell($w[2], 6, ("Montant TTC"), 0, 0, 'L', true);
    $facture->Cell($w[3], 6, number_format((float)$orderInfo->getTotalPrixTTC(), 2, '.', ''), "B", 0, 'R', false);
    // Position at 1.5 cm from bottom
    //$facture->SetY(-15);
    // Arial italic 8
    //$facture->SetFont('Arial','I',8);
    // Page number
    //$facture->Cell(0,10,"Pour la communauté Européene, TVA à défalquer sur la base de l'article 259-A et 259-B",0,0,'C');
    // Closing line
    //$facture->Cell(array_sum($w),0,'','T');


    /*$facture->Cell(40, 10, 'Pour la communaute Europeenne  ');
    $facture->Ln(5);
    $facture->Cell(40, 10, 'numero de TVA intracomuautaire obligatoire');
    $facture->Ln(5);
    $facture->Cell(40, 10, 'FR81 82262443334 00014 ');
    $facture->Ln(5);*/

    $fileNameFacture = "../pdf/factures/" . $id . '.pdf';
    //$pdf->Output($filename, 'F');
    $facture->Output($fileNameFacture, 'F');

    unset($orderInfo);
    unset($orderDetailInfo);
    unset($userInfo);
    print ("../../../api/pdf/factures/" . $id . '.pdf');
}