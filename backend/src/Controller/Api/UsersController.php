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
  #[Route('/', name: 'allUsers', methods: ['GET'])]
  public function allUsers(UsersService $usersService): JsonResponse
  {
    $users = $usersService->getUsers();
    return $this->json($users);
  }

  #[Route('/{id}', name: 'user', requirements: ['id' => '\d+'], methods: ['GET'])]
  public function user(UsersService $usersService, $id): JsonResponse
  {
    $user = $usersService->getUser($id);
    return $this->json($user);
  }

  #[Route('/', name: 'createUser', methods: ['POST'])]
  public function createUser(Request $request, UsersService $usersService): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $user = $usersService->createUser($data);
    return $this->json($user);
  }

}
