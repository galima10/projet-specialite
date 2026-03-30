<?php

namespace App\Services\Api;

use App\Repository\ExpensesListsRepository;
use App\Entity\ExpensesLists;
use Doctrine\ORM\EntityManagerInterface;

class ExpensesListsService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private ExpensesListsRepository $expenses_lists_repository
  ) {}

  public function getLists()
  {
    $lists = $this->expenses_lists_repository->findAll();
    if (!$lists) return;
    $listsData = array_map(fn($l) => [
      'id' => $l->getId(),
      'date' => $l->getExpenseDate(),
      'object' => $l->getExpenseObject(),
      'km' => $l->getKilometers(),
      'transportCost' => $l->getTransportMiscCost(),
      'othersCost' => $l->getOthersCost(),
    ], $lists);
    return $listsData;
  }

  public function getList(int $id)
  {
    $list = $this->expenses_lists_repository->find($id);
    if (!$list) return;
    $listData = [
      'id' => $list->getId(),
      'date' => $list->getExpenseDate(),
      'object' => $list->getExpenseObject(),
      'km' => $list->getKilometers(),
      'transportCost' => $list->getTransportMiscCost(),
      'othersCost' => $list->getOthersCost(),
    ];
    return $listData;
  }

  public function addList($data)
  {
    $list = new ExpensesLists();
    $list->setExpenseDate($data['date']);
    $list->setExpenseObject($data['object']);
    $list->setKilometers($data['km']);
    $list->setTransportMiscCost($data['transportCost']);
    $list->setOthersCost($data['othersCost']);

    $this->entityManager->persist($list);
    $this->entityManager->flush();

    return $list;
  }

  public function setList($data, int $id)
  {
    $list = $this->expenses_lists_repository->find($id);
    if (!$list) return;
    $list->setExpenseDate($data['date']);
    $list->setExpenseObject($data['object']);
    $list->setKilometers($data['km']);
    $list->setTransportMiscCost($data['transportCost']);
    $list->setOthersCost($data['othersCost']);
    $this->entityManager->flush();
    return $list;
  }

  public function deleteList(int $id)
  {
    $list = $this->expenses_lists_repository->find($id);
    if (!$list) return;
    $this->entityManager->remove($list);
    $this->entityManager->flush();

    return true;
  }
}
