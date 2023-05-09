const app = require("../app"); // require in the app file so we can run tests on it
const request = require("supertest"); // require in supertest with the keyword 'request'
const connection = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  // re-seed the database before each test
  return seed(testData);
});

afterAll(() => {
  // un seeds at very end
  return connection.end();
});

describe("GET - Status: 200 - Responds with an array of topic objects with slug and description properties", () => {
  it("should respond with a topic array ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        expect(result.body.length).toBe(3);
        result.body.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
          expect(typeof topic).toBe("object");
        });
        expect(Array.isArray(result.body)).toEqual(true);
        // .objectContaining - allow object to be extended with extra props
        // .toMatchObject
      });
  });
  it("status: 404, responds with an erorr message when passed a non existent path", () => {
    return request(app)
      .get("/api/nothing")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("Error - invalid endpoint");
      });
  });
});
