const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Eigen Test",
      version: "0.1.0",
      description:
      "This is a technical test",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Villian",
        url: "https://villian.my.id",
        email: "villian780@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: [path.join(__dirname, '../src/routes/', '*.js')],
};

export {
  swaggerOptions
}