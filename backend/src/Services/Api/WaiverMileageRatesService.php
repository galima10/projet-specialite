<?php

namespace App\Services\Api;

use App\Repository\WaiverMileageRatesRepository;
use App\Entity\WaiverMileageRates;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Users;

class WaiverMileageRatesService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private WaiverMileageRatesRepository $waiver_mileage_rates_repository
  ) {}

  public function getRates(): ?array
  {
    $rates = $this->waiver_mileage_rates_repository->findAll();
    if (!$rates) return null;
    return array_map(fn($r) => [
      'id' => $r->getId(),
      'label' => $r->getLabel(),
      'amountPerKm' => $r->getAmountPerKm(),
    ], $rates);
  }

  public function getRate(int $id): ?array
  {
    $rate = $this->waiver_mileage_rates_repository->find($id);
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
    $existingRate = $this->waiver_mileage_rates_repository->findOneBy(['label' => $data['label']]);
    if ($existingRate) return null;
    if (empty($data['label']) || empty($data['amountPerKm'])) {
      return 'Missing';
    }
    $rate = new WaiverMileageRates();
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

  public function setRate($data, int $id, Users $currentUser): array|string|null
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN') return 'Forbidden';
    $rate = $this->waiver_mileage_rates_repository->find($id);
    if (!$rate) return null;
    if (empty($data['label']) || empty($data['amountPerKm'])) {
      return 'Missing';
    }
    $rate->setLabel($data['label']);
    $rate->setAmountPerKm($data['amountPerKm']);
    $this->entityManager->flush();
    return [
      'id' => $rate->getId(),
      'label' => $rate->getLabel(),
      'amountPerKm' => $rate->getAmountPerKm(),
    ];
  }

  public function deleteRate(int $id, $currentUser):  bool|string|null
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN') return 'Forbidden';
    $rate = $this->waiver_mileage_rates_repository->find($id);
    if (!$rate) return null;
    $this->entityManager->remove($rate);
    $this->entityManager->flush();
    return true;
  }
}
