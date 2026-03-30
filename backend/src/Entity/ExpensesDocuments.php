<?php

namespace App\Entity;

use App\Entity\ExpensesLists;
use App\Repository\ExpensesDocumentsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ExpensesDocumentsRepository::class)]
class ExpensesDocuments
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $pathFile = null;

    #[ORM\ManyToOne(targetEntity: ExpensesLists::class, inversedBy: "expensesDocuments")]
    #[ORM\JoinColumn(name: "expenses_list_id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private ?ExpensesLists $expensesList = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getPathFile(): ?string
    {
        return $this->pathFile;
    }

    public function setPathFile(string $pathFile): static
    {
        $this->pathFile = $pathFile;

        return $this;
    }

    public function getExpensesList(): ?ExpensesLists
    {
        return $this->expensesList;
    }

    public function setExpensesList(ExpensesLists $expensesList): static
    {
        $this->expensesList = $expensesList;
        return $this;
    }
}
