module.exports = {
  docforge: {
    input: "./openapi.yaml",
    output: {
      mode: "tags-split",
      target: "../api-client-react/src/generated/api.ts",
      schemas: "../api-zod/src/generated/schemas.ts",
      client: "react-query",
      override: {
        mutator: {
          path: "../api-client-react/src/fetcher.ts",
          name: "customFetch",
        },
      },
    },
  },
};
