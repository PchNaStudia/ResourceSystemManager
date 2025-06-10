## Auth

We decided to use Google's OIDC provider as main Authorization source with permission based model for resources

### Login flow

1. Press Login button
2. You will be redirected to Google's consent screen ( if you did not consent prior)
3. Google returns code
4. On backend we exchange code for auth token and id token
5. We verify id token
6. Session is created for user (WIP)

### Session

- SessionId - crypto secure generated random value
- SessionId binds session to user (WIP)
