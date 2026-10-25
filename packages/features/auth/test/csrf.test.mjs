import test from "node:test";
import assert from "node:assert/strict";
import { isCsrfRequestAllowed, isCsrfValid } from "../src/csrf/index.ts";

const common = {
  method: "POST",
  origin: "https://admin.example.test",
  requestOrigin: "https://admin.example.test",
  configuredOrigin: "https://admin.example.test",
  cookieValue: "random-token",
  headerValue: "random-token",
};

test("accepts a same-origin mutation with matching CSRF cookie and header", () => {
  assert.equal(isCsrfRequestAllowed(common), true);
});

test("rejects a mutation when Origin is missing", () => {
  assert.equal(isCsrfRequestAllowed({ ...common, origin: null }), false);
});

test("rejects a cross-origin mutation even with matching CSRF values", () => {
  assert.equal(
    isCsrfRequestAllowed({ ...common, origin: "https://attacker.example" }),
    false,
  );
});

test("rejects missing or mismatched double-submit tokens", () => {
  assert.equal(isCsrfRequestAllowed({ ...common, headerValue: null }), false);
  assert.equal(
    isCsrfRequestAllowed({ ...common, headerValue: "other" }),
    false,
  );
  assert.equal(isCsrfValid("", ""), false);
});

test("does not require CSRF tokens for safe methods", () => {
  assert.equal(
    isCsrfRequestAllowed({
      ...common,
      method: "GET",
      origin: null,
      cookieValue: null,
      headerValue: null,
    }),
    true,
  );
});

test("rejects malformed origins and origins containing a path", () => {
  assert.equal(isCsrfRequestAllowed({ ...common, origin: "null" }), false);
  assert.equal(
    isCsrfRequestAllowed({
      ...common,
      origin: "https://admin.example.test/path",
    }),
    false,
  );
});
