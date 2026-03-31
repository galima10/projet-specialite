<?php

namespace App\Services\Api;

use App\Repository\UsersRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\Users;
use Doctrine\ORM\EntityManagerInterface;
use App\Enum\Role;

class LoginService
{
  public function __construct(
    private UsersRepository $usersRepository,
    private UserPasswordHasherInterface $passwordHasher,
    private EntityManagerInterface $entityManager,
  ) {}

  public function registerUser($data)
  {
    $userCount = $this->usersRepository->count([]);
    $user = $this->usersRepository->findOneBy(['email' => $data['email']]);
    if ($user) return;
    $user = new Users();
    $user->setName($data['name']);
    $user->setEmail($data['email']);
    if ($userCount === 0) $user->setRole(Role::from('ROLE_ADMIN'));
    else $user->setRole(Role::from('ROLE_MEMBER'));
    $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
    $user->setPassword($hashedPassword);
    $this->entityManager->persist($user);
    $this->entityManager->flush();

    return $user;
  }
}
