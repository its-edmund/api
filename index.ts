import concurrently from "concurrently";

concurrently([
  { command: "cd gateway/src && node index.js", name: "gateway" },
  { command: "cd services/posts/src && node app.js", name: "posts" },
  { command: "cd services/tasks/src && node app.js", name: "tasks" },
]);
