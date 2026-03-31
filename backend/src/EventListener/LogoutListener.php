<?php
// src/EventListener/LogoutListener.php
namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Event\LogoutEvent;

class LogoutListener
{
    public function onLogout(LogoutEvent $event)
    {
        $response = new JsonResponse([
            'status' => 'ok',
            'message' => 'Logged out successfully'
        ]);

        $event->setResponse($response);
    }
}