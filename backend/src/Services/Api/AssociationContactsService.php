<?php

namespace App\Services\Api;

use App\Repository\AssociationContactsRepository;
use App\Entity\AssociationContacts;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Users;
use App\Repository\ExpensesReportsRepository;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class AssociationContactsService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private AssociationContactsRepository $association_contacts_repository,
    private ExpensesReportsRepository $expenses_reports_repository,
    private MailerInterface $mailer,
    private string $mailerFrom
  ) {}

  public function getContacts(): ?array
  {
    $contacts = $this->association_contacts_repository->findAll();
    if (!$contacts) return null;
    return array_map(fn($c) => [
      'id' => $c->getId(),
      'label' => $c->getLabel(),
      'email' => $c->getContactEmail(),
    ], $contacts);
  }

  public function addContact(array $data, Users $currentUser): array|string|null
  {
    if (!in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) return 'Forbidden';
    $existingContacts = $this->association_contacts_repository->findOneBy(['label' => $data['label']]);
    if ($existingContacts) return null;
    if (empty($data['label']) || empty($data['email'])) {
      return 'Missing';
    }
    $contact = new AssociationContacts();
    $contact->setLabel($data['label']);
    $contact->setContactEmail($data['email']);
    $this->entityManager->persist($contact);
    $this->entityManager->flush();
    return [
      'id' => $contact->getId(),
      'label' => $contact->getLabel(),
      'email' => $contact->getContactEmail(),
    ];
  }

  public function setContact(array $data, int $id, Users $currentUser): array|string|null
  {
    if (!in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) return 'Forbidden';
    $contact = $this->association_contacts_repository->find($id);
    if (!$contact) return null;
    if (empty($data['label']) || empty($data['email'])) {
      return 'Missing';
    }
    $contact->setLabel($data['label']);
    $contact->setContactEmail($data['email']);
    $this->entityManager->flush();
    return [
      'id' => $contact->getId(),
      'label' => $contact->getLabel(),
      'email' => $contact->getContactEmail(),
    ];
  }

  public function deleteContact(int $id, Users $currentUser): ?bool
  {
    if (!in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) return 'Forbidden';
    $contact = $this->association_contacts_repository->find($id);
    if (!$contact) return null;
    $this->entityManager->remove($contact);
    $this->entityManager->flush();
    return true;
  }
}
