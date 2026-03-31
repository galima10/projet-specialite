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
    $currentUser = $this->getUser();
    
    $users = $usersService->getUsers($currentUser);
    if ($users === 'Forbidden') return $this->json(['error' => 'Get forbidden'], 403);
    if (!$users) return $this->json(['error' => 'Users not found'], 404);
    return $this->json($users, 200);
  }

  #[Route('/{id}', name: 'user_get', requirements: ['id' => '\d+'], methods: ['GET'])]
  public function user_get(UsersService $usersService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $user = $usersService->getUser($id, $currentUser);
    if ($user === 'Forbidden') return $this->json(['error' => 'Get forbidden'], 403);
    if (!$user) return $this->json(['error' => 'User not found'], 404);
    return $this->json($user, 200);
  }

  #[Route('/', name: 'user_create', methods: ['POST'])]
  public function user_create(Request $request, UsersService $usersService): JsonResponse
  {
    $currentUser = $this->getUser();
    
    $data = json_decode($request->getContent(), true);
    $user = $usersService->addUser($data, $currentUser);
    if (!$user) return $this->json(['error' => 'User already exists'], 404);
    if ($user === 'Forbidden') return $this->json(['error' => 'Create forbidden'], 403);
    return $this->json($user, 201);
  }

  #[Route('/{id}', name: 'user_update', requirements: ['id' => '\d+'], methods: ['PUT'])]
  public function user_update(Request $request, UsersService $usersService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    
    $data = json_decode($request->getContent(), true);
    $user = $usersService->setUser($data, $id, $currentUser);
    if (!$user) return $this->json(['error' => 'User not found'], 404);
    if ($user === 'Forbidden') return $this->json(['error' => 'Update forbidden'], 403);
    return $this->json($user, 200);
  }

  #[Route('/{id}', name: 'user_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
  public function user_delete(UsersService $usersService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    
    $deleted = $usersService->deleteUser($id, $currentUser);
    if (!$deleted) return $this->json(['error' => 'User not found'], 404);
    if ($deleted === 'Forbidden') return $this->json(['error' => 'Delete forbidden'], 403);
    return $this->json(null, 204);
  }
}
