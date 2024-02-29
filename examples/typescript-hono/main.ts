import { cloud, main, lift } from "@wingcloud/framework";
import { apiRoute } from "./api-route";
import { match } from "node:assert";

main((root, test) => {
  let bucket = new cloud.Bucket(root, "Bucket");

  bucket.addObject("hello", "Hello World from lifted Bucket!");

  const api = new cloud.Api(root, "api");

  apiRoute(api, "/", { bucket });
  apiRoute(api, "/api");

  test(
    "GET /",
    lift({ apiUrl: api.url }).inflight(async ({ apiUrl }) => {
      const response = await fetch(apiUrl);
      const text = await response.text();
      match(text, /Hello World from lifted Bucket/);
    })
  );

  test(
    "GET /api",
    lift({ apiUrl: api.url }).inflight(async ({ apiUrl }) => {
      const response = await fetch(`${apiUrl}/api`);
      const text = await response.text();
      match(text, /Hello World/);
    })
  );

  test(
    "POST /api",
    lift({ apiUrl: api.url }).inflight(async ({ apiUrl }) => {
      const response = await fetch(`${apiUrl}/api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      const text = await response.text();
      match(text, /Posted/);
    })
  );
});
