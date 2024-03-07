const fs = require("fs");
const qs = require("querystring");

// Function to read users from file
function readUsersFromFile() {
  try {
    const data = fs.readFileSync("users.txt", "utf8");
    return data.split("\n").filter(Boolean);
  } catch (error) {
    return [];
  }
}

// Function to write user to file
function writeUserToFile(userName) {
  return new Promise((resolve, reject) => {
    fs.appendFile("users.txt", userName + "\n", "utf8", (error) => {
      if (error) {
        console.error("Error writing to file:", error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Function to handle routes
function handleRoutes(req, res, path) {
  if (path === "/") {
    // "/" route - Show greeting text
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome to the homepage!\n");
  } else if (path === "/create") {
    // "create" route - Show form with "userName" input
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <html>
          <body>
            <form method="post" action="/create">
              <label for="userName">User Name:</label>
              <input type="text" id="userName" name="userName" required>
              <input type="submit" value="Submit">
            </form>
          </body>
        </html>
      `);
    } else if (req.method === "POST") {
      // Handle POST request to "/add" and store user name in text file
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const formData = qs.parse(body);
        const userName = formData.userName;

        // Call the function that writes to the file and wait for it to complete
        writeUserToFile(userName)
          .then(() => {
            res.writeHead(302, { Location: "/users" });
            res.end();
          })
          .catch((error) => {
            console.error("Error writing to file:", error);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error\n");
          });
      });
    }
  } else if (path === "/users") {
    // "users" route - Show all users stored in the text file
    const users = readUsersFromFile();
    if (users.length === 0) {
      // Redirect to "create" route if no users
      res.writeHead(302, { Location: "/create" });
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Users:\n" + users.join("\n") + "\n");
    }
  } else {
    // Handle other routes
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found\n");
  }
}

module.exports = { handleRoutes };
