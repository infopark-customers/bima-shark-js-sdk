# Changelog

### 0.5.0
- [new] added `ConsentChangesClient`
- [new] renamed `ConsentServiceClient` to `ConsentClient`

### 0.4.0
- [new] added `ConsentServiceClient`
- [new] added `NotificationsClient`
- [break] `ServiceToken` was renamed to `ServiceTokenClient`
- [new] `ServiceTokenClient` also works for NodeJS
  - uses different implementations for `ServiceTokenClient`

### 0.3.2
- fix minor logging issue

### 0.3.1
- [fix] stored service token was not removed on logout
- reset stored service token on `Shark.configure`

### 0.3.0
- standardjs linting
- debug log option

### 0.2.0
- [fix] too strong caching of service token
- [new] simple client with `Shark.createClient(options)`

### 0.1.0
- initial
