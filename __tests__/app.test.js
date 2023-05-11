const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");
const sorted = require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
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
  it("400 - responds with error message when invalid path given", () => {
    return request(app)
      .get("/api/articles/invalidArticleId")
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Error - Invalid ID" });
      });
  });
  it("404 - responds with error message when id not found", () => {
    return request(app)
      .get("/api/articles/1000000000")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Error - invalid article ID" });

      });
  });
});

// task 5

describe("GET - /api/articles", () => {
  it("200 - responds with an array of article objects ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        // expect(response.body.articles[0]).toHaveProperty("author");
        expect(response.body.articles.length).toBe(12);
        response.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            }),
            expect.not.objectContaining({
              body: expect.any(String),
            })
          );
        });
      });
  });
  it("200 - should return an array ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.articles)).toBe(true);
      });
  });
  it("200 - should return the articles sorted in descending order ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("error handling - GET - /api/articles", () => {
  it("404: responds with an error message when passed wrong path ", () => {
    return request(app)
      .get("/api/artacles")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Error - invalid endpoint");
      });
  });
});
