<?php

namespace App\Services\Api;

use App\Repository\UsersRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;
use App\Entity\Users;
use Doctrine\ORM\EntityManagerInterface;
use App\Enum\Role;

class LoginService
{
  public function __construct(
    private UsersRepository $usersRepository,
    private UserPasswordHasher $passwordHasher,
    private EntityManagerInterface $entityManager,
  ) {}

  public function addUser($data)
  {
    $user = $this->usersRepository->findOneBy(['email' => $data['email']]);
    if ($user) return;
    $user = new Users();
    $user->setName($data['name']);
    $user->setEmail($data['email']);
    $user->setRole(Role::from('MEMBER'));
    $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
    $user->setPassword($hashedPassword);
    $this->entityManager->persist($user);
    $this->entityManager->flush();

    return $user;
  }
}
