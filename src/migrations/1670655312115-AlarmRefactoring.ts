import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlarmRefactoring1670655312115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "alarm" RENAME COLUMN "deleteAT" TO "deleteAt"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
