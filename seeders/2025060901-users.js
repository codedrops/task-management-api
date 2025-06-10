export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('Users', [
    {
      keycloakId: 'keycloak-user-1',
      email: 'user1@example.com',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      keycloakId: 'keycloak-admin-1',
      email: 'admin1@example.com',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Users', null, {});
}