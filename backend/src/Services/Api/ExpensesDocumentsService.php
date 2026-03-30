<?php

namespace App\Services\Api;

use App\Repository\ExpensesDocumentsRepository;
use App\Repository\ExpensesListsRepository;
use App\Entity\ExpensesDocuments;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\InfosRequestsRepository;

class ExpensesDocumentsService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private ExpensesDocumentsRepository $expenses_documents_repository,
    private ExpensesListsRepository $expenses_lists_repository,
    private InfosRequestsRepository $infos_requests_repository
  ) {}

  private function getUserDocumentById(int $id, $user)
  {
    $infosRequests = $this->infos_requests_repository->findBy(['user' => $user]);
    if (!$infosRequests) return;
    $lists = array_map(fn($r) => $r->getExpensesList(), $infosRequests);
    $lists = array_unique($lists, SORT_REGULAR);
    if (!$lists) return;
    $document = $this->expenses_documents_repository->find($id);
    if (!$document) return;

    return in_array($document->getExpensesList(), $lists, true) ? $document : null;
  }

  public function getDocuments($currentUser)
  {
    if (in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) {
      $documents = $this->expenses_documents_repository->findAll();
    } else {
      $infosRequests = $this->infos_requests_repository->findBy(['user' => $currentUser]);
      if (!$infosRequests) return [];
      $lists = array_map(fn($r) => $r->getExpensesList(), $infosRequests);
      $lists = array_unique($lists, SORT_REGULAR);
      if (!$lists) return;
      $documents = array_filter(
        $this->expenses_documents_repository->findAll(),
        fn($d) => in_array($d->getExpensesList(), $lists, true)
      );
    }
    if (!$documents) return;
    $documentData = array_map(fn($d) => [
      'id' => $d->getId(),
      'name' => $d->getName(),
      'pathFile' => $d->getPathFile(),
      'expensesListId' => $d->getExpensesList()->getId(),
    ], $documents);
    return $documentData;
  }

  public function getDocument(int $id, $currentUser)
  {
    $document = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_documents_repository->find($id)
      : $this->getUserDocumentById($id, $currentUser);
    if (!$document) return;
    $documentData = [
      'id' => $document->getId(),
      'name' => $document->getName(),
      'pathFile' => $document->getPathFile(),
      'expensesListId' => $document->getExpensesList()->getId(),
    ];
    return $documentData;
  }

  public function addDocument($data)
  {
    $document = $this->expenses_documents_repository->findOneBy(['pathFile' => $data['pathFile']]);
    if ($document) return;
    $document = new ExpensesDocuments();
    $document->setName($data['name']);
    $document->setPathFile($data['pathFile']);
    $expensesList = $this->expenses_lists_repository->find($data['expensesListId']);
    if (!$expensesList) return;
    $document->setExpensesList($expensesList);
    $this->entityManager->persist($document);
    $this->entityManager->flush();

    return $document;
  }

  public function setDocument($data, int $id, $currentUser)
  {
    $document = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_documents_repository->find($id)
      : $this->getUserDocumentById($id, $currentUser);
    if (!$document) return;
    $document->setName($data['name']);
    $document->setPathFile($data['pathFile']);
    $expensesList = $this->expenses_lists_repository->find($data['expensesListId']);
    if (!$expensesList) return;
    $document->setExpensesList($expensesList);
    $this->entityManager->flush();
    return $document;
  }

  public function deleteDocument(int $id, $currentUser)
  {
    $document = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_documents_repository->find($id)
      : $this->getUserDocumentById($id, $currentUser);
    if (!$document) return;
    $this->entityManager->remove($document);
    $this->entityManager->flush();

    return true;
  }
}
