<?php
// src/Security/JsonLoginSuccessHandler.php
namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use App\Entity\Users;

class JsonLoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    public function onAuthenticationSuccess(
        Request $request,
        TokenInterface $token
    ): JsonResponse {

        $session = $request->getSession();
        $session->start();

        /** @var User $user */
        $user = $token->getUser();

        $session->set('user_id', $user->getId());

        return new JsonResponse([
            'status' => 'ok',
            'user' => $user->getUserIdentifier()
        ]);
    }
}
