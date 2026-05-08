const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = "/api/books";

const results = [];

const coverageTracker = {
  CREATE_FAIL: 0,
  UPDATE_FAIL: 0,
  TYPE: 0,
  REQUIRED: 0,
  BOUNDARY: 0,
  LENGTH: 0,
  TEMPORAL: 0,
  UNKNOWN_CREATE: 0,
  UNKNOWN_UPDATE: 0,
  IMMUTABLE: 0,
};

function logHeader(uniqueId) {
  console.log("SIT725_VALIDATION_TESTS");
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`API_BASE=${API_BASE}`);
  console.log(`INFO|Generated uniqueId=${uniqueId}`);
}

function logResult(r) {
  console.log(
    `TEST|${r.id}|${r.name}|${r.method}|${r.path}|expected=${r.expected}|actual=${r.actual}|pass=${r.pass ? "Y" : "N"}`
  );
}

function logSummary() {
  const failed = results.filter((r) => !r.pass).length;
  console.log(
    `SUMMARY|pass=${failed === 0 ? "Y" : "N"}|failed=${failed}|total=${results.length}`
  );
  return failed === 0;
}

function logCoverage() {
  console.log(
    `COVERAGE|CREATE_FAIL=${coverageTracker.CREATE_FAIL}` +
      `|UPDATE_FAIL=${coverageTracker.UPDATE_FAIL}` +
      `|TYPE=${coverageTracker.TYPE}` +
      `|REQUIRED=${coverageTracker.REQUIRED}` +
      `|BOUNDARY=${coverageTracker.BOUNDARY}` +
      `|LENGTH=${coverageTracker.LENGTH}` +
      `|TEMPORAL=${coverageTracker.TEMPORAL}` +
      `|UNKNOWN_CREATE=${coverageTracker.UNKNOWN_CREATE}` +
      `|UNKNOWN_UPDATE=${coverageTracker.UNKNOWN_UPDATE}` +
      `|IMMUTABLE=${coverageTracker.IMMUTABLE}`
  );
}

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  return { status: res.status, text };
}

async function test({ id, name, method, path, expected, body, tags }) {
  const { status } = await http(method, path, body);
  const pass = status === expected;

  const result = { id, name, method, path, expected, actual: status, pass };
  results.push(result);
  logResult(result);

  const safeTags = Array.isArray(tags) ? tags : [];

  safeTags.forEach((tag) => {
    if (Object.prototype.hasOwnProperty.call(coverageTracker, tag)) {
      coverageTracker[tag]++;
    }
  });
}

function makeValidBook(id) {
  return {
    id,
    title: "Clean Code",
    author: "Robert Martin",
    year: 2008,
    genre: "Non-Fiction",
    summary: "A practical book about writing clean, maintainable and readable software.",
    price: "39.95",
  };
}

function makeValidUpdate() {
  return {
    title: "Refactoring",
    author: "Martin Fowler",
    year: 2018,
    genre: "Non-Fiction",
    summary: "An updated edition on improving existing code safely and systematically.",
    price: "42.50",
  };
}

