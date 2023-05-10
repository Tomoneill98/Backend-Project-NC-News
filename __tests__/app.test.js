const app = require("../app"); // require in the app file so we can run tests on it
const request = require("supertest"); // require in supertest with the keyword 'request'
const connection = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

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
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
        expect(Array.isArray(response.body.topics)).toEqual(true);
        // .objectContaining - allow object to be extended with extra props
        // .toMatchObject
      });
  });
  it("Responds with an error message when passed a non existent path", () => {
    return request(app)
      .get("/api/nothing")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Error - invalid endpoint");
      });
  });
});

describe("GET - /api", () => {
  it("200 - Responds with a JSON file of all api endpoints ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.APIs).toEqual(endpoints);
      });
  });
});

describe("GET - /api/articles/:article_id", () => {
  it("200 - responds with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
  });
});

describe("GET - /api/articles/invalidArticleId", () => {
  it("404 - responds with error message when invalid path given", () => {
    return request(app)
      .get("/api/articles/invalidArticleId")
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Error - Invalid ID" });
      });
  });
  it("400 - responds with error message when id not found", () => {
    return request(app)
      .get("/api/articles/1000000000")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Error - invalid article ID" });
      });
  });
});
