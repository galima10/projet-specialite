<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Services\Api\LoginService;
use App\Entity\Users;

#[Route('/api', name: 'api_login_logout')]
final class LoginController extends AbstractController
{
  #[Route('/login', name: 'api_login', methods: ['POST'])]
  public function login(): JsonResponse
  {
    /** @var Users|null $user */
    $user = $this->getUser();

    if (!$user) return $this->json(['error' => 'Not connected'], 401);

    return $this->json([
      'id' => $user->getId(),
      'name' => $user->getName(),
      'role' => $user->getRole()->value
    ]);
  }

  #[Route('/logout', name: 'api_logout', methods: ['POST'])]
  public function logout(): void
  {
    // Symfony gère tout : invalide la session et déconnecte l'utilisateur
    throw new \LogicException('This method can be blank - it will be intercepted by the logout key on the firewall.');
  }

  #[Route('/register', name: 'api_register', methods: ['POST'])]
  public function register(Request $request, LoginService $loginService): JsonResponse
  {
    $data = json_decode($request->getContent(), true);

    if (!$data || !isset($data['name'], $data['email'], $data['password'], $data['role'])) {
      return $this->json(['error' => 'Missing parameters'], 400);
    }
    $user = $loginService->addUser($data);
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
