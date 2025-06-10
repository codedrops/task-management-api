import Keycloak from 'keycloak-connect';
import session from 'express-session';

// Use MemoryStore for compatibility with keycloak-connect
const memoryStore = new session.MemoryStore();

   const keycloak = new Keycloak({
     store: memoryStore,
   }, {
     'realm': process.env.KEYCLOAK_REALM,
     'auth-server-url': process.env.KEYCLOAK_URL,
     'clientId': process.env.KEYCLOAK_CLIENT_ID,
     'clientSecret': process.env.KEYCLOAK_CLIENT_SECRET,
     'resource': process.env.KEYCLOAK_CLIENT_ID,
     'ssl-required': 'external',
     'confidential-port': 0,
   });

   export { keycloak, session, memoryStore };