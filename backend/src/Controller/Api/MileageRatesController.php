<?php

namespace App\Controller\Api;

use App\Services\Api\KmMileageRatesService;
use App\Services\Api\WaiverMileageRatesService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/mileage-rates', name: 'api_mileage_rates')]
final class MileageRatesController extends AbstractController
{
  #[Route('', name: 'rates_get', methods: ['GET'])]
  public function rates_get(KmMileageRatesService $kmMileageRatesService, WaiverMileageRatesService $waiverMileageRatesService): JsonResponse
  {
    $kmRates = $kmMileageRatesService->getRates();
    $wvRates = $waiverMileageRatesService->getRates();
    if (!$kmRates && !$wvRates) return $this->json(['error' => 'Rates not found'], 404);
    if (!$wvRates) $wvRates = [];
    if (!$kmRates) $kmRates = [];
    $rates = [
      'kmMileageRates' => $kmRates,
      'waiverMileageRates' => $wvRates
    ];
    return $this->json($rates, 200);
  }

  #[Route('/{type}', name: 'rate_create', requirements: ['type' => 'waiver|km'], methods: ['POST'])]
  public function rate_create(Request $request, KmMileageRatesService $kmMileageRatesService, string $type, WaiverMileageRatesService $waiverMileageRatesService): JsonResponse
  {
    $currentUser = $this->getUser();
    if ($type === "km") {
      $data = json_decode($request->getContent(), true);
      $rate = $kmMileageRatesService->addRate($data, $currentUser);
      if (!$rate) return $this->json(['error' => 'Rate already exists'], 409);
      if ($rate === 'Forbidden') return $this->json(['error' => 'Create forbidden'], 403);
      if ($rate === 'Missing') return $this->json(['error' => 'Bad request: missing fields'], 400);
      return $this->json($rate, 201);
    } else {
      $data = json_decode($request->getContent(), true);
      $rate = $waiverMileageRatesService->addRate($data, $currentUser);
      if (!$rate) return $this->json(['error' => 'Rate already exists'], 409);
      if ($rate === 'Forbidden') return $this->json(['error' => 'Create forbidden'], 403);
      if ($rate === 'Missing') return $this->json(['error' => 'Bad request: missing fields'], 400);
      return $this->json($rate, 201);
    }
  }

  #[Route('/{type}/{id}', name: 'rate_delete', requirements: ['id' => '\d+', 'type' => 'waiver|km'], methods: ['DELETE'])]
  public function rate_delete(KmMileageRatesService $kmMileageRatesService, int $id, string $type, WaiverMileageRatesService $waiverMileageRatesService): JsonResponse
  {
    $currentUser = $this->getUser();
    if ($type === "km") {
      $deleted = $kmMileageRatesService->deleteRate($id, $currentUser);
      if (!$deleted) return $this->json(['error' => 'Rate not found'], 404);
      if ($deleted === 'Forbidden') return $this->json(['error' => 'Delete forbidden'], 403);
      return $this->json(null, 204);
    } else {
      $deleted = $waiverMileageRatesService->deleteRate($id, $currentUser);
      if (!$deleted) return $this->json(['error' => 'Rate not found'], 404);
      if ($deleted === 'Forbidden') return $this->json(['error' => 'Delete forbidden'], 403);
      return $this->json(null, 204);
    }
  }
}
