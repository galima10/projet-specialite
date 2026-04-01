<?php

namespace App\Entity;

use App\Repository\WaiverMileageRatesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Entity\InfosRequests;

#[ORM\Entity(repositoryClass: WaiverMileageRatesRepository::class)]
class WaiverMileageRates
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 191, unique: true)]
    private ?string $label = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 7, scale: 3)]
    private ?string $amount_per_km = null;

    #[ORM\OneToMany(mappedBy: "waiverMileageRate", targetEntity: InfosRequests::class, cascade: ["remove"])]
    private Collection $infosRequests;

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
        return $this->amount_per_km;
    }

    public function setAmountPerKm(string $amount_per_km): static
    {
        $this->amount_per_km = $amount_per_km;

        return $this;
    }

    public function __construct()
    {
        $this->infosRequests = new ArrayCollection();
    }

    public function getInfosRequests(): Collection
    {
        return $this->infosRequests;
    }
}
