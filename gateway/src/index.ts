import { createProxyMiddleware } from "http-proxy-middleware";
import express from "express";
import helmet from "helmet";

const app = express();

app.use(helmet());

app.use(
  "/tasks",
  createProxyMiddleware({
    target: "http://localhost:8003",
    changeOrigin: true,
    pathRewrite: {
      [`^/tasks`]: "",
    },
  })
);

app.use(
  "/posts",
  createProxyMiddleware({
    target: "http://localhost:8002",
    changeOrigin: true,
    pathRewrite: {
      [`^/posts`]: "",
    },
  })
);

app.listen(8000, () => {
  console.log(`GATEWAY started on port ${8000}`);
});
