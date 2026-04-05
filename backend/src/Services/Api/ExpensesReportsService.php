<?php

namespace App\Services\Api;

use App\Repository\ExpensesReportsRepository;
use App\Entity\ExpensesReports;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Users;
use App\Repository\UsersRepository;

class ExpensesReportsService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private ExpensesReportsRepository $expenses_reports_repository,
    private UsersRepository $users_repository,
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
    $reports = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_reports_repository->findAll()
      : $this->expenses_reports_repository->findBy(['user' => $currentUser]);

    if (!$reports) return null;

    $userReports = [];

    foreach ($reports as $report) {
      $userId = $report->getUserId();
      if (!$userId) return null;

      if (!isset($userReports[$userId])) {
        $userReports[$userId] = [
          'userId' => $userId,
          'reports' => []
        ];
      }

      $userReports[$userId]['reports'][] = [
        'id' => $report->getId(),
        'createdAt' => $report->getCreatedAt(),
        'reason' => $report->getReason(),
        'name' => $report->getName(),
        'pathFile' => $report->getPathFile(),
      ];
    }
    return array_values($userReports);
  }

  public function addReport(array $data, Users $currentUser): array|string|null
  {
    if (!$data['file'] || !$data['userId'] || !$data['reason']) return 'Missing';
    if (
      !in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      && $currentUser->getId() !== (int) $data['userId']
    ) {
      return 'Forbidden';
    }

    if (in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER']))
      $user = $this->users_repository->find($data['userId']);
    else $user = $currentUser;


    /** @var UploadedFile|null $file */
    $file = $data['file'] ?? null;

    if (!$file || !$file->isValid()) return 'Missing or invalid file';

    $name = $file->getClientOriginalName();


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

    $pathFile = '/uploads/reports/' . $fileName;

    $report = new ExpensesReports();
    $report->setCreatedAtValue();
    $report->setReason($data['reason']);
    $report->setName($name);
    $report->setPathFile($pathFile);
    $report->setUser($user);

    $this->entityManager->persist($report);
    $this->entityManager->flush();

    return [
      'id' => $report->getId(),
      'createdAt' => $report->getCreatedAt(),
      'reason' => $report->getReason(),
      'name' => $report->getName(),
      'pathFile' => $report->getPathFile(),
    ];
  }

  public function deleteReport(int $id, Users $currentUser): bool|string|null
  {
    $report = $this->expenses_reports_repository->find($id);
    if (!$report) return null;
    if (!in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER']) && $currentUser->getId() !== $report->getUserId()) return 'Forbidden';
    $this->entityManager->remove($report);
    $this->entityManager->flush();
    return true;
  }
}
