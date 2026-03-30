<?php

namespace App\Enum;

enum Role: string
{
  case MEMBER = 'MEMBER';
  case TREASURER = 'TREASURER';
  case ADMIN = 'ADMIN';
}
