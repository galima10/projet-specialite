<?php

namespace App\Entity;

use App\Entity\InfosRequests;
use App\Repository\ExpensesListsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Entity\ExpensesDocuments;

#[ORM\Entity(repositoryClass: ExpensesListsRepository::class)]
class ExpensesLists
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $expenseDate = null;

    #[ORM\Column(length: 255)]
    private ?string $expenseObject = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 7, scale: 2, nullable: true)]
    private ?string $kilometers = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 7, scale: 2, nullable: true)]
    private ?string $transportMiscCost = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 7, scale: 2, nullable: true)]
    private ?string $othersCost = null;

    #[ORM\ManyToOne(targetEntity: InfosRequests::class, inversedBy: "expensesLists")]
    #[ORM\JoinColumn(name: "infos_request_id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private ?InfosRequests $infosRequest = null;

    #[ORM\OneToMany(mappedBy: "expensesDocument", targetEntity: ExpensesDocuments::class)]
    private Collection $expensesDocuments;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getExpenseDate(): ?\DateTimeImmutable
    {
        return $this->expenseDate;
    }

    public function setExpenseDate(\DateTimeImmutable $expenseDate): static
    {
        $this->expenseDate = $expenseDate;

        return $this;
    }

    public function getExpenseObject(): ?string
    {
        return $this->expenseObject;
    }

    public function setExpenseObject(string $expenseObject): static
    {
        $this->expenseObject = $expenseObject;

        return $this;
    }

    public function getKilometers(): ?string
    {
        return $this->kilometers;
    }

    public function setKilometers(?string $kilometers): static
    {
        $this->kilometers = $kilometers;

        return $this;
    }

    public function getTransportMiscCost(): ?string
    {
        return $this->transportMiscCost;
    }

    public function setTransportMiscCost(?string $transportMiscCost): static
    {
        $this->transportMiscCost = $transportMiscCost;

        return $this;
    }

    public function getOthersCost(): ?string
    {
        return $this->othersCost;
    }

    public function setOthersCost(?string $othersCost): static
    {
        $this->othersCost = $othersCost;

        return $this;
    }

    public function getInfosRequest(): ?InfosRequests
    {
        return $this->infosRequest;
    }

    public function setInfosRequest(InfosRequests $infosRequest): static
    {
        $this->infosRequest = $infosRequest;
        return $this;
    }

    public function __construct()
    {
        $this->expensesDocuments = new ArrayCollection();
    }

    public function getExpensesDocuments(): Collection
    {
        return $this->expensesDocuments;
    }
}
