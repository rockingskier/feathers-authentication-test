exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments();

    // Create
    table.timestamp('createdAt')
      .defaultTo(knex.fn.now());

    // Update
    table.timestamp('updatedAt');

    // Local authentication
    table.string('username')
      .notNullable()
      .unique();
    table.string('password');

    // OAuth providers
    table.string('facebookId');
    table.string('githubId');
    table.string('googleId');

    // Profile
    table.string('displayName');
    table.string('email');
    table.string('avatarUrl');
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
