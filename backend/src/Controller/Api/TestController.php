<?php

namespace App\Controller\Api;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/test', name: 'app_api_test_')]
final class TestController extends AbstractController
{
    #[Route('/users', name: 'index', methods: ['GET'])]
    public function index(UserRepository $userRepository): JsonResponse
    {
        // Récupérer les utilisateurs depuis la bdd
        $users = $userRepository->findAll();

        // Mapper en objet
        $userData = array_map(fn($u) => [
            'id' => $u->getId(),
            'name' => $u->getName(),
            'email' => $u->getEmail(),
        ], $users);

        // Retourner en réponse json
        return $this->json($userData);
    }
}
