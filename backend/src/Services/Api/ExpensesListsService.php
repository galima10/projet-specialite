<?php

namespace App\Services\Api;

use App\Repository\ExpensesListsRepository;
use App\Repository\InfosRequestsRepository;
use App\Entity\ExpensesLists;
use Doctrine\ORM\EntityManagerInterface;

class ExpensesListsService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private ExpensesListsRepository $expenses_lists_repository,
    private InfosRequestsRepository $infos_requests_repository,
  ) {}

  private function getUserListById(int $id, $user): ?ExpensesLists
  {
    $infosRequests = $this->infos_requests_repository->findBy(['user' => $user]);
    if (!$infosRequests) return null;

    $lists = array_map(fn($r) => $r->getExpensesList(), $infosRequests);
    $lists = array_unique($lists, SORT_REGULAR);

    $filtered = array_filter($lists, fn($l) => $l->getId() === $id);
    return $filtered ? array_values($filtered)[0] : null;
  }

  public function getLists($currentUser)
  {
    if (in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) {
      $lists = $this->expenses_lists_repository->findAll();
    } else {
      $infosRequests = $this->infos_requests_repository->findBy(['user' => $currentUser]);
      if (!$infosRequests) return;
      $lists = array_map(fn($r) => $r->getExpensesList(), $infosRequests);
      $lists = array_unique($lists, SORT_REGULAR);
    }
    if (!$lists) return;
    $listsData = array_map(fn($l) => [
      'id' => $l->getId(),
      'date' => $l->getExpenseDateFormatted(),
      'object' => $l->getExpenseObject(),
      'km' => $l->getKilometers(),
      'transportCost' => $l->getTransportMiscCost(),
      'othersCost' => $l->getOthersCost(),
    ], $lists);
    return $listsData;
  }

  public function getList(int $id, $currentUser)
  {
    $list = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_lists_repository->find($id)
      : $this->getUserListById($id, $currentUser);
    if (!$list) return;
    $listData = [
      'id' => $list->getId(),
      'date' => $list->getExpenseDateFormatted(),
      'object' => $list->getExpenseObject(),
      'km' => $list->getKilometers(),
      'transportCost' => $list->getTransportMiscCost(),
      'othersCost' => $list->getOthersCost(),
    ];
    return $listData;
  }

  public function addList($data)
  {
    $existingList = $this->expenses_lists_repository->findOneBy(['expenseObject' => $data['object']]);
    if ($existingList) return;
    $list = new ExpensesLists();
    $expenseDate = new \DateTimeImmutable($data['date']);
    $list->setExpenseDate($expenseDate);
    $list->setExpenseObject($data['object']);
    $list->setKilometers($data['km']);
    $list->setTransportMiscCost($data['transportCost']);
    $list->setOthersCost($data['othersCost']);

    $this->entityManager->persist($list);
    $this->entityManager->flush();

    return $list;
  }

  public function setList($data, int $id, $currentUser)
  {
    $list = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_lists_repository->find($id)
      : $this->getUserListById($id, $currentUser);
    if (!$list) return;
    $expenseDate = new \DateTimeImmutable($data['date']);
    $list->setExpenseDate($expenseDate);
    $list->setExpenseObject($data['object']);
    $list->setKilometers($data['km']);
    $list->setTransportMiscCost($data['transportCost']);
    $list->setOthersCost($data['othersCost']);
    $this->entityManager->flush();
    return $list;
  }

  public function deleteList(int $id, $currentUser)
  {
    $list = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_lists_repository->find($id)
      : $this->getUserListById($id, $currentUser);
    if (!$list) return;
    $this->entityManager->remove($list);
    $this->entityManager->flush();

    return true;
  }
}
