<?php

namespace App\Services\Api;

use App\Repository\KmMileageRatesRepository;
use App\Entity\KmMileageRates;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Users;
use App\Enum\RateType;

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
      'type' => $r->getType(),
    ], $rates);
  }

  public function addRate(array $data, Users $currentUser): array|string|null
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN') return 'Forbidden';
    $existingRate = $this->km_mileage_rates_repository->findOneBy(['label' => $data['label']]);
    if ($existingRate) return null;
    if (empty($data['label']) || empty($data['amountPerKm'])) {
      return 'Missing';
    }
    $rate = new KmMileageRates();
    $rate->setLabel($data['label']);
    $rate->setAmountPerKm($data['amountPerKm']);
    $rate->setType(RateType::from($data['type']));
    $this->entityManager->persist($rate);
    $this->entityManager->flush();
    return [
      'id' => $rate->getId(),
      'label' => $rate->getLabel(),
      'amountPerKm' => $rate->getAmountPerKm(),
      'type' => $rate->getType(),
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
