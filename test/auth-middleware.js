const isAuth = require("../middleware/is-auth");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

async function getExpect() {
  const { expect } = await import("chai");
  return expect;
}

describe("Auth middleware", function () {
  it("Should throw an error if no authorization header", async function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    const expect = await getExpect();
    expect(isAuth.bind(this, req, {}, () => {})).to.throw("Not authenticated.");
  });

  it("Should throw an error if authorization header is only one string", async function () {
    const req = {
      get: function (headerName) {
        return "xyz";
      },
    };
    const expect = await getExpect();
    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if the token cannot be verified", async function () {
    const req = {
        get: function(){
            return "bearer xyz"
        }
    }
    const expect = await getExpect();
    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  })

  it("Should yeild a userId after decoding the token", async function () {
    const req = {
        get: function() {
            return "bearer xyz"
        }
    }
    sinon.stub(jwt, "verify");
    jwt.verify.returns({userId: "abc"});    
    isAuth(req, {}, () => {});
    const expect = await getExpect();
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  })
});
