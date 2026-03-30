<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260330135004 extends AbstractMigration
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
        $this->addSql('CREATE TABLE infos_requests (id INT AUTO_INCREMENT NOT NULL, created_at DATETIME NOT NULL, reason LONGTEXT NOT NULL, budget VARCHAR(255) NOT NULL, amount_waiver NUMERIC(7, 2) NOT NULL, user_id INT NOT NULL, waiver_mileage_rate_id INT DEFAULT NULL, km_mileage_rate_id INT DEFAULT NULL, INDEX IDX_AD54CD52A76ED395 (user_id), INDEX IDX_AD54CD52BCE07C69 (waiver_mileage_rate_id), INDEX IDX_AD54CD52FB8A239B (km_mileage_rate_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE km_mileage_rates (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(191) NOT NULL, amout_per_km NUMERIC(7, 3) NOT NULL, UNIQUE INDEX UNIQ_E63C3B9DEA750E8 (label), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(191) NOT NULL, email VARCHAR(255) DEFAULT NULL, role VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_1483A5E95E237E06 (name), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE waiver_mileage_rates (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(191) NOT NULL, amount_per_km NUMERIC(7, 3) NOT NULL, UNIQUE INDEX UNIQ_7B9A0F35EA750E8 (label), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750 (queue_name, available_at, delivered_at, id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
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
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52A76ED395');
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52BCE07C69');
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52FB8A239B');
        $this->addSql('DROP TABLE expenses_documents');
        $this->addSql('DROP TABLE expenses_lists');
        $this->addSql('DROP TABLE infos_requests');
        $this->addSql('DROP TABLE km_mileage_rates');
        $this->addSql('DROP TABLE users');
        $this->addSql('DROP TABLE waiver_mileage_rates');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
