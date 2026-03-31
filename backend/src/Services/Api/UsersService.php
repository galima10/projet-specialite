<?php

namespace App\Services\Api;

use App\Repository\UsersRepository;
use App\Entity\Users;
use App\Enum\Role;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UsersService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private UsersRepository $usersRepository,
    private UserPasswordHasherInterface $passwordHasher
  ) {}

  public function getUsers(Users $currentUser): array|string|null
  {
    if (!in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) return 'Forbidden';
    $users = $this->usersRepository->findAll();
    if (!$users) return null;
    return array_map(fn($u) => [
      'id' => $u->getId(),
      'name' => $u->getName(),
      'email' => $u->getEmail(),
      'role' => $u->getRole()
    ], $users);
  }

  public function getUser(int $id, Users $currentUser): array|string|null
  {
    if (!in_array($currentUser->getRole()->value, ['ROLE_ADMIN', 'ROLE_TREASURER'])) return 'Forbidden';
    $user = $this->usersRepository->find($id);
    if (!$user) return null;
    return [
      'id' => $user->getId(),
      'name' => $user->getName(),
      'email' => $user->getEmail(),
      'role' => $user->getRole()
    ];
  }

  public function addUser(array $data, Users $currentUser): array|string|null
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN') return 'Forbidden';
    $existingUser = $this->usersRepository->findOneBy(['email' => $data['email']]);
    if ($existingUser) return null;
    $user = new Users();
    $user->setName($data['name']);
    $user->setEmail($data['email']);
    $user->setRole(Role::from($data['role']));
    $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
    $user->setPassword($hashedPassword);
    $this->entityManager->persist($user);
    $this->entityManager->flush();
    return [
      'id' => $user->getId(),
      'name' => $user->getName(),
      'email' => $user->getEmail(),
      'role' => $user->getRole()
    ];
  }

  public function setUser(array $data, int $id, Users $currentUser): array|string|null
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN' || $currentUser->getId() !== (int)$id) return 'Forbidden';
    $user = $this->usersRepository->find($id);
    if (!$user) return null;
    $user->setName($data['name']);
    $user->setEmail($data['email']);
    $user->setRole(Role::from($data['role']));
    $this->entityManager->flush();
    return [
      'id' => $user->getId(),
      'name' => $user->getName(),
      'email' => $user->getEmail(),
      'role' => $user->getRole()
    ];
  }

  public function deleteUser(int $id, Users $currentUser): ?bool
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN' || $currentUser->getId() !== (int)$id) return 'Forbidden';
    $user = $this->usersRepository->find($id);
    if (!$user) return null;
    $this->entityManager->remove($user);
    $this->entityManager->flush();
    return true;
  }
}
