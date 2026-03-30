<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/waiver-mileage-rates', name: 'api_waiver_mileage_rates')]
final class WaiverMileageRatesController extends AbstractController {}
