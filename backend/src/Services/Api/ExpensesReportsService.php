<?php

namespace App\Services\Api;

use App\Repository\ExpensesReportsRepository;
use App\Entity\ExpensesReports;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\InfosRequestsRepository;
use App\Entity\Users;

class ExpensesReportsService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private ExpensesReportsRepository $expenses_reports_repository,
    private InfosRequestsRepository $infos_requests_repository,
  ) {}

  private function getUserReportsById(int $id, Users $user): ?ExpensesReports
  {
    $infosRequests = $this->infos_requests_repository->findBy(['user' => $user]);
    foreach ($infosRequests as $request) {
      foreach ($request->getExpensesReports() as $report) {
        if ($report->getId() === $id) {
          return $report;
        }
      }
    }
    return null;
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

  public function getReport(int $id, Users $currentUser): ?array
  {
    $report = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_reports_repository->find($id)
      : $this->getUserReportsById($id, $currentUser);
    if (!$report) return null;
    return [
      'id' => $report->getId(),
      'name' => $report->getName(),
      'pathFile' => $report->getPathFile(),
      'infosRequestId' => $report->getInfosRequestId(),
    ];
  }

  public function addReport(array $data, Users $currentUser): array|string|null
  {
    $file = $_FILES['file'] ?? null;
    if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
      return 'Missing or invalid file';
    }

    $infosRequestId = $_POST['infosRequestId'] ?? null;
    $name = $_POST['name'] ?? null;

    if (!$infosRequestId || !$name) {
      return 'Missing';
    }

    $infosRequest = $this->infos_requests_repository->find($infosRequestId);
    if (!$infosRequest) return null;

    // Vérification droits
    if (
      !in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER']) &&
      $infosRequest->getUser()->getId() !== $currentUser->getId()
    ) {
      return 'Forbidden';
    }

    // Upload
    $uploadDir = dirname(__DIR__, 3) . '/public/uploads/reports/';
    if (!is_dir($uploadDir)) {
      mkdir($uploadDir, 0755, true);
    }

    $fileName = uniqid() . '_' . basename($file['name']);
    $destination = $uploadDir . $fileName;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
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
      'infosRequestId' => $infosRequest->getId(),
    ];
  }

  public function setReport(array $data, int $id, Users $currentUser): array|string|null
  {
    $report = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_reports_repository->find($id)
      : $this->getUserReportsById($id, $currentUser);
    if (!$report) return null;
    if (empty($data['name']) || empty($data['pathFile']) || empty($data['infosRequestId'])) {
      return 'Missing';
    }
    $report->setName($data['name']);
    $report->setPathFile($data['pathFile']);
    $infosRequest = $this->infos_requests_repository->find($data['infosRequestId']);
    if (!$infosRequest) return null;
    if (
      !in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      && $infosRequest->getUser()->getId() !== $currentUser->getId()
    ) {
      return 'Forbidden';
    }
    $report->setInfosRequest($infosRequest);
    $this->entityManager->flush();
    return [
      'id' => $report->getId(),
      'name' => $report->getName(),
      'pathFile' => $report->getPathFile(),
      'infosRequestId' => $report->getInfosRequestId(),
    ];
  }

  public function deleteReport(int $id, Users $currentUser): ?bool
  {
    $report = in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])
      ? $this->expenses_reports_repository->find($id)
      : $this->getUserReportsById($id, $currentUser);
    if (!$report) return null;
    $this->entityManager->remove($report);
    $this->entityManager->flush();
    return true;
  }
}
