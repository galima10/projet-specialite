<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260331081615 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE expenses_documents ADD CONSTRAINT FK_D3BEF18CEB4244B8 FOREIGN KEY (expenses_list_id) REFERENCES expenses_lists (id) ON DELETE CASCADE');
        $this->addSql('DROP INDEX IDX_4CACF1C4E336F45B ON expenses_lists');
        $this->addSql('ALTER TABLE expenses_lists DROP infos_request_id');
        $this->addSql('ALTER TABLE infos_requests ADD expenses_list_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE infos_requests ADD CONSTRAINT FK_AD54CD52A76ED395 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE infos_requests ADD CONSTRAINT FK_AD54CD52BCE07C69 FOREIGN KEY (waiver_mileage_rate_id) REFERENCES waiver_mileage_rates (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE infos_requests ADD CONSTRAINT FK_AD54CD52FB8A239B FOREIGN KEY (km_mileage_rate_id) REFERENCES km_mileage_rates (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE infos_requests ADD CONSTRAINT FK_AD54CD52EB4244B8 FOREIGN KEY (expenses_list_id) REFERENCES expenses_lists (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_AD54CD52EB4244B8 ON infos_requests (expenses_list_id)');
        $this->addSql('DROP INDEX UNIQ_1483A5E95E237E06 ON users');
        $this->addSql('ALTER TABLE users ADD password VARCHAR(255) NOT NULL, CHANGE name name VARCHAR(255) DEFAULT NULL, CHANGE email email VARCHAR(191) NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9E7927C74 ON users (email)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE expenses_documents DROP FOREIGN KEY FK_D3BEF18CEB4244B8');
        $this->addSql('ALTER TABLE expenses_lists ADD infos_request_id INT NOT NULL');
        $this->addSql('CREATE INDEX IDX_4CACF1C4E336F45B ON expenses_lists (infos_request_id)');
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52A76ED395');
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52BCE07C69');
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52FB8A239B');
        $this->addSql('ALTER TABLE infos_requests DROP FOREIGN KEY FK_AD54CD52EB4244B8');
        $this->addSql('DROP INDEX IDX_AD54CD52EB4244B8 ON infos_requests');
        $this->addSql('ALTER TABLE infos_requests DROP expenses_list_id');
        $this->addSql('DROP INDEX UNIQ_1483A5E9E7927C74 ON users');
        $this->addSql('ALTER TABLE users DROP password, CHANGE name name VARCHAR(191) NOT NULL, CHANGE email email VARCHAR(255) DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E95E237E06 ON users (name)');
    }
}
