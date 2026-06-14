'use strict';

/**
 * lock_until stocke un timestamp (Date.now()) : il doit etre numerique,
 * pas une chaine. On passe la colonne en BIGINT avec un cast explicite
 * pour ne pas perdre les eventuelles valeurs existantes.
 */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(
      'ALTER TABLE "Users" ALTER COLUMN "lock_until" TYPE BIGINT USING NULLIF("lock_until", \'\')::BIGINT'
    );
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query(
      'ALTER TABLE "Users" ALTER COLUMN "lock_until" TYPE VARCHAR(255) USING "lock_until"::VARCHAR'
    );
  },
};
