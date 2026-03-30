<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260330123232 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE expenses_documents (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) DEFAULT NULL, path_file VARCHAR(255) NOT NULL, expenses_list_id INT NOT NULL, INDEX IDX_D3BEF18CEB4244B8 (expenses_list_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE expenses_lists (id INT AUTO_INCREMENT NOT NULL, expense_date DATE NOT NULL, expense_object VARCHAR(255) NOT NULL, kilometers NUMERIC(7, 2) DEFAULT NULL, transport_misc_cost NUMERIC(7, 2) DEFAULT NULL, others_cost NUMERIC(7, 2) DEFAULT NULL, infos_request_id INT NOT NULL, INDEX IDX_4CACF1C4E336F45B (infos_request_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE expenses_documents ADD CONSTRAINT FK_D3BEF18CEB4244B8 FOREIGN KEY (expenses_list_id) REFERENCES expenses_lists (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE expenses_lists ADD CONSTRAINT FK_4CACF1C4E336F45B FOREIGN KEY (infos_request_id) REFERENCES infos_requests (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE infos_requests ADD CONSTRAINT FK_AD54CD52A76ED395 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE infos_requests ADD CONSTRAINT FK_AD54CD52BCE07C69 FOREIGN KEY (waiver_mileage_rate_id) REFERENCES waiver_mileage_rates (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE infos_requests ADD CONSTRAINT FK_AD54CD52FB8A239B FOREIGN KEY (km_mileage_rate_id) REFERENCES km_mileage_rates (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE expenses_documents DROP FOREIGN KEY FK_D3BEF18CEB4244B8');
        $this->addSql('ALTER TABLE expenses_lists DROP FOREIGN KEY FK_4CACF1C4E336F45B');
        $this->addSql('DROP TABLE expenses_documents');
        $this->addSql('DROP TABLE expenses_lists');
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52A76ED395');
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52BCE07C69');
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52FB8A239B');
    }
}
