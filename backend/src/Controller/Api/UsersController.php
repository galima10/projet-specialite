<?php

namespace App\Controller\Api;

use App\Services\Api\UsersService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/users', name: 'api_users')]
final class UsersController extends AbstractController
{
  #[Route('/', name: 'users_get', methods: ['GET'])]
  public function users_get(UsersService $usersService): JsonResponse
  {
    $users = $usersService->getUsers();
    if (!$users) return $this->json(['error' => 'Users not found'], 404);
    return $this->json($users, 200);
  }

  #[Route('/{id}', name: 'user_get', requirements: ['id' => '\d+'], methods: ['GET'])]
  public function user_get(UsersService $usersService, $id): JsonResponse
  {
    $user = $usersService->getUser($id);
    if (!$user) return $this->json(['error' => 'User not found'], 404);
    return $this->json($user, 200);
  }

  #[Route('/', name: 'user_create', methods: ['POST'])]
  public function user_create(Request $request, UsersService $usersService): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $user = $usersService->addUser($data);
    return $this->json($user, 201);
  }

  #[Route('/{id}', name: 'user_update', requirements: ['id' => '\d+'], methods: ['PUT'])]
  public function user_update(Request $request, UsersService $usersService, $id): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $user = $usersService->setUser($data, $id);
    if (!$user) return $this->json(['error' => 'User not found']);
    return $this->json($user, 200);
  }

  #[Route('/{id}', name: 'user_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
  public function user_delete(UsersService $usersService, $id): JsonResponse
  {
    $deleted = $usersService->deleteUser($id);
    if (!$deleted) return $this->json(['error' => 'User not found'], 404);

    return $this->json(null, 204);
  }
}
