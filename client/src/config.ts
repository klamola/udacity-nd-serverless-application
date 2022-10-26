const apiId = 'nfhuloxtnj'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-a5ei0mpmpvh32gqv.us.auth0.com',            // Auth0 domain
  clientId: 'TlzCaJLPX00XWMnodHEg8smTLNqKVxdX',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
