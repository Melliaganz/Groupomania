'use strict';

/**
 * Cree (ou met a jour) un compte administrateur.
 * Les identifiants viennent des variables d'env, jamais du code :
 *   ADMIN_EMAIL, ADMIN_PASSWORD
 * Lancer avec : npm run seed
 */
require('dotenv').config({ quiet: true });
const bcrypt = require('bcrypt');
const cryptoJS = require('crypto-js');

module.exports = {
  up: async (queryInterface) => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        'ADMIN_EMAIL et ADMIN_PASSWORD doivent etre definis dans le .env pour creer l\'admin.'
      );
    }

    const emailHash = cryptoJS.MD5(email).toString();
    const emailEncrypted = cryptoJS.AES.encrypt(email, process.env.EMAIL_SECRET).toString();
    const hash = await bcrypt.hash(password, 10);
    const now = new Date();

    // Ne pas dupliquer si l'admin existe deja
    const [existing] = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE "emailHash" = :emailHash',
      { replacements: { emailHash }, type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (existing) {
      await queryInterface.bulkUpdate('Users', { admin: true, updatedAt: now }, { emailHash });
      return;
    }

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin',
        surname: 'Groupomania',
        email: emailEncrypted,
        emailHash,
        password: hash,
        admin: true,
        login_attempts: 0,
        imageUrl: 'https://freeimghost.net/images/2022/05/25/icon1653051982534.webp',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    const email = process.env.ADMIN_EMAIL;
    if (!email) return;
    const emailHash = cryptoJS.MD5(email).toString();
    await queryInterface.bulkDelete('Users', { emailHash });
  },
};
