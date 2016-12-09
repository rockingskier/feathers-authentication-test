import { hooks as authenticationLocalHooks } from 'feathers-authentication-local';
import hooks from 'feathers-hooks-common';
import { Service } from 'feathers-knex';

import db from '../db/db.js';


const debug = require('debug')('pints-api:services:users');

const sanitizeOauth = (hook) => {
  // Randomly assigned username
  hook.data.username = `user-${Math.random().toString().slice(2, 9)}`;

  switch (hook.params.oauth.provider) {
    case 'facebook':
      debug('OAuth sanitization: Facebook', hook.data.facebook.profile);
      hook.data.displayName = hook.data.facebook.profile.displayName;
      // No email from Facebook
      // No avatarUrl from Facebook
      delete hook.data.facebook;
      break;
    case 'github':
      debug('OAuth sanitization: Github', hook.data.github.profile);
      hook.data.displayName = hook.data.github.profile.displayName;
      hook.data.email = hook.data.github.profile.emails[0].value;
      hook.data.avatarUrl = hook.data.github.profile.photos[0].value;
      delete hook.data.github;
      break;
    case 'google':
      debug('OAuth sanitization: Google', hook.data.google.profile);
      hook.data.displayName = hook.data.google.profile.displayName;
      hook.data.email = hook.data.google.profile.emails[0].value;
      hook.data.avatarUrl = hook.data.google.profile.photos[0].value;
      delete hook.data.google;
      break;
  }

  return hook;
};

class UsersService extends Service {
  constructor(options) {
    super(options);

    this.before = {
      create: [
        hooks.iff(
          (hook) => !!hook.params.oauth,
          sanitizeOauth
        ),
        hooks.iff(
          (hook) => !hook.params.oauth,
          authenticationLocalHooks.hashPassword()
        ),
      ],
      update: [
        sanitizeOauth,
      ],
      patch: hooks.disable(),
      remove: hooks.disable(),
    };

    this.after = {
      all: [
        hooks.pluck('id', 'displayName', 'avatarUrl'),
      ],
    };
  }
}


export default new UsersService({
  Model: db,
  name: 'users',
});
