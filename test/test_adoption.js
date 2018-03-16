const Adoption = artifacts.require("./Adoption.sol");

contract('testAdoption', async (accounts) => {
  const owner = accounts[0];
  const instance = await Adoption.deployed();
  await instance.adopt(8);

  it("Test user can adopt pet", async () => {
    const expected = 8;
    const returnedId = await instance.adopt.call(8);
    assert.equal(returnedId.toNumber(), expected, "Adoption of pet ID 8 should be recorded");
  });

  it("Test get adopter address by petId ", async () => {
    const expected = owner;
    const adopter = await instance.adopters.call(8);
    assert.equal(adopter, expected, "Owner of pet ID 8 should be recorded.");
  });

  it("Test get adopter address by pet id in array", async () => {
    const expected = owner;
    const adopters = await instance.getAdopters.call();
    assert.equal(adopters[8], expected, "Owner of pet ID 8 should be recorded.");
  });
});
