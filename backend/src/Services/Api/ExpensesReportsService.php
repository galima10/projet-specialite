<?php

namespace App\Services\Api;

use App\Repository\ExpensesReportsRepository;
use App\Entity\ExpensesReports;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\InfosRequestsRepository;
use App\Entity\Users;
use App\Entity\InfosRequests;
use App\Entity\ExpensesDocuments;
use App\Entity\ExpensesLists;

class ExpensesReportsService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private ExpensesReportsRepository $expenses_reports_repository,
    private InfosRequestsRepository $infos_requests_repository,
  ) {}

  public function getUserReports(array $requests, array $lists, array $documents, array $reportsFiles)
  {
    if (empty($requests) || empty($lists) || empty($documents) || empty($reportsFiles)) return null;
    $reports = [];
    foreach ($requests as $request) {
      $filteredReports = array_filter($reportsFiles, function (array $reportFile) use ($request) {
        return $reportFile['infosRequestId'] === $request['id'];
      });
      $filteredJsonReport = reset($filteredReports);
      $reportDocumentFile = [
        'id' => $filteredJsonReport['id'],
        'name' => $filteredJsonReport['name'],
        'pathFile' => $filteredJsonReport['pathFile'],
      ];
      $expensesLists = array_map(function (array $list) use ($documents) {
        $filteredExpensesDocuments = array_filter($documents, function ($expensesDocument) use ($list) {
          return $expensesDocument['expensesListId'] === $list['id'];
        });
        $expensesDocuments = array_map(fn($d) => [
          'id' => $d['id'],
          'name' => $d['name'],
          'pathFile' => $d['pathFile'],
        ], $filteredExpensesDocuments);
        $expensesDocuments = array_values($expensesDocuments);
        return [
          'id' => $list['id'],
          'date' => $list['date'],
          'object' => $list['object'],
          'km' => $list['km'],
          'transportCost' => $list['transportCost'],
          'othersCost' => $list['othersCost'],
          'documents' => $expensesDocuments
        ];
      }, array_filter($lists, function (array $list) use ($request) {
        return $list['infosRequestId'] === $request['id'];
      }));
      $expensesLists = array_values($expensesLists);
      $existingIndex = null;
      foreach ($reports as $i => $r) {
        if ($r['userId'] === $request['userId']) {
          $existingIndex = $i;
          break;
        }
      }
      if ($existingIndex !== null) {
        $reports[$existingIndex]['reports'][] = [
          'id' => $request['id'],
          'createdAt' => $request['createdAt'],
          'reason' => $request['reason'],
          'budget' => $request['budget'],
          'amountWaiver' => $request['amountWaiver'],
          'waiverMileageRateId' => $request['waiverMileageRateId'],
          'kmMileageRateId' => $request['kmMileageRateId'],
          'reportDocumentFile' => $reportDocumentFile,
          'expensesList' => $expensesLists,
        ];
      } else {
        $reports[] = [
          'userId' => $request['userId'],
          'reports' => [
            [
              'id' => $request['id'],
              'createdAt' => $request['createdAt'],
              'reason' => $request['reason'],
              'budget' => $request['budget'],
              'amountWaiver' => $request['amountWaiver'],
              'waiverMileageRateId' => $request['waiverMileageRateId'],
              'kmMileageRateId' => $request['kmMileageRateId'],
              'reportDocumentFile' => $reportDocumentFile,
              'expensesList' => $expensesLists,
            ]
          ]
        ];
      }
    }
    return $reports;
  }



  public function getReports(Users $currentUser): ?array
  {
    if (in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) {
      $reports = $this->expenses_reports_repository->findAll();
    } else {
      $infosRequests = $this->infos_requests_repository->findBy(['user' => $currentUser]);
      if (!$infosRequests) return null;
      $reports = [];
      foreach ($infosRequests as $request) {
        $reports = array_merge($reports, $request->getExpensesReports()->toArray());
      }
      $reports = array_unique($reports, SORT_REGULAR);
    }
    if (!$reports) return null;
    return array_map(fn($r) => [
      'id' => $r->getId(),
      'name' => $r->getName(),
      'pathFile' => $r->getPathFile(),
      'infosRequestId' => $r->getInfosRequestId(),
    ], $reports);
  }

  public function addReport(array $data, Users $currentUser): array|string|null
  {

    /** @var UploadedFile|null $file */
    $file = $data['file'] ?? null;

    if (!$file || !$file->isValid()) return 'Missing or invalid file';

    $infosRequestId = $data['infosRequestId'] ?? null;

    if (!$infosRequestId) return 'Missing';

    $name = $data['name'] ?? $file->getClientOriginalName();

    $infosRequest = $this->infos_requests_repository->find($infosRequestId);
    if (!$infosRequest) return null;

    if (
      !in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER']) &&
      $infosRequest->getUser()->getId() !== $currentUser->getId()
    ) {
      return 'Forbidden';
    }

    $uploadDir = dirname(__DIR__, 3) . '/public/uploads/reports/';
    if (!is_dir($uploadDir)) {
      mkdir($uploadDir, 0755, true);
    }

    $fileName = uniqid() . '_' . $file->getClientOriginalName();

    try {
      $file->move($uploadDir, $fileName);
    } catch (\Exception $e) {
      return 'Upload failed';
    }

    // Chemin public
    $pathFile = '/uploads/reports/' . $fileName;

    $report = new ExpensesReports();
    $report->setName($name);
    $report->setPathFile($pathFile);
    $report->setInfosRequest($infosRequest);

    $this->entityManager->persist($report);
    $this->entityManager->flush();

    return [
      'id' => $report->getId(),
      'name' => $report->getName(),
      'pathFile' => $report->getPathFile(),
    ];
  }

  public function deleteReport(int $id, Users $currentUser): bool|string|null
  {
    $request = $this->infos_requests_repository->find($id);
    if (!$request) return null;
    if (!in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER']) && $currentUser->getId() !== $request->getUserId()) return 'Forbidden';
    $this->entityManager->remove($request);
    $this->entityManager->flush();
    return true;
  }
}
