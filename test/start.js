// const { expect } = require("chai");
async function getExpect(){
    const { expect } = await import("chai");
    return expect;
}

it('should add numbers correctly', async function (){
    const num1 = 2;
    const num2 = 3;
    const expect = await getExpect();
    expect(num1 + num2).to.equal(5);
})