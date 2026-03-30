<?php

namespace App\Controller\Api;

use App\Services\Api\InfosRequestsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/waiver-mileage-rates', name: 'api_waiver_mileage_rates')]
final class InfosRequestsController extends AbstractController
{
  #[Route('/', name: 'requests_get', methods: ['GET'])]
  public function requests_get(InfosRequestsService $infosRequestsService): JsonResponse
  {
    $currentUser = $this->getUser();
    $requests = $infosRequestsService->getRequests($currentUser);
    if (!$requests) return $this->json(['error' => 'Rates not found'], 404);
    if ($requests === 'Forbidden') return $this->json(['error' => 'Get forbidden'], 403);
    return $this->json($requests, 200);
  }

  #[Route('/{id}', name: 'request_get', requirements: ['id' => '\d+'], methods: ['GET'])]
  public function request_get(InfosRequestsService $infosRequestsService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $request = $infosRequestsService->getRequest($id, $currentUser);
    if (!$request) return $this->json(['error' => 'Rate not found'], 404);
    if ($request === 'Forbidden') return $this->json(['error' => 'Get forbidden'], 403);
    return $this->json($request, 200);
  }

  #[Route('/', name: 'request_create', methods: ['POST'])]
  public function request_create(Request $request, InfosRequestsService $infosRequestsService): JsonResponse
  {
    $currentUser = $this->getUser();
    $data = json_decode($request->getContent(), true);
    $request = $infosRequestsService->addRequest($data, $currentUser);
    if ($request === 'Forbidden') return $this->json(['error' => 'Create forbidden'], 403);
    if (!$request) return $this->json(['error' => 'Request already exists'], 404);
    return $this->json($request, 201);
  }

  #[Route('/{id}', name: 'request_update', requirements: ['id' => '\d+'], methods: ['PUT'])]
  public function request_update(Request $request, InfosRequestsService $infosRequestsService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $data = json_decode($request->getContent(), true);
    $request = $infosRequestsService->setRequest($data, $id, $currentUser);
    if (!$request) return $this->json(['error' => 'Rate not found']);
    if ($request === 'Forbidden') return $this->json(['error' => 'Update forbidden'], 403);
    return $this->json($request, 200);
  }

  #[Route('/{id}', name: 'request_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
  public function request_delete(InfosRequestsService $infosRequestsService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $deleted = $infosRequestsService->deleteRequest($id, $currentUser);
    if (!$deleted) return $this->json(['error' => 'Rate not found'], 404);
    if ($deleted === 'Forbidden') return $this->json(['error' => 'Delete forbidden'], 403);
    return $this->json(null, 204);
  }
}
