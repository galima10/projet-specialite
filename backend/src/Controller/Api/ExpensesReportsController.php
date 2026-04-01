<?php

namespace App\Controller\Api;

use App\Services\Api\ExpensesReportsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/expenses-reports', name: 'api_expenses_reports')]
final class ExpensesReportsController extends AbstractController
{
  #[Route('', name: 'reports_get', methods: ['GET'])]
  public function reports_get(ExpensesReportsService $expensesReportsService): JsonResponse
  {
    $currentUser = $this->getUser();
    $reports = $expensesReportsService->getReports($currentUser);
    if (!$reports) return $this->json(['error' => 'Reports not found'], 404);
    return $this->json($reports, 200);
  }

  #[Route('/{id}', name: 'report_get', requirements: ['id' => '\d+'], methods: ['GET'])]
  public function report_get(ExpensesReportsService $expensesReportsService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $report = $expensesReportsService->getReport($id, $currentUser);
    if (!$report) return $this->json(['error' => 'Report not found'], 404);
    return $this->json($report, 200);
  }

  #[Route('', name: 'report_create', methods: ['POST'])]
  public function report_create(Request $request, ExpensesReportsService $expensesReportsService): JsonResponse
  {
    $currentUser = $this->getUser();
    $data = json_decode($request->getContent(), true);
    $report = $expensesReportsService->addReport($data, $currentUser);
    if (!$report) return $this->json(['error' => 'Report already exists'], 409);
    if ($report === 'Forbidden') return $this->json(['error' => 'Create forbidden'], 403);
    if ($report === 'Missing') return $this->json(['error' => 'Bad request: missing fields'], 400);
    return $this->json($report, 201);
  }

  #[Route('/{id}', name: 'report_update', requirements: ['id' => '\d+'], methods: ['PUT'])]
  public function report_update(Request $request, ExpensesReportsService $expensesReportsService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $data = json_decode($request->getContent(), true);
    $report = $expensesReportsService->setReport($data, $id, $currentUser);
    if (!$report) return $this->json(['error' => 'Report not found']);
    if ($report === 'Missing') return $this->json(['error' => 'Bad request: missing fields'], 400);
    return $this->json($report, 200);
  }

  #[Route('/{id}', name: 'report_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
  public function report_delete(ExpensesReportsService $expensesReportsService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $deleted = $expensesReportsService->deleteReport($id, $currentUser);
    if (!$deleted) return $this->json(['error' => 'Report not found'], 404);
    return $this->json(null, 204);
  }
}
