<?php

namespace App\Services\Api;

use App\Repository\KmMileageRatesRepository;
use App\Entity\KmMileageRates;
use Doctrine\ORM\EntityManagerInterface;

class KmMileageRatesService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private KmMileageRatesRepository $km_mileage_rates_repository
  ) {}

  public function getRates()
  {
    $rates = $this->km_mileage_rates_repository->findAll();
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
    $rate = $this->km_mileage_rates_repository->find($id);
    if (!$rate) return;
    $rateData = [
      'id' => $rate->getId(),
      'label' => $rate->getLabel(),
      'amountPerKm' => $rate->getAmountPerKm(),
    ];
    return $rateData;
  }

  public function addRate($data, $currentUser)
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN') return 'Forbidden';
    $rate = $this->km_mileage_rates_repository->findOneBy(['label' => $data['label']]);
    if ($rate) return;
    $rate = new KmMileageRates();
    $rate->setLabel($data['label']);
    $rate->setAmountPerKm($data['amountPerKm']);

    $this->entityManager->persist($rate);
    $this->entityManager->flush();

    return $rate;
  }

  public function setRate($data, int $id, $currentUser)
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN' && $currentUser->getId() !== (int)$id) return 'Forbidden';
    $rate = $this->km_mileage_rates_repository->find($id);
    if (!$rate) return;
    $rate->setLabel($data['label']);
    $rate->setAmountPerKm($data['amountPerKm']);
    $this->entityManager->flush();
    return $rate;
  }

  public function deleteRate(int $id, $currentUser)
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN' && $currentUser->getId() !== (int)$id) return 'Forbidden';
    $rate = $this->km_mileage_rates_repository->find($id);
    if (!$rate) return;
    $this->entityManager->remove($rate);
    $this->entityManager->flush();

    return true;
  }
}
