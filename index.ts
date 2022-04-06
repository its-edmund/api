import concurrently from "concurrently";

concurrently([
  { command: "cd dist/gateway/src && node index.js", name: "gateway" },
  { command: "cd dist/services/posts/src && node app.js", name: "posts" },
  { command: "cd dist/services/tasks/src && node app.js", name: "tasks" },
]);
