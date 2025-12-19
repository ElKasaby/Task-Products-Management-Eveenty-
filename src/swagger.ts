import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

export function setupSwagger(app: Express): void {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "Eveenty API",
        version: "1.0.0",
        description:
          "API documentation for Eveenty Project\n\n" +
          "Created by Mohamed Elkasaby\n" +
          "Contact: +201555352412",
      },
      servers: [
        {
          url: "http://localhost:8080",
          description: "Local server",
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          }
        },
      },
      security: [{ BearerAuth: [] }],
    },

    apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/dtos/*.ts"],
  };

  const specs = swaggerJsdoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  console.log("Swagger available at http://localhost:8080/api-docs");
}
