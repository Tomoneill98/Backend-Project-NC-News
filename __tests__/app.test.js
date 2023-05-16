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
        expect(response.body).toEqual({
          msg: "Error - Please check endpoint and try again",
        });
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

describe("GET - /api/articles/:article_id/comments", () => {
  it("200 - Responds with an array of comments for given article id ", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((response) => {
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

describe("Error handling - /api/articles/:article_id/comments", () => {
  it("404 - responds with error message when passed with invalid id", () => {
    return request(app)
      .get("/api/articles/1000000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Error - article doesn't exist");
      });
  });
  it("GET - look for nonsense - Returns an error", () => {
    return request(app)
      .get("/api/articles/nonsense/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Error - Please check endpoint and try again"
        );
      });
  });
  it("GET - look for an article with no comments - Returns an empty array", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toEqual([]);
      });
  });
});

// task 7

describe("POST - /api/articles/:article_id/comments", () => {
  it("201 - should post a comment to the articles table for given article id ", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
});

describe("7. error handling - POST ", () => {
  it("400 - when article ID is not a number ", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/nonsense/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Error - Please check endpoint and try again"
        );
      });
  });
  it("400 - when username or body is missing ", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Error - please enter username or comment");
      });
  });
  it("404 - when username doesnt exist ", () => {
    const newComment = {
      username: "emily hassle",
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Error - Not Found");
      });
  });
  it("404 - when article id is not in database ", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/100000/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Error - Not Found");
      });
  });
  it("200 - ignore unneccessary properties", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a comment",
      favColour: "blue",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
});

// PATCH Tests //
describe("/api/articles/:article_id", () => {
  it("PATCH - status: 200 - returns status code 200 and updated object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((response) => {
        expect(response.body.updatedArticle.votes).toBe(101);
      });
  });
  it("PATCH - status: 200 - it works with larger integers", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 300 })
      .expect(200)
      .then((response) => {
        expect(response.body.updatedArticle.votes).toBe(400);
      });
  });
  it("PATCH - status: 404 - with error message", () => {
    return request(app)
      .patch("/api/articles/123456789")
      .send({ inc_votes: 1 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found!");
      });
  });
  it("PATCH - status: 400 - error message if the article_id is not a number", () => {
    return request(app)
      .patch("/api/articles/nonsense")
      .send({ inc_votes: 1 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Error - Please check endpoint and try again"
        );
      });
  });
  it("PATCH - status: 400 - error message if inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "Incorrect data type" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Incorrect data type");
      });
  });
});
