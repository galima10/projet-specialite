<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260331140753 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE expenses_documents ADD CONSTRAINT FK_D3BEF18CEB4244B8 FOREIGN KEY (expenses_list_id) REFERENCES expenses_lists (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE infos_requests ADD CONSTRAINT FK_AD54CD52A76ED395 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE infos_requests ADD CONSTRAINT FK_AD54CD52BCE07C69 FOREIGN KEY (waiver_mileage_rate_id) REFERENCES waiver_mileage_rates (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE infos_requests ADD CONSTRAINT FK_AD54CD52FB8A239B FOREIGN KEY (km_mileage_rate_id) REFERENCES km_mileage_rates (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE infos_requests ADD CONSTRAINT FK_AD54CD52EB4244B8 FOREIGN KEY (expenses_list_id) REFERENCES expenses_lists (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE expenses_documents DROP FOREIGN KEY FK_D3BEF18CEB4244B8');
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52A76ED395');
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52BCE07C69');
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52FB8A239B');
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52EB4244B8');
    }
}
