<?php

namespace App\Entity;

use App\Repository\KmMileageRatesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Enum\RateType;

#[ORM\Entity(repositoryClass: KmMileageRatesRepository::class)]
class KmMileageRates
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 191, unique: true)]
    private ?string $label = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 7, scale: 3)]
    private ?string $amountPerKm = null;

    #[ORM\Column(enumType: RateType::class)]
    private ?RateType $type = null;


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

    public function getAmountPerKm(): ?string
    {
        return $this->amountPerKm;
    }

    public function setAmountPerKm(string $amountPerKm): static
    {
        $this->amountPerKm = $amountPerKm;

        return $this;
    }

    public function getType(): ?RateType
    {
        return $this->type;
    }

    public function setType(RateType $type): static
    {
        $this->type = $type;

        return $this;
    }
}
