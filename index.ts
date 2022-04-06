import concurrently from "concurrently";

concurrently([
  { command: "cd gateway && yarn dev", name: "gateway" },
  { command: "cd services/posts && yarn dev", name: "posts" },
  { command: "cd services/tasks && yarn start", name: "tasks" },
]);
