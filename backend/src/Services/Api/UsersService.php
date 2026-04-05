<?php

namespace App\Services\Api;

use App\Repository\UsersRepository;
use App\Entity\Users;
use App\Enum\Role;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Bundle\SecurityBundle\Security;

class UsersService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private UsersRepository $usersRepository,
    private UserPasswordHasherInterface $passwordHasher,
    private Security $security
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
    if (empty($data['name']) || empty($data['email']) || empty($data['role']) || empty($data['password'])) {
      return 'Missing';
    }
    $user = new Users();
    $user->setName($data['name']);
    $user->setEmail($data['email']);
    $user->setRole(Role::from($data['role']));
    $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
    $user->setPassword($hashedPassword);
    $this->entityManager->persist($user);
    $this->entityManager->flush();

    if ($currentUser->getId() === $user->getId()) {
      $this->security->login($user);
    }

    return [
      'id' => $user->getId(),
      'name' => $user->getName(),
      'email' => $user->getEmail(),
      'role' => $user->getRole()
    ];
  }

  public function setUser(array $data, int $id, Users $currentUser): array|string|null
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN' && $currentUser->getId() !== (int)$id) return 'Forbidden';
    $user = $this->usersRepository->find($id);
    if (!$user) return null;
    if (empty($data['name']) || empty($data['email']) || empty($data['role']) || empty($data['password'])) {
      return 'Missing';
    }
    $user->setName($data['name']);
    $user->setEmail($data['email']);
    $user->setRole(Role::from($data['role']));
    $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
    $user->setPassword($hashedPassword);
    $this->entityManager->flush();
    return [
      'id' => $user->getId(),
      'name' => $user->getName(),
      'email' => $user->getEmail(),
      'role' => $user->getRole()
    ];
  }

  public function deleteUser(int $id, Users $currentUser): bool|string|null
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN' && $currentUser->getId() !== (int)$id) return 'Forbidden';
    $user = $this->usersRepository->find($id);
    if (!$user) return null;

    $isSelfDelete = $currentUser->getId() === $user->getId();

    $this->entityManager->remove($user);
    $this->entityManager->flush();

    if ($isSelfDelete) {
        $this->security->logout(false);
    }

    return true;
  }

  public function getUsersCount()
  {
    $users = $this->usersRepository->findAll();
    if (!$users) return 0;
    return count($users);
  }
}
