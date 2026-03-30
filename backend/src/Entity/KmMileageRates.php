<?php

namespace App\Entity;

use App\Repository\KmMileageRatesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: KmMileageRatesRepository::class)]
class KmMileageRates
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $label = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 7, scale: 3)]
    private ?string $amoutPerKm = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function getAmoutPerKm(): ?string
    {
        return $this->amoutPerKm;
    }

    public function setAmoutPerKm(string $amoutPerKm): static
    {
        $this->amoutPerKm = $amoutPerKm;

        return $this;
    }
}
