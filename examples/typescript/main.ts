import { lift, main, std } from "ts4w";
import { cloud } from "@winglang/sdk";
import { equal } from "node:assert";

main((app) => {
  let bucket = new cloud.Bucket(app, "Bucket");

  bucket.addObject("hello", "Hello World from lifted Bucket!");

  new std.Test(app, "test", lift({bucket}).inflight(async ({bucket}) => {
    console.log("in test")
    const hello = await bucket.get("hello");
    equal(hello, "Hello World from lifted Bucket!");
  }))
})