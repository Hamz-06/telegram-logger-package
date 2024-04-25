import { InfoType } from "./clientType";

export function sayHello(info: InfoType) {
  return `Hello, World!, ${info.name}`;
}