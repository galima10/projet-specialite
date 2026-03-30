<?php

namespace App\Services\Api;

use App\Repository\UsersRepository;

class UsersService
{
  private UsersRepository $usersRepository;

  public function __construct(UsersRepository $usersRepository)
  {
    $this->usersRepository = $usersRepository;
  }

  public function getUsers()
  {
    $users = $this->usersRepository->findAll();
    $usersData = array_map(fn($u) => [
      'id' => $u->getId(),
      'name' => $u->getName(),
      'email' => $u->getEmail(),
    ], $users);
    return $usersData;
  }
}
