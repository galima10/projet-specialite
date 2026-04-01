<?php

namespace App\Services\Api;

use App\Repository\KmMileageRatesRepository;
use App\Entity\KmMileageRates;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Users;

class KmMileageRatesService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private KmMileageRatesRepository $km_mileage_rates_repository
  ) {}

  public function getRates(): ?array
  {
    $rates = $this->km_mileage_rates_repository->findAll();
    if (!$rates) return null;
    return array_map(fn($r) => [
      'id' => $r->getId(),
      'label' => $r->getLabel(),
      'amountPerKm' => $r->getAmountPerKm(),
    ], $rates);
  }

  public function getRate(int $id): ?array
  {
    $rate = $this->km_mileage_rates_repository->find($id);
    if (!$rate) return null;
    return [
      'id' => $rate->getId(),
      'label' => $rate->getLabel(),
      'amountPerKm' => $rate->getAmountPerKm(),
    ];
  }

  public function addRate(array $data, Users $currentUser): array|string|null
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN') return 'Forbidden';
    $existingRate = $this->km_mileage_rates_repository->findOneBy(['label' => $data['label']]);
    if ($existingRate) return null;
    $rate = new KmMileageRates();
    $rate->setLabel($data['label']);
    $rate->setAmountPerKm($data['amountPerKm']);
    $this->entityManager->persist($rate);
    $this->entityManager->flush();
    return [
      'id' => $rate->getId(),
      'label' => $rate->getLabel(),
      'amountPerKm' => $rate->getAmountPerKm(),
    ];
  }

  public function setRate(array $data, int $id, Users $currentUser): array|string|null
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN') return 'Forbidden';
    $rate = $this->km_mileage_rates_repository->find($id);
    if (!$rate) return null;
    $rate->setLabel($data['label']);
    $rate->setAmountPerKm($data['amountPerKm']);
    $this->entityManager->flush();
    return [
      'id' => $rate->getId(),
      'label' => $rate->getLabel(),
      'amountPerKm' => $rate->getAmountPerKm(),
    ];
  }

  public function deleteRate(int $id, Users $currentUser):  bool|string|null
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN') return 'Forbidden';
    $rate = $this->km_mileage_rates_repository->find($id);
    if (!$rate) return null;
    $this->entityManager->remove($rate);
    $this->entityManager->flush();
    return true;
  }
}
