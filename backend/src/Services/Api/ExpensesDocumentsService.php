<?php

namespace App\Services\Api;

use App\Repository\ExpensesDocumentsRepository;
use App\Entity\ExpensesDocuments;
use App\Enum\Role;
use Doctrine\ORM\EntityManagerInterface;

class ExpensesDocumentsService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private ExpensesDocumentsRepository $expenses_documents_repository
  ) {}

  public function getDocuments()
  {
    $documents = $this->expenses_documents_repository->findAll();
    if (!$documents) return;
    $documentsData = array_map(fn($d) => [
      'id' => $d->getId(),
      'name' => $d->getName(),
      'pathFile' => $d->getPathFile(),
    ], $documents);
    return $documentsData;
  }

  public function getDocument(int $id)
  {
    $document = $this->expenses_documents_repository->findOneBy(['id' => $id]);
    if (!$document) return;
    $documentData = [
      'id' => $document->getId(),
      'name' => $document->getName(),
      'pathFile' => $document->getPathFile(),
    ];
    return $documentData;
  }

  public function addDocument($data)
  {
    $document = new ExpensesDocuments();
    $document->setName($data['name']);
    $document->setPathFile($data['pathFile']);

    $this->entityManager->persist($document);
    $this->entityManager->flush();

    return $document;
  }

  public function setDocument($data, int $id)
  {
    $document = $this->expenses_documents_repository->findOneBy(['id' => $id]);
    if (!$document) return;
    $document->setName($data['name']);
    $document->setPathFile($data['pathFile']);
    $this->entityManager->flush();
    return $document;
  }

  public function deleteDocument(int $id)
  {
    $document = $this->expenses_documents_repository->findOneBy(['id' => $id]);
    if (!$document) return;
    $this->entityManager->remove($document);
    $this->entityManager->flush();

    return true;
  }
}
