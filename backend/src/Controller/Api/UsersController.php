<?php

namespace App\Controller\Api;

use App\Services\Api\UsersService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/users', name: 'api_users')]
final class UsersController extends AbstractController
{
    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(UsersService $usersService): JsonResponse
    {
        $users = $usersService->getUsers();
        return $this->json($users);
    }
}
