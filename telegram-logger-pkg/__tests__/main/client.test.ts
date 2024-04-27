import { sayHello } from "../../telegram-logger-pkg/src/handler/logger/logger"
describe("when hello is passed into sayHello function", () => {
  it("should return Hello, World!", () => {
    expect(sayHello({ name: 'james' })).toBe("Hello, World!, james");
  })
})