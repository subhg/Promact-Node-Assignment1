const http = require("http");
const url = require("url");
const { handleRoutes } = require("./route");

//create server
const server = http.createServer((req, res) => {
  const path = url.parse(req.url, true).pathname;
  handleRoutes(req, res, path);
});

//listen on PORT 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
