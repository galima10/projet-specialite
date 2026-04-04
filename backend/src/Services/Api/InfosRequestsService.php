<?php

namespace App\Services\Api;

use App\Repository\InfosRequestsRepository;
use App\Repository\UsersRepository;
use App\Repository\WaiverMileageRatesRepository;
use App\Repository\KmMileageRatesRepository;
use App\Entity\InfosRequests;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Users;
use App\Enum\Budget;

class InfosRequestsService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private InfosRequestsRepository $infos_requests_repository,
    private UsersRepository $users_repository,
    private WaiverMileageRatesRepository $waiver_mileage_rates_repository,
    private KmMileageRatesRepository $km_mileage_rates_repository,
  ) {}

  public function getRequests(Users $currentUser): array|string|null
  {
    if (in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) {
      $requests = $this->infos_requests_repository->findAll();
    } else {
      $requests = $this->infos_requests_repository->findBy(['user' => $currentUser]);
    }
    if (!$requests) return null;
    return array_map(fn($r) => [
      'id' => $r->getId(),
      'createdAt' => $r->getCreatedAt(),
      'reason' => $r->getReason(),
      'budget' => $r->getBudget(),
      'amountWaiver' => $r->getAmountWaiver(),
      'userId' => $r->getUser()->getId(),
      'waiverMileageRateId' => $r->getWaiverMileageRateId(),
      'kmMileageRateId' => $r->getKmMileageRateId(),
    ], $requests);
  }

  public function getRequest(int $id, Users $currentUser): array|string|null
  {
    $request = $this->infos_requests_repository->find($id);
    if (!$request) return null;
    if (!in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER']) && $currentUser->getId() !== $request->getUserId()) return 'Forbidden';
    return [
      'id' => $request->getId(),
      'createdAt' => $request->getCreatedAt(),
      'reason' => $request->getReason(),
      'budget' => $request->getBudget(),
      'amountWaiver' => $request->getAmountWaiver(),
      'userId' => $request->getUserId(),
      'waiverMileageRateId' => $request->getWaiverMileageRateId(),
      'kmMileageRateId' => $request->getKmMileageRateId(),
    ];
  }

  public function addRequest(array $data, Users $currentUser): array|string|null
  {
    $existingRequest = $this->infos_requests_repository->findOneBy([
      'reason' => $data['reason'],
      'user' => $currentUser,
    ]);
    if ($existingRequest) return null;
    if (
      !isset($data['reason']) || $data['reason'] === ''
      || !isset($data['budget']) || $data['budget'] === ''
      || !isset($data['amountWaiver']) || $data['amountWaiver'] === null
    ) {
      return 'Missing';
    }
    if (in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) {
      if (!isset($data['userId'])) return 'Missing userId';
      if ($currentUser->getId() !== (int)$data['userId'] && !in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) {
        return 'Forbidden';
      }
    } else {
      $data['userId'] = $currentUser->getId(); // safe
    }
    $request = new InfosRequests();
    $request->setCreatedAtValue();
    $request->setReason($data['reason']);
    $request->setBudget(Budget::from($data['budget']));
    if (isset($data['amountWaiver'])) {
      $request->setAmountWaiver((string)$data['amountWaiver']);
    } else {
      $request->setAmountWaiver(null);
    }
    if (in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) {
      $user = $this->users_repository->find($data['userId']);
      if (!$user) return null;
      $request->setUser($user);
    } else {
      $request->setUser($currentUser);
    }
    $waiverMileageRate = isset($data['waiverMileageRateId']) && $data['waiverMileageRateId'] !== null
      ? $this->waiver_mileage_rates_repository->find($data['waiverMileageRateId'])
      : null;
    $request->setWaiverMileageRate($waiverMileageRate);

    $kmMileageRate = isset($data['kmMileageRateId']) && $data['kmMileageRateId'] !== null
      ? $this->km_mileage_rates_repository->find($data['kmMileageRateId'])
      : null;
    $request->setKmMileageRate($kmMileageRate);
    $this->entityManager->persist($request);
    $this->entityManager->flush();
    return [
      'id' => $request->getId(),
      'createdAt' => $request->getCreatedAt(),
      'reason' => $request->getReason(),
      'budget' => $request->getBudget(),
      'amountWaiver' => $request->getAmountWaiver(),
      'waiverMileageRateId' => $request->getWaiverMileageRateId(),
      'kmMileageRateId' => $request->getKmMileageRateId(),
    ];
  }

  public function setRequest(array $data, int $id, Users $currentUser): array|string|null
  {
    $request = $this->infos_requests_repository->find($id);
    if (!$request) return null;
    if (empty($data['reason']) || empty($data['budget']) || empty($data['amountWaiver']) || empty($data['userId'])) {
      return 'Missing';
    }
    if (!in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER']) && $currentUser->getId() !== $request->getUserId()) return 'Forbidden';
    $request->setReason($data['reason']);
    $request->setBudget(Budget::from($data['budget']));
    $request->setAmountWaiver($data['amountWaiver']);
    if (in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) {
      $user = $this->users_repository->find($data['userId']);
      if (!$user) return null;
      $request->setUser($user);
    } else {
      $request->setUser($currentUser);
    }
    $waiverMileageRate = $data['waiverMileageRateId']
      ? $this->waiver_mileage_rates_repository->find($data['waiverMileageRateId'])
      : null;
    $request->setWaiverMileageRate($waiverMileageRate);
    $kmMileageRate = $data['kmMileageRateId']
      ? $this->km_mileage_rates_repository->find($data['kmMileageRateId'])
      : null;
    $request->setKmMileageRate($kmMileageRate);
    $this->entityManager->flush();
    return [
      'id' => $request->getId(),
      'createdAt' => $request->getCreatedAt(),
      'reason' => $request->getReason(),
      'budget' => $request->getBudget(),
      'amountWaiver' => $request->getAmountWaiver(),
      'userId' => $request->getUserId(),
      'waiverMileageRateId' => $request->getWaiverMileageRateId(),
      'kmMileageRateId' => $request->getKmMileageRateId(),
    ];
  }

  public function deleteRequest(int $id, Users $currentUser): bool|string|null
  {
    $request = $this->infos_requests_repository->find($id);
    if (!$request) return null;
    if (!in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER']) && $currentUser->getId() !== $request->getUserId()) return 'Forbidden';
    $this->entityManager->remove($request);
    $this->entityManager->flush();
    return true;
  }
}
