<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/expenses-documents', name: 'api_expenses_documents')]
final class ExpensesDocumentsControllerController extends AbstractController {}
