<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/km-mileage-rates', name: 'api_km_mileage_rates')]
final class KmMileageRatesController extends AbstractController {}
