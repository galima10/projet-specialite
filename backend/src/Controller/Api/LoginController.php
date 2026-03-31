<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Services\Api\LoginService;
use App\Entity\Users;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api', name: 'api_login_logout')]
final class LoginController extends AbstractController
{
  #[Route('/me', name: 'api_me', methods: ['GET'])]
  public function me(Request $request): JsonResponse
  {
    $session = $request->getSession();   // <--- ceci démarre la session si elle n'existe pas
    $session->start();
    /** @var Users|null $user */
    $user = $this->getUser();
    return $this->json([
      'id' => $user?->getId(),
      'email' => $user?->getEmail(),
      'role' => $user?->getRole()?->value,
    ]);
  }


  #[Route('/login', name: 'api_login', methods: ['POST'])]
  public function login(): JsonResponse
  {
    // jamais exécuté : intercepté par json_login
    return $this->json(['message' => 'ok']);
  }

  #[Route('/logout', name: 'api_logout', methods: ['POST'])]
  public function logout(): JsonResponse
  {
    // jamais exécuté : intercepté par logout listener
    return $this->json(['message' => 'ok']);
  }

  #[Route('/register', name: 'api_register', methods: ['POST'])]
  public function register(Request $request, LoginService $loginService): JsonResponse
  {
    $data = json_decode($request->getContent(), true);

    if (!$data || !isset($data['name'], $data['email'], $data['password'])) {
      return $this->json(['error' => 'Missing parameters'], 400);
    }
    $user = $loginService->registerUser($data);
    if (!$user) {
      return $this->json(['error' => 'User already exists'], 409);
    }

    return $this->json([
      'id' => $user->getId(),
      'name' => $user->getName(),
      'email' => $user->getEmail(),
      'role' => $user->getRole()->value
    ], 201);
  }
}
