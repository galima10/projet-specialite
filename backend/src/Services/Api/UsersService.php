<?php

namespace App\Services\Api;

use App\Repository\UsersRepository;
use App\Entity\Users;
use App\Enum\Role;
use Doctrine\ORM\EntityManagerInterface;

class UsersService
{
  public function __construct(
    private EntityManagerInterface $entityManager,
    private UsersRepository $usersRepository
  ) {}

  public function getUsers()
  {
    $users = $this->usersRepository->findAll();
    if (!$users) return;
    $usersData = array_map(fn($u) => [
      'id' => $u->getId(),
      'name' => $u->getName(),
      'email' => $u->getEmail(),
    ], $users);
    return $usersData;
  }

  public function getUser(int $id)
  {
    $user = $this->usersRepository->findOneBy(['id' => $id]);
    if (!$user) return;
    $userData = [
      'id' => $user->getId(),
      'name' => $user->getName(),
      'email' => $user->getEmail(),
    ];
    return $userData;
  }

  public function addUser($data)
  {
    $user = new Users();
    $user->setName($data['name']);
    $user->setEmail($data['email']);
    $user->setRole(Role::from($data['role']));

    $this->entityManager->persist($user);
    $this->entityManager->flush();

    return $user;
  }

  public function setUser($data, int $id)
  {
    $user = $this->usersRepository->findOneBy(['id' => $id]);
    if (!$user) return;
    $user->setName($data['name']);
    $user->setEmail($data['email']);
    $user->setRole(Role::from($data['role']));
    $this->entityManager->flush();
    return $user;
  }

  public function deleteUser(int $id)
  {
    $user = $this->usersRepository->findOneBy(['id' => $id]);
    if (!$user) return;
    $this->entityManager->remove($user);
    $this->entityManager->flush();

    return true;
  }
}
