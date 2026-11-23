import assert from "node:assert/strict";
import { test } from "node:test";
import handler from "../api/contact.js";

const environmentKeys = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"];

function setup(t, fetchImplementation, environment = {}) {
  const previousEnvironment = Object.fromEntries(
    environmentKeys.map((key) => [key, process.env[key]]),
  );
  const previousFetch = globalThis.fetch;

  environmentKeys.forEach((key) => {
    if (environment[key] === undefined) delete process.env[key];
    else process.env[key] = environment[key];
  });
  globalThis.fetch = fetchImplementation;

  t.after(() => {
    environmentKeys.forEach((key) => {
      if (previousEnvironment[key] === undefined) delete process.env[key];
      else process.env[key] = previousEnvironment[key];
    });
    globalThis.fetch = previousFetch;
  });
}

function createResponse() {
  return {
    statusCode: 0,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

const validBody = {
  name: "Visitor",
  email: "visitor@example.com",
  message: "Hello Shahzaib.",
  company: "",
};

const configuredEnvironment = {
  RESEND_API_KEY: "re_test_key",
  CONTACT_TO_EMAIL: "shahzaib@example.com",
  CONTACT_FROM_EMAIL: "Portfolio <contact@example.com>",
};

test("rejects invalid form data without sending email", async (t) => {
  let fetchCalled = false;
  setup(t, async () => {
    fetchCalled = true;
    return { ok: true, status: 200 };
  }, configuredEnvironment);

  const res = createResponse();
  await handler(
    { method: "POST", body: { ...validBody, email: "not-an-email" } },
    res,
  );

  assert.equal(res.statusCode, 400);
  assert.equal(fetchCalled, false);
});

test("rejects non-POST requests", async (t) => {
  setup(t, async () => ({ ok: true, status: 200 }), configuredEnvironment);
  const res = createResponse();

  await handler({ method: "GET" }, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, "POST");
});

test("rejects honeypot submissions without sending email", async (t) => {
  let fetchCalled = false;
  setup(t, async () => {
    fetchCalled = true;
    return { ok: true, status: 200 };
  }, configuredEnvironment);

  const res = createResponse();
  await handler(
    { method: "POST", body: { ...validBody, company: "Spam" } },
    res,
  );

  assert.equal(res.statusCode, 400);
  assert.equal(fetchCalled, false);
});

test("reports missing mail configuration instead of accepting the message", async (t) => {
  setup(t, async () => ({ ok: true, status: 200 }));
  const res = createResponse();

  await handler({ method: "POST", body: validBody }, res);

  assert.equal(res.statusCode, 503);
  assert.match(res.body.error, /not configured/i);
});

test("sends a plain-text email with the visitor set as reply-to", async (t) => {
  let request;
  setup(t, async (url, options) => {
    request = { url, options };
    return { ok: true, status: 200 };
  }, configuredEnvironment);

  const res = createResponse();
  await handler({ method: "POST", body: validBody }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(request.url, "https://api.resend.com/emails");
  assert.equal(request.options.headers.Authorization, "Bearer re_test_key");
  assert.deepEqual(JSON.parse(request.options.body), {
    from: configuredEnvironment.CONTACT_FROM_EMAIL,
    to: [configuredEnvironment.CONTACT_TO_EMAIL],
    reply_to: validBody.email,
    subject: "New message from your portfolio",
    text: `From: ${validBody.name}\nReply to: ${validBody.email}\n\n${validBody.message}`,
  });
});

test("returns a delivery error when Resend rejects the request", async (t) => {
  setup(t, async () => ({ ok: false, status: 422 }), configuredEnvironment);
  const res = createResponse();

  await handler({ method: "POST", body: validBody }, res);

  assert.equal(res.statusCode, 502);
  assert.match(res.body.error, /could not send/i);
});
