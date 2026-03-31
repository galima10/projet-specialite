<?php

namespace App\Services\Api;

use App\Repository\InfosRequestsRepository;
use App\Repository\UsersRepository;
use App\Repository\WaiverMileageRatesRepository;
use App\Repository\KmMileageRatesRepository;
use App\Repository\ExpensesListsRepository;
use App\Entity\InfosRequests;
use Doctrine\ORM\EntityManagerInterface;
use App\Enum\Budget;

class InfosRequestsService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private InfosRequestsRepository $infos_requests_repository,
    private UsersRepository $users_repository,
    private WaiverMileageRatesRepository $waiver_mileage_rates_repository,
    private KmMileageRatesRepository $km_mileage_rates_repository,
    private ExpensesListsRepository $expenses_lists_repository,
  ) {}

  public function getRequests($currentUser)
  {
    if (!in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) return 'Forbidden';
    $requests = $this->infos_requests_repository->findAll();
    if (!$requests) return;
    return array_map(fn($r) => [
      'id' => $r->getId(),
      'createdAt' => $r->getCreatedAt(),
      'reason' => $r->getReason(),
      'budget' => $r->getBudget(),
      'amount_waiver' => $r->getAmountWaiver(),
      'userId' => $r->getUser()->getId(),
      'waiverMileageRateId' => $r->getWaiverMileageRate()->getId(),
      'kmMileageRateId' => $r->getKmMileageRate()->getId(),
      'expensesListId' => $r->getExpensesList()->getId(),
    ], $requests);
  }

  public function getRequest(int $id, $currentUser)
  {
    $request = $this->infos_requests_repository->find($id);
    if (!$request) return;
    if (!in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER']) || $currentUser->getId() !== $request->getUserId()) return 'Forbidden';
    return [
      'id' => $request->getId(),
      'createdAt' => $request->getCreatedAt(),
      'reason' => $request->getReason(),
      'budget' => $request->getBudget(),
      'amount_waiver' => $request->getAmountWaiver(),
      'userId' => $request->getUserId(),
      'waiverMileageRateId' => $request->getWaiverMileageRateId(),
      'kmMileageRateId' => $request->getKmMileageRateId(),
      'expensesListId' => $request->getExpensesListId(),
    ];
  }

  public function addRequest($data, $currentUser)
  {
    $existingRequest = $this->infos_requests_repository->findOneBy(['reason' => $data['reason']]);
    if ($existingRequest) return;
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN' || $currentUser->getId() !== (int)$data['userId']) return 'Forbidden';
    $request = new InfosRequests();
    $request->setReason($data['reason']);
    $request->setBudget($data['budget']);
    $request->setAmountWaiver($data['amount_waiver']);
    $request->setUser($currentUser);
    $waiverMileageRate = $this->waiver_mileage_rates_repository->find($data['waiverMileageRateId']);
    if (!$waiverMileageRate) return;
    $request->setWaiverMileageRate($waiverMileageRate);
    $kmMileageRate = $this->km_mileage_rates_repository->find($data['kmMileageRateId']);
    if (!$kmMileageRate) return;
    $request->setKmMileageRate($kmMileageRate);
    $expensesList = $this->expenses_lists_repository->find($data['expensesListId']);
    if (!$expensesList) return;
    $request->setExpensesList($expensesList);
    $this->entityManager->persist($request);
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
      'expensesListId' => $request->getExpensesListId(),
    ];
  }

  public function setRequest($data, int $id, $currentUser)
  {
    $request = $this->infos_requests_repository->find($id);
    if (!$request) return;
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN' || $currentUser->getId() !== $request->getUserId()) return 'Forbidden';
    $request->setReason($data['reason']);
    $request->setBudget($data['budget']);
    $request->setAmountWaiver($data['amount_waiver']);
    $user = $this->users_repository->find($data['userId']);
    if (!$user) return;
    $request->setUser($user);
    $waiverMileageRate = $this->waiver_mileage_rates_repository->find($data['waiverMileageRateId']);
    if (!$waiverMileageRate) return;
    $request->setWaiverMileageRate($waiverMileageRate);
    $kmMileageRate = $this->km_mileage_rates_repository->find($data['kmMileageRateId']);
    if (!$kmMileageRate) return;
    $request->setKmMileageRate($kmMileageRate);
    $expensesList = $this->expenses_lists_repository->find($data['expensesListId']);
    if (!$expensesList) return;
    $request->setExpensesList($expensesList);
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
      'expensesListId' => $request->getExpensesListId(),
    ];
  }

  public function deleteRequest(int $id, $currentUser)
  {
    $request = $this->infos_requests_repository->find($id);
    if (!$request) return;
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN' || $currentUser->getId() !== (int)$request->getUser()->getId()) return 'Forbidden';
    $this->entityManager->remove($request);
    $this->entityManager->flush();
    return true;
  }
}
