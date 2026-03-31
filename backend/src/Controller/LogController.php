<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\Routing\Attribute\Route;

class LogController extends AbstractController
{
  #[Route('/test-log', name: 'test_log', methods: ['GET'])]
  public function testLog(LoggerInterface $logger): JsonResponse
  {
    $logger->debug('Premier test de log security', ['channel' => 'security']);

    return $this->json([
      'status' => 'log envoyé, regarde var/log/dev.security.log'
    ]);
  }

  
}
