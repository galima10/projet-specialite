<?php

namespace App\Controller\Api;

use App\Services\Api\ExpensesReportsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Users;

#[Route('/api/expenses-reports', name: 'api_expenses_reports')]
final class ExpensesReportsController extends AbstractController
{
  #[Route('', name: 'reports_get', methods: ['GET'])]
  public function reports_get(ExpensesReportsService $expensesReportsService): JsonResponse
  {
    $currentUser = $this->getUser();
    $userReports = $expensesReportsService->getReports($currentUser);

    if (!$userReports) return $this->json(['error' => 'Reports not found'], 404);
    return $this->json($userReports, 200);
  }


  #[Route('', name: 'report_create', methods: ['POST'])]
  public function report_create(
    Request $request,
    ExpensesReportsService $expensesReportsService
  ): JsonResponse {
    /** @var Users|null $currentUser */
    $currentUser = $this->getUser();

    $reportFile = $request->files->get('reportDocumentFile');

    $rawReportFile = [
      'reason' => $request->request->get('reason'),
      'file' => $reportFile,
      'userId' => $request->request->get('userId'),
    ];

    $report = $expensesReportsService->addReport($rawReportFile, $currentUser);

    if (is_string($report)) {
      if ($report === 'Missing') return $this->json(['error' => 'Bad request for Report File: missing fields'], 400);
      if ($report === 'Forbidden') return $this->json(['error' => 'Create forbidden'], 403);
      if ($report === 'Missing or invalid file') return $this->json(['error' => 'Missing file'], 400);
      if ($report === 'Upload failed') return $this->json(['error' => 'Upload failed'], 500);
    }

    return $this->json($report, 201);
  }

  #[Route('/{id}', name: 'request_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
  public function request_delete(ExpensesReportsService $expensesReportsService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $deleted = $expensesReportsService->deleteReport($id, $currentUser);
    if ($deleted === 'Forbidden') return $this->json(['error' => 'Delete forbidden'], 403);
    if (!$deleted) return $this->json(['error' => 'Rate not found'], 404);
    return $this->json(null, 204);
  }
}
