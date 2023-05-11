const app = require("../app"); // require in the app file so we can run tests on it
const request = require("supertest"); // require in supertest with the keyword 'request'
const connection = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");
const sorted = require("jest-sorted");

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
  it("Responds with an error message when passed a non existent path", () => {
    return request(app)
      .get("/api/nothing")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("Error - invalid endpoint");
      });
  });
});

describe("GET - /api", () => {
  it("200 - Responds with a JSON file of all api endpoints ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(endpoints);
        expect(typeof response.body).toBe("object");
        expect(response.body).toHaveProperty("GET /api/articles");
        expect(response.body).toHaveProperty("GET /api/topics");
        expect(response.body).toHaveProperty("GET /api");
      });
  });
});

describe("GET - /api/articles/:article_id/comments", () => {
  it("200 - Responds with an array of comments for given article id ", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((response) => {
        console.log(response.body);
        console.log(response.body.comments);
        expect(Array.isArray(response.body.comments)).toBe(true);
        expect(response.body.comments.length).toBe(2);
        response.body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
      });
  });
  it("200 - Responds with the array of comments ordered by recent comments first", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

// describe("Error handling - /api/articles/:article_id/comments", () => {
//   it("404 - responds with error message when passed with invalid id", () => {
//     return request(app)
//       .get("/api/articles/1000000/comments")
//       .expect(404)
//       .then((response) => {
//         expect(response.body.msg).toBe("Error - invalid endpoint");
//       });
//   });
// });
