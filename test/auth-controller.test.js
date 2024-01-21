const sinon = require("sinon");
const mongoose = require("mongoose");

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

    it("Should send a response with a valid user status for an existing user", async function () {
        try {
            await mongoose.connect("mongodb://127.0.0.1:27017/test");
            const user = new User({
                email: "test@test.com",
                password: "tester",
                name: "Test",
                posts: [],
                _id: '5c0f66b979af55031b34728a'
            });
            await user.save();

            const req = { userId: '5c0f66b979af55031b34728a' };
            const res = {
                statusCode: 500,
                userStatus: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.userStatus = data.status;
                }
            };

            await AuthController.getUserStatus(req, res, () => {});
            const expect = await getExpect();
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new!');

            await User.deleteMany({});
            await mongoose.disconnect();
        } catch (error) {
            console.log(error);
        }
    });
});