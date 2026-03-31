<?php

namespace App\Controller\Api;

use App\Services\Api\WaiverMileageRatesService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/waiver-mileage-rates', name: 'api_waiver_mileage_rates')]
final class WaiverMileageRatesController extends AbstractController
{
  #[Route('/', name: 'rates_get', methods: ['GET'])]
  public function rates_get(WaiverMileageRatesService $waiverMileageRatesService): JsonResponse
  {
    $rates = $waiverMileageRatesService->getRates();
    if (!$rates) return $this->json(['error' => 'Rates not found'], 404);
    return $this->json($rates, 200);
  }

  #[Route('/{id}', name: 'rate_get', requirements: ['id' => '\d+'], methods: ['GET'])]
  public function rate_get(WaiverMileageRatesService $waiverMileageRatesService, $id): JsonResponse
  {
    $rate = $waiverMileageRatesService->getRate($id);
    if (!$rate) return $this->json(['error' => 'Rate not found'], 404);
    return $this->json($rate, 200);
  }

  #[Route('/', name: 'rate_create', methods: ['POST'])]
  public function rate_create(Request $request, WaiverMileageRatesService $waiverMileageRatesService): JsonResponse
  {
    $currentUser = $this->getUser();
    $data = json_decode($request->getContent(), true);
    $rate = $waiverMileageRatesService->addRate($data, $currentUser);
    if (!$rate) return $this->json(['error' => 'Rate already exists'], 409);
    if ($rate === 'Forbidden') return $this->json(['error' => 'Create forbidden'], 403);
    return $this->json($rate, 201);
  }

  #[Route('/{id}', name: 'rate_update', requirements: ['id' => '\d+'], methods: ['PUT'])]
  public function rate_update(Request $request, WaiverMileageRatesService $waiverMileageRatesService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $data = json_decode($request->getContent(), true);
    $rate = $waiverMileageRatesService->setRate($data, $id, $currentUser);
    if (!$rate) return $this->json(['error' => 'Rate not found']);
    if ($rate === 'Forbidden') return $this->json(['error' => 'Update forbidden'], 403);
    return $this->json($rate, 200);
  }

  #[Route('/{id}', name: 'document_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
  public function document_delete(WaiverMileageRatesService $waiverMileageRatesService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $deleted = $waiverMileageRatesService->deleteRate($id, $currentUser);
    if (!$deleted) return $this->json(['error' => 'Rate not found'], 404);
    if ($deleted === 'Forbidden') return $this->json(['error' => 'Delete forbidden'], 403);
    return $this->json(null, 204);
  }
}
