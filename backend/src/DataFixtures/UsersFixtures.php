<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Users;
use App\Enum\Role;

class UsersFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        $user1 = new Users;
        $user1->setName('Utilisateur 1');
        $user1->setEmail('utilisateur1@gmail.com');
        $user1->setRole(Role::MEMBER);

        $manager->persist($user1);

        $manager->flush();
    }
}
