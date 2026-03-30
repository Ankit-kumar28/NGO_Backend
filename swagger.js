import swaggerJSDoc from "swagger-jsdoc";



const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NGO Backend API",
      version: "1.0.0",
      description: "API documentation for NGO backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
      {
        url: "https://ngo-backend-f73r.onrender.com", 
      },
    ],
    components: {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
},
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
