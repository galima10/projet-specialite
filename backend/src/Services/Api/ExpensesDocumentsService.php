<?php

namespace App\Services\Api;

use App\Repository\ExpensesDocumentsRepository;
use App\Repository\ExpensesListsRepository;
use App\Entity\ExpensesDocuments;
use Doctrine\ORM\EntityManagerInterface;

class ExpensesDocumentsService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private ExpensesDocumentsRepository $expenses_documents_repository,
    private ExpensesListsRepository $expenses_lists_repository
  ) {}

  public function getDocuments()
  {
    $documents = $this->expenses_documents_repository->findAll();
    if (!$documents) return;
    $documentsData = array_map(fn($d) => [
      'id' => $d->getId(),
      'name' => $d->getName(),
      'pathFile' => $d->getPathFile(),
      'expensesListId' => $d->getExpensesList()->getId(),
    ], $documents);
    return $documentsData;
  }

  public function getDocument(int $id)
  {
    $document = $this->expenses_documents_repository->find($id);
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

  public function setDocument($data, int $id)
  {
    $document = $this->expenses_documents_repository->find($id);
    if (!$document) return;
    $document->setName($data['name']);
    $document->setPathFile($data['pathFile']);
    $expensesList = $this->expenses_lists_repository->find($data['expensesListId']);
    if (!$expensesList) return;
    $document->setExpensesList($expensesList);
    $this->entityManager->flush();
    return $document;
  }

  public function deleteDocument(int $id)
  {
    $document = $this->expenses_documents_repository->find($id);
    if (!$document) return;
    $this->entityManager->remove($document);
    $this->entityManager->flush();

    return true;
  }
}
