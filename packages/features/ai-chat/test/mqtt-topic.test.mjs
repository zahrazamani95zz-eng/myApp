import test from "node:test";
import assert from "node:assert/strict";
import { buildChatReplyTopic } from "../src/infrastructure/gateways/mqtt-topic.ts";

test("builds an exact topic for a normal conversation identifier", () => {
  assert.equal(buildChatReplyTopic("abc-123"), "hermes/chat/abc-123/replies");
});

test("rejects identifiers that could inject MQTT topic levels or wildcards", () => {
  for (const chatId of [
    "",
    "  ",
    "a/b",
    "a+b",
    "a#",
    "a\\b",
    "a\u0000b",
    "a".repeat(129),
  ]) {
    assert.throws(() => buildChatReplyTopic(chatId));
  }
});

test("rejects custom reply topics containing wildcards or invalid levels", () => {
  assert.throws(() =>
    buildChatReplyTopic("abc", () => "hermes/chat/+/replies"),
  );
  assert.throws(() => buildChatReplyTopic("abc", () => "hermes//replies"));
  assert.throws(() => buildChatReplyTopic("abc", () => "/hermes/chat/abc"));
});

test("accepts a valid custom reply topic", () => {
  assert.equal(
    buildChatReplyTopic("abc", (id) => `tenant/chat/${id}/replies`),
    "tenant/chat/abc/replies",
  );
});
