<?php

namespace App\Services\Api;

use App\Repository\ExpensesListsRepository;
use App\Repository\InfosRequestsRepository;
use App\Entity\ExpensesLists;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Users;

class ExpensesListsService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private ExpensesListsRepository $expenses_lists_repository,
    private InfosRequestsRepository $infos_requests_repository,
  ) {}

  private function getUserListById(int $id, Users $user): ?ExpensesLists
  {
    $infosRequests = $this->infos_requests_repository->findBy(['user' => $user]);
    foreach ($infosRequests as $request) {
      foreach ($request->getExpensesLists() as $list) {
        if ($list->getId() === $id) {
          return $list;
        }
      }
    }
    return null;
  }

  public function getLists(Users $currentUser): ?array
  {
    if (in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) {
      $lists = $this->expenses_lists_repository->findAll();
    } else {
      $infosRequests = $this->infos_requests_repository->findBy(['user' => $currentUser]);
      if (!$infosRequests) return null;
      $lists = [];
      foreach ($infosRequests as $request) {
        $lists = array_merge($lists, $request->getExpensesLists()->toArray());
      }
      $lists = array_unique($lists, SORT_REGULAR);
    }
    if (!$lists) return null;
    return array_map(fn($l) => [
      'id' => $l->getId(),
      'date' => $l->getExpenseDate(),
      'object' => $l->getExpenseObject(),
      'km' => $l->getKilometers(),
      'transportCost' => $l->getTransportMiscCost(),
      'othersCost' => $l->getOthersCost(),
      'infosRequestId' => $l->getInfosRequestId(),
    ], $lists);
  }

  public function getList(int $id, Users $currentUser): ?array
  {
    $list = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_lists_repository->find($id)
      : $this->getUserListById($id, $currentUser);
    if (!$list) return null;
    return [
      'id' => $list->getId(),
      'date' => $list->getExpenseDate(),
      'object' => $list->getExpenseObject(),
      'km' => $list->getKilometers(),
      'transportCost' => $list->getTransportMiscCost(),
      'othersCost' => $list->getOthersCost(),
      'infosRequestId' => $list->getInfosRequestId(),
    ];
  }

  public function addList(array $data): ?array
  {
    $existingList = $this->expenses_lists_repository->findOneBy(['expenseObject' => $data['object']]);
    if ($existingList) return null;
    $list = new ExpensesLists();
    $list->setExpenseDate(new \DateTimeImmutable($data['date']));
    $list->setExpenseObject($data['object']);
    $list->setKilometers($data['km']);
    $list->setTransportMiscCost($data['transportCost']);
    $list->setOthersCost($data['othersCost']);
    $infosRequest = $this->infos_requests_repository->find($data['infosRequestId']);
    if (!$infosRequest) return null;
    $list->setInfosRequest($infosRequest);
    $this->entityManager->persist($list);
    $this->entityManager->flush();
    return [
      'id' => $list->getId(),
      'date' => $list->getExpenseDate(),
      'object' => $list->getExpenseObject(),
      'km' => $list->getKilometers(),
      'transportCost' => $list->getTransportMiscCost(),
      'othersCost' => $list->getOthersCost(),
      'infosRequestId' => $list->getInfosRequestId(),
    ];
  }

  public function setList(array $data, int $id, Users $currentUser): ?array
  {
    $list = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_lists_repository->find($id)
      : $this->getUserListById($id, $currentUser);
    if (!$list) return null;
    $list->setExpenseDate(new \DateTimeImmutable($data['date']));
    $list->setExpenseObject($data['object']);
    $list->setKilometers($data['km']);
    $list->setTransportMiscCost($data['transportCost']);
    $list->setOthersCost($data['othersCost']);
    $infosRequest = $this->infos_requests_repository->find($data['infosRequestId']);
    if (!$infosRequest) return null;
    $list->setInfosRequest($infosRequest);
    $this->entityManager->flush();
    return [
      'id' => $list->getId(),
      'date' => $list->getExpenseDate(),
      'object' => $list->getExpenseObject(),
      'km' => $list->getKilometers(),
      'transportCost' => $list->getTransportMiscCost(),
      'othersCost' => $list->getOthersCost(),
      'infosRequestId' => $list->getInfosRequestId(),
    ];
  }

  public function deleteList(int $id, Users $currentUser): ?bool
  {
    $list = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_lists_repository->find($id)
      : $this->getUserListById($id, $currentUser);
    if (!$list) return null;
    $this->entityManager->remove($list);
    $this->entityManager->flush();
    return true;
  }
}
