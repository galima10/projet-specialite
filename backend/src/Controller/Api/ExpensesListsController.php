<?php

namespace App\Controller\Api;

use App\Services\Api\ExpensesListsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/expenses-lists', name: 'api_expenses_lists')]
final class ExpensesListsController extends AbstractController
{
  #[Route('', name: 'lists_get', methods: ['GET'])]
  public function lists_get(ExpensesListsService $expensesListsService): JsonResponse
  {
    $currentUser = $this->getUser();
    $lists = $expensesListsService->getLists($currentUser);
    if (!$lists) return $this->json(['error' => 'Lists not found'], 404);
    return $this->json($lists, 200);
  }

  #[Route('', name: 'list_create', methods: ['POST'])]
  public function list_create(Request $request, ExpensesListsService $expensesListsService): JsonResponse
  {
    $currentUser = $this->getUser();
    $data = json_decode($request->getContent(), true);
    $list = $expensesListsService->addList($data, $currentUser);
    if (!$list) return $this->json(['error' => 'List already exists'], 403);
    if ($list === 'Forbidden') return $this->json(['error' => 'Create forbidden'], 403);
    if ($list === 'Missing') return $this->json(['error' => 'Bad request: missing fields'], 400);
    return $this->json($list, 201);
  }

  #[Route('/{id}', name: 'list_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
  public function list_delete(ExpensesListsService $expensesListsService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $deleted = $expensesListsService->deleteList($id, $currentUser);
    if (!$deleted) return $this->json(['error' => 'List not found'], 404);
    return $this->json(null, 204);
  }
}
