<?php

namespace App\Entity;

use App\Entity\Users;
use App\Entity\WaiverMileageRates;
use App\Entity\KmMileageRates;
use App\Enum\Budget;
use App\Repository\InfosRequestsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InfosRequestsRepository::class)]
class InfosRequests
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $reason = null;

    #[ORM\Column(enumType: Budget::class)]
    private ?Budget $budget = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 7, scale: 2)]
    private ?string $amountWaiver = null;

    #[ORM\ManyToOne(targetEntity: Users::class, inversedBy: "infosRequests")]
    #[ORM\JoinColumn(name: "user_id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private ?Users $user = null;

    #[ORM\ManyToOne(targetEntity: WaiverMileageRates::class, inversedBy: "infosRequests")]
    #[ORM\JoinColumn(name: "waiver_mileage_rate_id", referencedColumnName: "id", nullable: true, onDelete: "SET NULL")]
    private ?WaiverMileageRates $waiverMileageRate = null;

    #[ORM\ManyToOne(targetEntity: KmMileageRates::class, inversedBy: "infosRequests")]
    #[ORM\JoinColumn(name: "km_mileage_rate_id", referencedColumnName: "id", nullable: true, onDelete: "SET NULL")]
    private ?KmMileageRates $kmMileageRate = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getReason(): ?string
    {
        return $this->reason;
    }

    public function setReason(string $reason): static
    {
        $this->reason = $reason;

        return $this;
    }

    public function getBudget(): ?Budget
    {
        return $this->budget;
    }

    public function setBudget(Budget $budget): static
    {
        $this->budget = $budget;

        return $this;
    }

    public function getAmountWaiver(): ?string
    {
        return $this->amountWaiver;
    }

    public function setAmountWaiver(string $amountWaiver): static
    {
        $this->amountWaiver = $amountWaiver;

        return $this;
    }

    public function getUser(): ?Users
    {
        return $this->user;
    }

    public function setUser(Users $user): static
    {
        $this->user = $user;
        return $this;
    }
    
    public function getWaiverMileageRate(): ?WaiverMileageRates
    {
        return $this->waiverMileageRate;
    }

    public function setWaiverMileageRate(?WaiverMileageRates $waiverMileageRate): static
    {
        $this->waiverMileageRate = $waiverMileageRate;
        return $this;
    }
    public function getKmMileageRate(): ?KmMileageRates
    {
        return $this->kmMileageRate;
    }

    public function setKmMileageRate(?KmMileageRates $kmMileageRate): static
    {
        $this->kmMileageRate = $kmMileageRate;
        return $this;
    }
}
