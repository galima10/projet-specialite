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
  #[Route('/', name: 'lists_get', methods: ['GET'])]
  public function lists_get(ExpensesListsService $expensesListsService): JsonResponse
  {
    $lists = $expensesListsService->getLists();
    if (!$lists) return $this->json(['error' => 'Lists not found'], 404);
    return $this->json($lists, 200);
  }

  #[Route('/{id}', name: 'list_get', requirements: ['id' => '\d+'], methods: ['GET'])]
  public function list_get(ExpensesListsService $expensesListsService, $id): JsonResponse
  {
    $list = $expensesListsService->getList($id);
    if (!$list) return $this->json(['error' => 'List not found'], 404);
    return $this->json($list, 200);
  }

  #[Route('/', name: 'list_create', methods: ['POST'])]
  public function list_create(Request $request, ExpensesListsService $expensesListsService): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $list = $expensesListsService->addList($data);
    return $this->json($list, 201);
  }

  #[Route('/{id}', name: 'list_update', requirements: ['id' => '\d+'], methods: ['PUT'])]
  public function list_update(Request $request, ExpensesListsService $expensesListsService, $id): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $list = $expensesListsService->setList($data, $id);
    if (!$list) return $this->json(['error' => 'List not found']);
    return $this->json($list, 200);
  }

  #[Route('/{id}', name: 'list_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
  public function list_delete(ExpensesListsService $expensesListsService, $id): JsonResponse
  {
    $deleted = $expensesListsService->deleteList($id);
    if (!$deleted) return $this->json(['error' => 'List not found'], 404);

    return $this->json(null, 204);
  }
}
