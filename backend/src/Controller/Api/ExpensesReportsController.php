<?php

namespace App\Controller\Api;

use App\Services\Api\ExpensesReportsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Services\Api\InfosRequestsService;
use App\Services\Api\ExpensesDocumentsService;
use App\Services\Api\ExpensesListsService;

#[Route('/api/expenses-reports', name: 'api_expenses_reports')]
final class ExpensesReportsController extends AbstractController
{
  #[Route('', name: 'reports_get', methods: ['GET'])]
  public function reports_get(ExpensesReportsService $expensesReportsService, InfosRequestsService $infosRequestsService, ExpensesDocumentsService $expensesDocumentsService, ExpensesListsService $expensesListsService): JsonResponse
  {
    $currentUser = $this->getUser();
    $requests = $infosRequestsService->getRequests($currentUser);
    if (!$requests) return $this->json(['error' => 'Requests not found'], 404);
    if ($requests === 'Forbidden') return $this->json(['error' => 'Get forbidden'], 403);
    $lists = $expensesListsService->getLists($currentUser);
    if (!$lists) return $this->json(['error' => 'Lists not found'], 404);
    $documents = $expensesDocumentsService->getDocuments($currentUser);
    if (!$documents) return $this->json(['error' => 'Documents not found'], 404);
    $reportsFiles = $expensesReportsService->getReports($currentUser);
    if (!$reportsFiles) return $this->json(['error' => 'Reports files not found'], 404);
    $userReports = $expensesReportsService->getUserReports($requests, $lists, $documents, $reportsFiles);

    if (!$userReports) return $this->json(['error' => 'Reports not found'], 404);
    return $this->json($userReports, 200);
  }


  #[Route('', name: 'report_create', methods: ['POST'])]
  public function report_create(
    Request $request,
    ExpensesReportsService $expensesReportsService,
    InfosRequestsService $infosRequestsService,
    ExpensesListsService $expensesListsService,
    ExpensesDocumentsService $expensesDocumentsService
  ): JsonResponse {
    $currentUser = $this->getUser();

    $rawRequest = [
      'createdAt' => $request->request->get('createdAt'),
      'reason' => $request->request->get('reason'),
      'budget' => $request->request->get('budget'),
      'amountWaiver' => $request->request->get('amountWaiver'),
      'waiverMileageRateId' => $request->request->get('waiverMileageRateId'),
      'kmMileageRateId' => $request->request->get('kmMileageRateId'),
    ];

    $infosRequest = $infosRequestsService->addRequest($rawRequest, $currentUser);

    if (!$infosRequest) return $this->json(['error' => 'Rate not found']);
    if ($infosRequest === 'Forbidden') return $this->json(['error' => 'Update forbidden'], 403);
    if ($infosRequest === 'Missing') return $this->json(['error' => 'Bad request for Infos Request: missing fields'], 400);

    // FILE principal
    $reportFile = $request->files->get('reportDocumentFile');

    $rawReportFile = [
      'file' => $reportFile,
      'infosRequestId' => $infosRequest['id'],
    ];

    $report = $expensesReportsService->addReport($rawReportFile, $currentUser);

    if ($report === 'Forbidden') return $this->json(['error' => 'Create forbidden'], 403);
    if ($report === 'Missing') return $this->json(['error' => 'Bad request for Report File: missing fields'], 400);
    if ($report === 'Missing or invalid file') return $this->json(['error' => 'Missing file'], 400);
    if (!$report) return $this->json(['error' => 'Report already exists'], 409);

    $infosRequest['reportDocumentFile'] = $report;
    $infosRequest['expensesList'] = [];

    $expensesList = $request->request->all('expensesList');

    foreach ($expensesList as $i => $rawList) {

      $treatedList = [
        'date' => $rawList['date'],
        'object' => $rawList['object'],
        'km' => $rawList['km'],
        'transportCost' => $rawList['transportCost'],
        'othersCost' => $rawList['othersCost'],
        'infosRequestId' => $infosRequest['id'],
      ];

      $list = $expensesListsService->addList($treatedList, $currentUser);

      if (!$list) return $this->json(['error' => 'List already exists'], 403);
      if ($list === 'Forbidden') return $this->json(['error' => 'Create forbidden'], 403);
      if ($list === 'Missing') return $this->json(['error' => 'Bad request for Expenses List: missing fields'], 400);

      $list['documents'] = [];

      // récupérer fichiers documents
      $documentsFiles = $request->files->get("expensesList")[$i]['documents'] ?? [];

      foreach ($documentsFiles as $file) {

        $treatedDocument = [
          'file' => $file,
          'expensesListId' => $list['id']
        ];

        $document = $expensesDocumentsService->addDocument($treatedDocument, $currentUser);

        if ($document === 'Missing or invalid file') return $this->json(['error' => 'Missing or invalid file'], 400);
        if ($document === 'Forbidden') return $this->json(['error' => 'Create forbidden'], 403);
        if ($document === 'Missing') return $this->json(['error' => 'Bad request for Expenses Documents: missing fields'], 400);
        if (!$document) return $this->json(['error' => 'Document already exists'], 409);

        $list['documents'][] = $document;
      }

      $infosRequest['expensesList'][] = $list;
    }

    return $this->json($infosRequest, 201);
  }

  #[Route('/{id}', name: 'request_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
  public function request_delete(InfosRequestsService $infosRequestsService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $deleted = $infosRequestsService->deleteRequest($id, $currentUser);
    if ($deleted === 'Forbidden') return $this->json(['error' => 'Delete forbidden'], 403);
    if (!$deleted) return $this->json(['error' => 'Rate not found'], 404);
    return $this->json(null, 204);
  }
}
