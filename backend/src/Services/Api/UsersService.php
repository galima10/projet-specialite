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

  public function getUsers($currentUser)
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN' || $currentUser->getRole()->value !== 'ROLE_TREASURER') return 'Forbidden';
    $users = $this->usersRepository->findAll();
    if (!$users) return;
    $usersData = array_map(fn($u) => [
      'id' => $u->getId(),
      'name' => $u->getName(),
      'email' => $u->getEmail(),
    ], $users);
    return $usersData;
  }

  public function getUser(int $id, $currentUser)
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN' || $currentUser->getRole()->value !== 'ROLE_TREASURER') return 'Forbidden';
    $user = $this->usersRepository->find($id);
    if (!$user) return;
    $userData = [
      'id' => $user->getId(),
      'name' => $user->getName(),
      'email' => $user->getEmail(),
    ];
    return $userData;
  }

  public function addUser($data, $currentUser)
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN') return 'Forbidden';
    $existingUser = $this->usersRepository->findOneBy(['email' => $data['email']]);
    if ($existingUser) return;
    $user = new Users();
    $user->setName($data['name']);
    $user->setEmail($data['email']);
    $user->setRole(Role::from($data['role']));
    $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
    $user->setPassword($hashedPassword);
    $this->entityManager->persist($user);
    $this->entityManager->flush();

    return $user;
  }

  public function setUser($data, int $id, $currentUser)
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN' && $currentUser->getId() !== (int)$id) return 'Forbidden';
    $user = $this->usersRepository->find($id);
    if (!$user) return;
    $user->setName($data['name']);
    $user->setEmail($data['email']);
    $user->setRole(Role::from($data['role']));
    $this->entityManager->flush();
    return $user;
  }

  public function deleteUser(int $id, $currentUser)
  {
    if ($currentUser->getRole()->value !== 'ROLE_ADMIN' && $currentUser->getId() !== (int)$id) return 'Forbidden';
    $user = $this->usersRepository->find($id);
    if (!$user) return;
    $this->entityManager->remove($user);
    $this->entityManager->flush();

    return true;
  }
}
