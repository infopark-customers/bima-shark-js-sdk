## Changelog

### Unreleased

### 2.11.0
- [fix] `typecheck.js` for webpack module system
- refactor `signedFetch` to use simple object for headers

### 2.10.0
- [new] `NickClient` add support for importing users to groups from csv

### 2.9.0
- [new] `NickClient` add support for organization import

### 2.8.0
- [new] `NickClient` add support for asset deletion

### 2.7.1
- [fix] missing name for `AssetClient.create` in nodejs

### 2.7.0
- [new] `NickClient` add findAsset

### 2.6.0
- [new] `NickClient` add search for object node

### 2.5.0
- [new] `AssetClient` add support for `format` parameter in `getTemporaryDisplayUrl`

### 2.4.0
- [new] `NickClient` add support for property import

### 2.3.0
- [new] `NickClient` add support for asset creation

#### 2.2.0
- [new] `NickClient` supports userinfo

#### 2.1.1
- [fix] [JSON Deserializer is camelizing permission rule keys](https://www.pivotaltracker.com/story/show/168646343)

#### 2.1.0
- [new] `NickClient` supports `accessibilityCatalog` and `accessiblilityQuestions`

#### 2.0.0
- [fix] `ServiceTokenClient.verifyServiceToken` in Node.js and use `POST`
    endpoint for authentication
- [break] removed `npm run build` for browser ready packages

#### 1.5.1
- [fix] Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource.
  Reason: missing token ‘x-forwarded-proto’ in CORS header ‘Access-Control-Allow-Headers’ from CORS preflight channel

#### 1.5.0
- make `Shark.fetch` work without options, so it behaves more like normal `fetch`

#### 1.4.0
- [new] added `FeedbackPages`

#### 1.3.0
- [new] added `ServiceSettingsClient`
- [fix] `verify` path for `DoubleOptInExecutionClient`

#### 1.2.1
- [fix] export `BusinessAppClient`

#### 1.2.0
- [story] [Add BusinessAppClient](https://www.pivotaltracker.com/story/show/166155315)
- [fix] [Passed params in nested arrays are not being squashed](https://www.pivotaltracker.com/story/show/166155374)
- [new] added `DoubleOptInExecutionClient` and `DoubleOptInRequestClient` clients

#### 1.1.0
- [new] added `PermissionClient`
- [new] added `RoleClient`
- JSONAPI deserializer extracts included relationships

#### 1.0.0
- [new] added `NickClient`
- [new] all clients can now be used in Node.js
- [new] BaseClient now supports `get`, `post`, `patch`, `put` and `delete` for
    easier writing of custom methods like `bulkCreate`
- [new] the Node.js `ServiceToken` now caches
- [break] removed `BaseClient#uploadFile`
- [break] `MailingClient` constructor does not use `{ accessToken: ' ', secretKey: ' ', ...
    }` anymore. Use option `serviceToken` like all other clients.
- [break] `ServiceToken#createServiceToken` has no params anymore. Create the
    the client with option `userId`, if you want to create a ticket for a
    specific user.
- use Travis CI

#### 0.15.0
- [new] added `MailingClient`

#### 0.14.0
- [new] added `GroupClient`
- [new] exposed `simpleFetch` as `fetch`
- [new] exposed type checks `isArray`, `isFunction`, `isObject`, `isString`

#### 0.13.1
- [new] added possibility to cancel upload in `AssetClient` by passing `doCancel` function

#### 0.13.0
- [new] `create` and `update` in `AssetClient` accept progress function

#### 0.12.0
- [new] added `DescriptionClient`
- [new] added `uploadFile` in `BaseClient`
- [new] made `__buildUrl` accept path parameters (used in `uploadFile`)

#### 0.11.1
- [fix] `ContactClient` update method type

#### 0.11.0
- [new] added `ContactClient`

#### 0.10.0
- [new] added `AppClient`
- use `mime` instead of `mime-types`

#### 0.9.0
- [new] added `SubscriptionClient`

#### 0.8.0
- [new] added `AssetClient`

#### 0.7.0
- BIG optimization in terms of package size and dependencies
- pure NPM package now => `npm run build` is not required anymore
- [new] added `UserClient`
- [break] removed `Shark.createClient`

#### 0.6.0
- [new] added `ActivityClient`

#### 0.5.0
- [new] added `ConsentChangesClient`
- [new] renamed `ConsentServiceClient` to `ConsentClient`

#### 0.4.0
- [new] added `ConsentServiceClient`
- [new] added `NotificationsClient`
- [break] `ServiceToken` was renamed to `ServiceTokenClient`
- [new] `ServiceTokenClient` also works for NodeJS
  - uses different implementations for `ServiceTokenClient`

#### 0.3.2
- fix minor logging issue

#### 0.3.1
- [fix] stored service token was not removed on logout
- reset stored service token on `Shark.configure`

#### 0.3.0
- standardjs linting
- debug log option

#### 0.2.0
- [fix] too strong caching of service token
- [new] simple client with `Shark.createClient(options)`

#### 0.1.0
- initial
