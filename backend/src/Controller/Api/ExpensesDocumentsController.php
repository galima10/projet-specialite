<?php

namespace App\Controller\Api;

use App\Services\Api\ExpensesDocumentsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/expenses-documents', name: 'api_expenses_documents')]
final class ExpensesDocumentsController extends AbstractController
{
  #[Route('/', name: 'documents_get', methods: ['GET'])]
  public function documents_get(ExpensesDocumentsService $expensesDocumentsService): JsonResponse
  {
    $documents = $expensesDocumentsService->getDocuments();
    if (!$documents) return $this->json(['error' => 'Documents not found'], 404);
    return $this->json($documents, 200);
  }

  #[Route('/{id}', name: 'document_get', requirements: ['id' => '\d+'], methods: ['GET'])]
  public function document_get(ExpensesDocumentsService $expensesDocumentsService, $id): JsonResponse
  {
    $document = $expensesDocumentsService->getDocument($id);
    if (!$document) return $this->json(['error' => 'Document not found'], 404);
    return $this->json($document, 200);
  }

  #[Route('/', name: 'document_create', methods: ['POST'])]
  public function document_create(Request $request, ExpensesDocumentsService $expensesDocumentsService): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $document = $expensesDocumentsService->addDocument($data);
    return $this->json($document, 201);
  }

  #[Route('/{id}', name: 'document_update', requirements: ['id' => '\d+'], methods: ['PUT'])]
  public function document_update(Request $request, ExpensesDocumentsService $expensesDocumentsService, $id): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $document = $expensesDocumentsService->setDocument($data, $id);
    if (!$document) return $this->json(['error' => 'Document not found']);
    return $this->json($document, 200);
  }

  #[Route('/{id}', name: 'document_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
  public function document_delete(ExpensesDocumentsService $expensesDocumentsService, $id): JsonResponse
  {
    $deleted = $expensesDocumentsService->deleteDocument($id);
    if (!$deleted) return $this->json(['error' => 'Document not found'], 404);

    return $this->json(null, 204);
  }
}
