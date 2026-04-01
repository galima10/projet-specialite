<?php

namespace App\Services\Api;

use App\Repository\ExpensesDocumentsRepository;
use App\Repository\ExpensesListsRepository;
use App\Entity\ExpensesDocuments;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\InfosRequestsRepository;
use App\Entity\Users;

class ExpensesDocumentsService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private ExpensesDocumentsRepository $expenses_documents_repository,
    private ExpensesListsRepository $expenses_lists_repository,
    private InfosRequestsRepository $infos_requests_repository
  ) {}

  private function getUserDocumentById(int $id, Users $user): ?array
  {
    $infosRequests = $this->infos_requests_repository->findBy(['user' => $user]);
    if (!$infosRequests) return null;
    $lists = [];
    foreach ($infosRequests as $request) {
      $lists = array_merge($lists, $request->getExpensesLists()->toArray());
    }
    $lists = array_unique($lists, SORT_REGULAR);
    if (!$lists) return null;
    $document = $this->expenses_documents_repository->find($id);
    if (!$document) return null;

    return in_array($document->getExpensesList(), $lists, true) ? $document : null;
  }

  public function getDocuments(Users $currentUser): ?array
  {
    if (in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) {
      $documents = $this->expenses_documents_repository->findAll();
    } else {
      $infosRequests = $this->infos_requests_repository->findBy(['user' => $currentUser]);
      if (!$infosRequests) return null;
      $lists = [];
      foreach ($infosRequests as $request) {
        $lists = array_merge($lists, $request->getExpensesLists()->toArray());
      }
      $lists = array_unique($lists, SORT_REGULAR);
      if (!$lists) return null;
      $documents = array_filter(
        $this->expenses_documents_repository->findAll(),
        fn($d) => in_array($d->getExpensesList(), $lists, true)
      );
    }
    if (!$documents) return null;
    return array_map(fn($d) => [
      'id' => $d->getId(),
      'name' => $d->getName(),
      'pathFile' => $d->getPathFile(),
      'expensesListId' => $d->getExpensesList()->getId(),
    ], $documents);
  }

  public function getDocument(int $id, Users $currentUser): ?array
  {
    $document = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_documents_repository->find($id)
      : $this->getUserDocumentById($id, $currentUser);
    if (!$document) return null;
    return [
      'id' => $document->getId(),
      'name' => $document->getName(),
      'pathFile' => $document->getPathFile(),
      'expensesListId' => $document->getExpensesList()->getId(),
    ];
  }

  public function addDocument(array $data, $currentUser): array|string|null
  {
    if (in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) {
      $documents = $this->expenses_documents_repository->findAll();
    } else {
      $infosRequests = $this->infos_requests_repository->findBy(['user' => $currentUser]);
      if (!$infosRequests) return null;
      $documents = [];
      foreach ($infosRequests as $request) {
        $documents = array_merge($documents, $request->getExpensesLists()->toArray());
      }
      $documents = array_unique($documents, SORT_REGULAR);
      if (!$documents) return null;
      $documents = array_filter(
        $this->expenses_documents_repository->findAll(),
        fn($d) => in_array($d->getExpensesList(), $documents, true)
      );
    }
    $existingDocument = array_filter(
      $documents,
      fn($r) => $r->getName() === $data['name']
    );
    if ($existingDocument) return null;
    $document = new ExpensesDocuments();
    $document->setName($data['name']);
    $document->setPathFile($data['pathFile']);
    $expensesList = $this->expenses_lists_repository->find($data['expensesListId']);
    if (!$expensesList) return null;
    if (
      !in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      && $expensesList->getInfosRequest()->getUser()->getId() !== $currentUser->getId()
    ) {
      return 'Forbidden';
    }
    $document->setExpensesList($expensesList);
    $this->entityManager->persist($document);
    $this->entityManager->flush();
    return [
      'id' => $document->getId(),
      'name' => $document->getName(),
      'pathFile' => $document->getPathFile(),
      'expensesListId' => $document->getExpensesListId()
    ];
  }

  public function setDocument(array $data, int $id, Users $currentUser): ?array
  {
    $document = !in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_documents_repository->find($id)
      : $this->getUserDocumentById($id, $currentUser);
    if (!$document) return null;
    $document->setName($data['name']);
    $document->setPathFile($data['pathFile']);
    $expensesList = $this->expenses_lists_repository->find($data['expensesListId']);
    if (!$expensesList) return null;
    $document->setExpensesList($expensesList);
    $this->entityManager->flush();
    return [
      'id' => $document->getId(),
      'name' => $document->getName(),
      'pathFile' => $document->getPathFile(),
      'expensesListId' => $document->getExpensesListId()
    ];
  }

  public function deleteDocument(int $id, Users $currentUser): ?bool
  {
    $document = !in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_documents_repository->find($id)
      : $this->getUserDocumentById($id, $currentUser);
    if (!$document) return null;
    $this->entityManager->remove($document);
    $this->entityManager->flush();
    return true;
  }
}
