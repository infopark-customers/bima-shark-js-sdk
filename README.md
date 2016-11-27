# bima-shark-sdk (Javascript)

This is the Javascript SDK for the BImA applications.


### Installation (TODO)

#### In Node.JS environments

1. Add ` "bima-notifications-sdk": "git@github.com:infopark-customers/bima-notifications-js-sdk.git" ` to your ` package.json `.
2. Run ` npm install `
3. Done.

### In browser enviroments

If you don't have Node.JS locally, you could use the already pre-build versions of the SDK.
Just link any version which is available under ` dist/ ` in your app.


In both ways you can use the SDK through the global class ` NotificationService `.


### Usage
```
// group_client.js
import { Client } from "bima-shark-sdk";

class Group {
  constructor() {
    this.client = new ApiClient({
      name: "GroupClient",
      url: "https://contactservice.bundesimmo.de"
    });
  }

  search(options = {}) {
    const ids = options.ids || null;
    const canManage = options.canManage || null;
    const data = { filter: {}, include: "creator" };

    if (ids !== null && ids.length === 0) {
      return new Promise((resolve, reject) => { resolve(null); });
    } else if (ids !== null) {
      data.filter["ids"] = ids;
    }

    if (canManage === true) {
      data.filter["can_manage"] = true;
    }

    return this.client.search(data);
  }

  find(id) {
    return this.client.find(id, { include: "creator" });
  }

  create(data) {
    return this.client.create(data, { include: "creator" });
  }

  update(data) {
    return this.client.update(data, { include: "creator" });
  }

  destroy(id) {
    return this.client.destroy(id);
  }
}

export default Group;
```


### Docs

All methods in SDK are documented with [JSDoc](http://usejsdoc.org/).
You can generate the doc files locally with ` npm run docs ` and have a full-HTML documentation of the SDK in ` /docs `.

Note: If you don't have installed JSDoc already, just run ` npm install -g jsdoc `.


### Testing

This SDK uses [Jasmine](https://jasmine.github.io/) as test framework. Server responses are mocked with [fetch-mock](http://www.wheresrhys.co.uk/fetch-mock/).

```
npm test
```


### About promises

Why does this happen? I thought that `then()` and `catch()` can be chain multiple times?

If you add then multiple times, you are chaining methods that should be called in sequence, until an exception is thrown.
Exceptions in the then chain must be handled by `catch` declared after the `then`. If there's no `catch` after the `then`,
this error will be triggered: `Uncaught (in promise) Error(…)`.

If you add `catch` multiple times, you are chaining methods that should be called when something goes wrong (in the `then` functions before).
However, the second `catch` in the chain will only be called if the first one re-throw the exception, and so forth.
When `catch` is triggered, the chain resumes on the next then declared after the `catch`.

The **catch()** method returns a `Promise` and deals with rejected cases only. It behaves the same as calling `Promise.prototype.then(undefined, onRejected)`
(in fact, calling `obj.catch(onRejected)` internally calls `obj.then(undefined, onRejected)`).

[Source Stack Overflow](https://stackoverflow.com/questions/34222818/how-does-the-catch-work-in-a-native-promise-chain)


### Links for further reading

* https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
* https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
