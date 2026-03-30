<?php

namespace App\Enum;

enum Role: string
{
  case MEMBER = 'ROLE_MEMBER';
  case TREASURER = 'ROLE_TREASURER';
  case ADMIN = 'ROLE_ADMIN';
}
