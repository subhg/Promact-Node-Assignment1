// Import necessary modules
const http = require("http");
const url = require("url");
const { handleRoutes } = require("./route");

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Parse the requested URL to extract the pathname
  const path = url.parse(req.url, true).pathname;

  // Call the handleRoutes function to handle the incoming request based on the path
  handleRoutes(req, res, path);
});

// Define the port on which the server will listen
const PORT = 3000;

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
