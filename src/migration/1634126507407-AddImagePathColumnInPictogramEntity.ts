import {MigrationInterface, QueryRunner} from "typeorm";

export class AddImagePathColumnInPictogramEntity1634126507407 implements MigrationInterface {
    name = 'AddImagePathColumnInPictogramEntity1634126507407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pictogram" ADD "imagePath" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pictogram" DROP COLUMN "imagePath"`);
    }

}
