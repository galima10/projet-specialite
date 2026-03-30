<?php

namespace App\Services\Api;

use App\Repository\UsersRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;

class LoginService
{
  public function __construct(
    private UsersRepository $usersRepository,
    private UserPasswordHasher $passwordHasher
  ) {}

  public function login(string $email, string $plainPassword)
  {
    $user = $this->usersRepository->findOneBy(['email' => $email]);
    if (!$user) return;

    $isValid = $this->passwordHasher->isPasswordValid($user, $plainPassword);

    if (!$isValid) return;

    $userData = [
      'id' => $user->getId(),
      'name' => $user->getName(),
      'role' => $user->getRole()->value
    ];

    return $userData;
  }
}
