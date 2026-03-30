<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Services\Api\LoginService;

final class LoginController extends AbstractController
{
  #[Route('/login', name: 'api_login', methods: ['POST'])]
  public function login(Request $request, LoginService $loginService): JsonResponse
  {
    $data = json_decode($request->getContent(), true);

    $user = $loginService->login($data['email'], $data['password']);

    if (!$user) {
      return $this->json(['error' => 'Invalid credentials'], 401);
    }

    return $this->json($user, 200);
  }
}
