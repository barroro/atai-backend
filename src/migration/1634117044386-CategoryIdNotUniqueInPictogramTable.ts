import {MigrationInterface, QueryRunner} from "typeorm";

export class CategoryIdNotUniqueInPictogramTable1634117044386 implements MigrationInterface {
    name = 'CategoryIdNotUniqueInPictogramTable1634117044386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pictogram" DROP CONSTRAINT "FK_00b29d4409ada0380e41ca8213c"`);
        await queryRunner.query(`ALTER TABLE "pictogram" ALTER COLUMN "categoryId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pictogram" DROP CONSTRAINT "REL_00b29d4409ada0380e41ca8213"`);
        await queryRunner.query(`ALTER TABLE "pictogram" ADD CONSTRAINT "FK_00b29d4409ada0380e41ca8213c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pictogram" DROP CONSTRAINT "FK_00b29d4409ada0380e41ca8213c"`);
        await queryRunner.query(`ALTER TABLE "pictogram" ADD CONSTRAINT "REL_00b29d4409ada0380e41ca8213" UNIQUE ("categoryId")`);
        await queryRunner.query(`ALTER TABLE "pictogram" ALTER COLUMN "categoryId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pictogram" ADD CONSTRAINT "FK_00b29d4409ada0380e41ca8213c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
