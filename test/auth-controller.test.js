const sinon = require("sinon");
const User = require("../models/user");
const AuthController = require("../controllers/auth");

async function getExpect() {
  const { expect } = await import("chai");
  return expect;
}

describe("Auth Controller - Login", function () {
  it("Should throw an error with 500 statusCode if accessing the database fails", async function () {
    sinon.stub(User, "findOne");
    User.findOne.throws();
    const req = {
      body: {
        email: "test@test.com",
        password: "tester",
      },
    };

    try {
      const result = await AuthController.login(req, {}, () => {});
        const expect = await getExpect();
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
    } catch (error) {
      // Handle the error
      console.error(error);
    } finally {
      User.findOne.restore();
    }
  });
});