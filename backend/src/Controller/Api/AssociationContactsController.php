<?php

namespace App\Controller\Api;

use App\Services\Api\AssociationContactsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/association-contacts', name: 'api_association_contacts')]
final class AssociationContactsController extends AbstractController
{
  #[Route('', name: 'contacts_get', methods: ['GET'])]
  public function contacts_get(AssociationContactsService $associationContactsService): JsonResponse
  {
    $contacts = $associationContactsService->getContacts();
    if (!$contacts) return $this->json(['error' => 'Contacts not found'], 404);
    return $this->json($contacts, 200);
  }

  #[Route('/{id}', name: 'contact_get', requirements: ['id' => '\d+'], methods: ['GET'])]
  public function contact_get(AssociationContactsService $associationContactsService, $id): JsonResponse
  {
    $contact = $associationContactsService->getContacts($id);
    if (!$contact) return $this->json(['error' => 'Contact not found'], 404);
    return $this->json($contact, 200);
  }

  #[Route('', name: 'contact_create', methods: ['POST'])]
  public function contact_create(Request $request, AssociationContactsService $associationContactsService): JsonResponse
  {
    $currentUser = $this->getUser();
    $data = json_decode($request->getContent(), true);
    $contact = $associationContactsService->addContact($data, $currentUser);
    if (!$contact) return $this->json(['error' => 'Contact already exists'], 409);
    if ($contact === 'Forbidden') return $this->json(['error' => 'Create forbidden'], 403);
    if ($contact === 'Missing') return $this->json(['error' => 'Bad request: missing fields'], 400);
    return $this->json($contact, 201);
  }

  #[Route('/{id}', name: 'contact_update', requirements: ['id' => '\d+'], methods: ['PUT'])]
  public function contact_update(Request $request, AssociationContactsService $associationContactsService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $data = json_decode($request->getContent(), true);
    $contact = $associationContactsService->setContact($data, $id, $currentUser);
    if (!$contact) return $this->json(['error' => 'Contact not found']);
    if ($contact === 'Forbidden') return $this->json(['error' => 'Update forbidden'], 403);
    if ($contact === 'Missing') return $this->json(['error' => 'Bad request: missing fields'], 400);
    return $this->json($contact, 200);
  }

  #[Route('/{id}', name: 'contact_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
  public function contact_delete(AssociationContactsService $associationContactsService, $id): JsonResponse
  {
    $currentUser = $this->getUser();
    $deleted = $associationContactsService->deleteContact($id, $currentUser);
    if (!$deleted) return $this->json(['error' => 'Contact not found'], 404);
    if ($deleted === 'Forbidden') return $this->json(['error' => 'Delete forbidden'], 403);
    return $this->json(null, 204);
  }
}