async function run() {
  const uniqueId = `b${Date.now()}`;
  logHeader(uniqueId);

  const createPath = API_BASE;
  const updatePath = (id) => `${API_BASE}/${id}`;

  await test({
    id: "T01",
    name: "Valid create",
    method: "POST",
    path: createPath,
    expected: 201,
    body: makeValidBook(uniqueId),
    tags: [],
  });

  await test({
    id: "T02",
    name: "Duplicate ID",
    method: "POST",
    path: createPath,
    expected: 409,
    body: makeValidBook(uniqueId),
    tags: ["CREATE_FAIL"],
  });

  await test({
    id: "T03",
    name: "Immutable ID on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), id: "b999" },
    tags: ["UPDATE_FAIL", "IMMUTABLE"],
  });

  await test({
    id: "T04",
    name: "Unknown field CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 1}`), hack: true },
    tags: ["CREATE_FAIL", "UNKNOWN_CREATE"],
  });

  await test({
    id: "T05",
    name: "Unknown field UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), hack: true },
    tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"],
  });

  await test({
    id: "T06",
    name: "Missing title on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      id: `b${Date.now() + 2}`,
      author: "Author Name",
      year: 2020,
      genre: "Fantasy",
      summary: "This summary is long enough to pass validation.",
      price: "19.99",
    },
    tags: ["CREATE_FAIL", "REQUIRED"],
  });

  await test({
    id: "T07",
    name: "Missing price on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      id: `b${Date.now() + 3}`,
      title: "Missing Price Book",
      author: "Author Name",
      year: 2020,
      genre: "Fantasy",
      summary: "This summary is long enough to pass validation.",
    },
    tags: ["CREATE_FAIL", "REQUIRED"],
  });

  await test({
    id: "T08",
    name: "Invalid year type on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now() + 4}`),
      year: "two thousand",
    },
    tags: ["CREATE_FAIL", "TYPE"],
  });

  await test({
    id: "T09",
    name: "Invalid price type on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now() + 5}`),
      price: "abc",
    },
    tags: ["CREATE_FAIL", "TYPE"],
  });

  await test({
    id: "T10",
    name: "Year below minimum on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now() + 6}`),
      year: 1400,
    },
    tags: ["CREATE_FAIL", "BOUNDARY"],
  });

  await test({
    id: "T11",
    name: "Price zero on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now() + 7}`),
      price: "0",
    },
    tags: ["CREATE_FAIL", "BOUNDARY"],
  });

  await test({
    id: "T12",
    name: "Title too short on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now() + 8}`),
      title: "A",
    },
    tags: ["CREATE_FAIL", "LENGTH"],
  });

  await test({
    id: "T13",
    name: "Summary too short on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now() + 9}`),
      summary: "Too short",
    },
    tags: ["CREATE_FAIL", "LENGTH"],
  });

  await test({
    id: "T14",
    name: "Future year on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now() + 10}`),
      year: new Date().getFullYear() + 1,
    },
    tags: ["CREATE_FAIL", "TEMPORAL"],
  });

  await test({
    id: "T15",
    name: "Valid update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 200,
    body: makeValidUpdate(),
    tags: [],
  });

  await test({
    id: "T16",
    name: "Update non-existing book",
    method: "PUT",
    path: updatePath("b-does-not-exist"),
    expected: 404,
    body: makeValidUpdate(),
    tags: ["UPDATE_FAIL"],
  });

  await test({
    id: "T17",
    name: "Invalid genre on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: {
      ...makeValidUpdate(),
      genre: "InvalidGenreName",
    },
    tags: ["UPDATE_FAIL", "TYPE"],
  });

  await test({
    id: "T18",
    name: "Author too short on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: {
      ...makeValidUpdate(),
      author: "X",
    },
    tags: ["UPDATE_FAIL", "LENGTH"],
  });

  await test({
    id: "T19",
    name: "Negative price on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: {
      ...makeValidUpdate(),
      price: "-5.00",
    },
    tags: ["UPDATE_FAIL", "BOUNDARY"],
  });

  await test({
    id: "T20",
    name: "Future year on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: {
      ...makeValidUpdate(),
      year: new Date().getFullYear() + 5,
    },
    tags: ["UPDATE_FAIL", "TEMPORAL"],
  });

  await test({
    id: "T21",
    name: "Missing summary on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: {
      title: "Updated Only",
      author: "Martin Fowler",
      year: 2018,
      genre: "Non-Fiction",
      price: "42.50",
    },
    tags: ["UPDATE_FAIL", "REQUIRED"],
  });

  const pass = logSummary();
  logCoverage();

  process.exit(pass ? 0 : 1);
}

run().catch((err) => {
  console.error("ERROR", err);
  process.exit(2);
});