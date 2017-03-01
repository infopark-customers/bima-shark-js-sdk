"use strict";

const BimaNotifications = require("src/bima-notifications-sdk");
const faker = require("faker");

// IMPORTANT: Do NOT change any of those values!
const validApiOptions = Object.freeze({
  socketUrl: "ws://0.0.0.0:3004/socket",
  accessId: "ac919e0a-fa93-402b-85c4-c66ea4845037",
  // webSocketSecretKey: "cd79dc537ce6fa64709c2cc92ac520978adc6a54599efcdf8138ff7ac029",
  userId: faker.random.uuid()
});

describe("BimaNotifications", () => {
  describe("class", () => {
    describe("methods", () => {
      describe("channelNames()", () => {
        it("has lenght of two entries", () => {
          expect(BimaNotifications.channelNames().length).toEqual(2);
        });

        it("includes specific values", () => {
          expect(BimaNotifications.channelNames()).toContain("GlobalNotificationsChannel");
          expect(BimaNotifications.channelNames()).toContain("UserNotificationsChannel");
        });
      });
    });
  });

  describe("instance", () => {
    describe("construtor(options)", () => {
      describe("options parameter is not present", () => {
        it("throws an error", () => {
          const notifications = () => { return new BimaNotifications(); };
          const errorMessage = "Required option parameters are missing";

          expect(notifications).toThrowError(errorMessage);
        });
      });

      describe("options.socketUrl is invalid", () => {
        const options = {
          socketUrl: "invalid_url",
          accessId: faker.random.uuid(),
          webSocketSecretKey: faker.internet.password(),
          userId: faker.random.uuid()
        };
        const notifications = () => { return new BimaNotifications(options); };
        const errorMessage = "options.socketUrl has invalid format";

        it("throws an error", () => {
          expect(notifications).toThrowError(errorMessage);
        });
      });

      describe("options are complete and valid", () => {
        const options = validApiOptions;
        const notifications = new BimaNotifications(options);

        describe("new defined attributes", () => {
          it("has defined action cable attributes", () => {
            expect(notifications.actionCableConsumer).toBeDefined();
            expect(notifications.connection).toBeDefined();
          });

          it("has subscriptionManager attribute with specifications", () => {
            expect(notifications.subscriptionManager).toBeDefined();
            expect(notifications.subscriptionManager.instance).toEqual(notifications);
            expect(notifications.subscriptionManager.consumer).
              toEqual(notifications.actionCableConsumer);
          });
        });

        describe("websocket connection", () => {
          // This is required due possible delays while the connection initialization
          beforeEach(done => {
            setTimeout(() => {
              done();
            }, 200);
          });

          it("is open", done => {
            expect(notifications.connection.isOpen()).toBe(true);
            done();
          });
        });

        describe("channel subscriptions", () => {
          // This is required due possible delays while the connection initialization
          beforeEach(done => {
            setTimeout(() => {
              done();
            }, 200);
          });

          it("is not empty and contains specific values", done => {
            expect(notifications.subscriptionManager.connectedChannels.length).
              toBeGreaterThan(0);
            expect(notifications.subscriptionManager.connectedChannels).
              toContain("GlobalNotificationsChannel");
            expect(notifications.subscriptionManager.connectedChannels).
              toContain("UserNotificationsChannel");
            done();
          });
        });
      });

    });
  });
});
