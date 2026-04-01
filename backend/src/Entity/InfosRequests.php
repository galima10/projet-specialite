<?php

namespace App\Entity;

use App\Entity\Users;
use App\Entity\WaiverMileageRates;
use App\Entity\KmMileageRates;
use App\Enum\Budget;
use App\Repository\InfosRequestsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\ExpensesLists;
use Symfony\Component\Serializer\Attribute\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Entity\ExpensesReports;

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

    #[ORM\OneToMany(mappedBy: "infosRequest", targetEntity: ExpensesLists::class)]
    private Collection $expensesLists;

    #[ORM\OneToMany(mappedBy: "infosRequest", targetEntity: ExpensesReports::class)]
    private Collection $expensesReports;

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        if ($this->createdAt === null) {
            $this->createdAt = new \DateTimeImmutable();
        }
    }

    public function __construct()
    {
        $this->expensesLists = new ArrayCollection();
        $this->expensesReports = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
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

    #[Groups(['documents:read'])]
    public function getUserId(): ?int
    {
        return $this->user->getId();
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

    #[Groups(['documents:read'])]
    public function getWaiverMileageRateId(): ?int
    {
        return $this->waiverMileageRate?->getId();
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

    #[Groups(['documents:read'])]
    public function getKmMileageRateId(): ?int
    {
        return $this->kmMileageRate?->getId();
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

    public function getExpensesLists(): Collection
    {
        return $this->expensesLists;
    
        }
    public function getExpensesReports(): Collection
    {
        return $this->expensesReports;
    }
}
