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
    $file = $_FILES['file'] ?? null;
    if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
      return 'Missing or invalid file';
    }

    $expensesListId = $_POST['expensesListId'] ?? null;
    $name = $_POST['name'] ?? null;

    if (!$expensesListId || !$name) {
      return 'Missing data';
    }

    $expensesList = $this->expenses_lists_repository->find($expensesListId);
    if (!$expensesList) return null;

    // Vérification droits
    if (
      !in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER']) &&
      $expensesList->getInfosRequest()->getUser()->getId() !== $currentUser->getId()
    ) {
      return 'Forbidden';
    }

    // Déplacer le fichier
    $uploadDir = dirname(__DIR__, 3) . '/public/uploads/expenses-documents/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
    $destination = $uploadDir . basename($file['name']);
    move_uploaded_file($file['tmp_name'], $destination);

    

    // Créer l’entité
    $document = new ExpensesDocuments();
    $document->setName($name);
    $publicPath = '/uploads/expenses-documents/' . basename($file['name']);
    $document->setPathFile($publicPath);
    $document->setExpensesList($expensesList);


    $this->entityManager->persist($document);
    $this->entityManager->flush();

    return [
      'id' => $document->getId(),
      'name' => $document->getName(),
      'pathFile' => $publicPath,
      'expensesListId' => $expensesList->getId(),
    ];
  }

  public function setDocument(array $data, int $id, Users $currentUser): array|string|null
  {
    $document = !in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_documents_repository->find($id)
      : $this->getUserDocumentById($id, $currentUser);
    if (!$document) return null;
    if (empty($data['name']) || empty($data['pathFile']) || empty($data['expensesListId'])) {
      return 'Missing';
    }
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
