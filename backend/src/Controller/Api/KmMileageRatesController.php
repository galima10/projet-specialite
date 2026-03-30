<?php

namespace App\Controller\Api;

use App\Services\Api\KmMileageRatesService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/km-mileage-rates', name: 'api_km_mileage_rates')]
final class KmMileageRatesController extends AbstractController
{
  #[Route('/', name: 'rates_get', methods: ['GET'])]
  public function rates_get(KmMileageRatesService $kmMileageRatesService): JsonResponse
  {
    $currentUser = $this->getUser();
    if (!$currentUser) return $this->json(['error' => 'Not connected'], 401);
    $rates = $kmMileageRatesService->getRates();
    if (!$rates) return $this->json(['error' => 'Rates not found'], 404);
    return $this->json($rates, 200);
  }

  #[Route('/{id}', name: 'rate_get', requirements: ['id' => '\d+'], methods: ['GET'])]
  public function rate_get(KmMileageRatesService $kmMileageRatesService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    if (!$currentUser) return $this->json(['error' => 'Not connected'], 401);
    $rate = $kmMileageRatesService->getRate($id);
    if (!$rate) return $this->json(['error' => 'Rate not found'], 404);
    return $this->json($rate, 200);
  }

  #[Route('/', name: 'rate_create', methods: ['POST'])]
  public function rate_create(Request $request, KmMileageRatesService $kmMileageRatesService): JsonResponse
  {
    $currentUser = $this->getUser();
    if (!$currentUser) return $this->json(['error' => 'Not connected'], 401);
    $data = json_decode($request->getContent(), true);
    $rate = $kmMileageRatesService->addRate($data, $currentUser);
    if (!$rate) return $this->json(['error' => 'Rate already exists'], 409);
    if ($rate === 'Forbidden') return $this->json(['error' => 'Create forbidden'], 403);
    return $this->json($rate, 201);
  }

  #[Route('/{id}', name: 'rate_update', requirements: ['id' => '\d+'], methods: ['PUT'])]
  public function rate_update(Request $request, KmMileageRatesService $kmMileageRatesService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    if (!$currentUser) return $this->json(['error' => 'Not connected'], 401);
    $data = json_decode($request->getContent(), true);
    $rate = $kmMileageRatesService->setRate($data, $id, $currentUser);
    if (!$rate) return $this->json(['error' => 'Rate not found']);
    if ($rate === 'Forbidden') return $this->json(['error' => 'Update forbidden'], 403);
    return $this->json($rate, 200);
  }

  #[Route('/{id}', name: 'document_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
  public function document_delete(KmMileageRatesService $kmMileageRatesService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    if (!$currentUser) return $this->json(['error' => 'Not connected'], 401);
    $deleted = $kmMileageRatesService->deleteRate($id, $currentUser);
    if (!$deleted) return $this->json(['error' => 'Rate not found'], 404);
    if ($deleted === 'Forbidden') return $this->json(['error' => 'Delete forbidden'], 403);
    return $this->json(null, 204);
  }
}
