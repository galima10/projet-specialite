<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        $chloe = new User();
        $chloe->setName('Chloé');
        $chloe->setEmail('chloe.sandrin@my-digital-school.org');
        $manager->persist($chloe);

        $manager->flush();
    }
}
