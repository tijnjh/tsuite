import { createNode, toast, tryCatch } from "../../src";

const [objectRes, objectErr] = tryCatch({
  somethingThatWontError: () => JSON.parse('{ "something": "something" }'),
  thisWillError: () => JSON.parse("invalid"),
});

const [promiseRes, promiseErr] = await tryCatch(fetch("something://something"));

const [functionRes, functionErr] = tryCatch(
  () => new URL("this isnt a valid url"),
);

const elDiv = createNode("div", {
  textContent: "Hello!",
  id: "myDiv",
  style: { color: "red" },
});
document.body.append(elDiv);
