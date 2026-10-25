import test from "node:test";
import assert from "node:assert/strict";
import {
  isSafeReturnUrl,
  sanitizeReturnUrl,
} from "../src/server/return-url.ts";

test("allows local relative callback paths", () => {
  assert.equal(isSafeReturnUrl("/dashboard"), true);
  assert.equal(sanitizeReturnUrl("/dashboard"), "/dashboard");
});

test("rejects external and protocol-relative callback URLs", () => {
  assert.equal(isSafeReturnUrl("https://attacker.example"), false);
  assert.equal(isSafeReturnUrl("//attacker.example"), false);
  assert.equal(sanitizeReturnUrl("https://attacker.example"), "/");
});

test("rejects backslash and encoded redirect tricks", () => {
  assert.equal(isSafeReturnUrl("/\\attacker.example"), false);
  assert.equal(isSafeReturnUrl("/%2f%2fattacker.example"), false);
  assert.equal(isSafeReturnUrl("/%5c%5cattacker.example"), false);
});
