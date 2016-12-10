import bodyParser from 'body-parser';

import feathers from 'feathers';
import authentication, { hooks as authenticationHooks } from 'feathers-authentication';
import local from 'feathers-authentication-local';
import jwt from 'feathers-authentication-jwt';
import oauth2 from 'feathers-authentication-oauth2';
import errorHandler from 'feathers-errors/handler';
import hooks from 'feathers-hooks';
import rest from 'feathers-rest';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GithubStrategy } from 'passport-github';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import users from './services/users.js';


const app = feathers()
  .configure(rest())
  .configure(hooks());

app.use(bodyParser.urlencoded({ extended: true }))  // For reading JWTokens
  .use('/authentication', bodyParser.json())  // For local login details
  .configure(authentication({
    secret: process.env.AUTH_SECRET,
    successRedirect: '/users',  // This does not work
  }))
  .configure(local({
    usernameField: 'username',
    passwordField: 'password',
  }))
  .configure(jwt());
  
if (process.env.OAUTH__FACEBOOK__ID && process.env.OAUTH__FACEBOOK__SECRET) {
  app.configure(oauth2({
      name: 'facebook',
      Strategy: FacebookStrategy,
      clientID: process.env.OAUTH__FACEBOOK__ID,
      clientSecret: process.env.OAUTH__FACEBOOK__SECRET,
      scope: ['public_profile', 'email'],
      successRedirect: '/users',  // This does not work
    }));
} 
   
if (process.env.OAUTH__GITHUB__ID && process.env.OAUTH__GITHUB__SECRET) {
  app.configure(oauth2({
      name: 'github',
      Strategy: GithubStrategy,
      clientID: process.env.OAUTH__GITHUB__ID,
      clientSecret: process.env.OAUTH__GITHUB__SECRET,
      scope: ['user:email'],
    }));
}

if (process.env.OAUTH__GOOGLE__ID && process.env.OAUTH__GOOGLE__SECRET) {
  app.configure(oauth2({
      name: 'google',
      Strategy: GoogleStrategy,
      clientID: process.env.OAUTH__GOOGLE__ID,
      clientSecret: process.env.OAUTH__GOOGLE__SECRET,
      scope: ['profile', 'email'],
    }));
}

app.use('/users', bodyParser.json(), users);

app.use(errorHandler());

app.service('/authentication')
  .hooks({
    before: {
      create: [
        authenticationHooks.authenticate(['jwt', 'local']),
      ],
      remove: [
        authenticationHooks.authenticate('jwt'),
      ],
    },
    after: {
      create: [
        (hook) => {
          console.log(hook.params.user);
          console.log(hook.result);
          return hook;
        },
      ],
    },
  });
  
  
export default app;
