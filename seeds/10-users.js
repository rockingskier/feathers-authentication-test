
exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users')
          .insert({
            username: 'test',
            password: '$2a$10$nSxT8/b9QwjTYlIhgkJqBupBUCKTrla2.64CLcuMOlKxTE8yblCte',
          }),
      ]);
    });
};
