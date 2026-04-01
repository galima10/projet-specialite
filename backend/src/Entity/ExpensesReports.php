<?php

namespace App\Entity;

use App\Repository\ExpensesReportsRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\InfosRequests;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ExpensesReportsRepository::class)]
class ExpensesReports
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $pathFile = null;

    #[ORM\ManyToOne(targetEntity: InfosRequests::class, inversedBy: "expensesReports")]
    #[ORM\JoinColumn(name: "infos_request_id", referencedColumnName: "id", nullable: true, onDelete: "CASCADE")]
    private ?InfosRequests $infosRequest = null;

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

    #[Groups(['documents:read'])]
    public function getInfosRequestId(): ?int
    {
        return $this->infosRequest?->getId();
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
}
