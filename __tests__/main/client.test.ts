import { sayHello } from "../../src/main/client/client"
describe("when hello is passed into sayHello function", () => {
  it("should return Hello, World!", () => {
    expect(sayHello({ name: 'james' })).toBe("Hello, World!, james");
  })
})