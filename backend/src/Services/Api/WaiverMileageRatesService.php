<?php

namespace App\Services\Api;

use App\Repository\WaiverMileageRatesRepository;
use App\Entity\WaiverMileageRates;
use Doctrine\ORM\EntityManagerInterface;

class WaiverMileageRatesService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private WaiverMileageRatesRepository $waiver_mileage_rates_repository
  ) {}

  public function getRates()
  {
    $rates = $this->waiver_mileage_rates_repository->findAll();
    if (!$rates) return;
    $ratesData = array_map(fn($r) => [
      'id' => $r->getId(),
      'label' => $r->getLabel(),
      'amountPerKm' => $r->getAmountPerKm(),
    ], $rates);
    return $ratesData;
  }

  public function getRate(int $id)
  {
    $rate = $this->waiver_mileage_rates_repository->findOneBy(['id' => $id]);
    if (!$rate) return;
    $rateData = [
      'id' => $rate->getId(),
      'label' => $rate->getLabel(),
      'amountPerKm' => $rate->getAmountPerKm(),
    ];
    return $rateData;
  }

  public function addRate($data)
  {
    $rate = new WaiverMileageRates();
    $rate->setLabel($data['label']);
    $rate->setAmountPerKm($data['amountPerKm']);

    $this->entityManager->persist($rate);
    $this->entityManager->flush();

    return $rate;
  }

  public function setRate($data, int $id)
  {
    $rate = $this->waiver_mileage_rates_repository->findOneBy(['id' => $id]);
    if (!$rate) return;
    $rate->setLabel($data['label']);
    $rate->setAmountPerKm($data['amountPerKm']);
    $this->entityManager->flush();
    return $rate;
  }

  public function deleteRate(int $id)
  {
    $rate = $this->waiver_mileage_rates_repository->findOneBy(['id' => $id]);
    if (!$rate) return;
    $this->entityManager->remove($rate);
    $this->entityManager->flush();

    return true;
  }
}
