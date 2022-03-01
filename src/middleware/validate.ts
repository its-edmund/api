const loginRequestSchema = {
  type: "object",
  required: ["username", "password"],
  properties: {
    username: {
      type: "string",
      minLength: 4,
    },
    password: {
      type: "string",
      minLength: 8,
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const validate = (): void => {};
