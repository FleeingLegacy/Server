import fastify from "fastify";
import mappings from "./Mappings";

// Create HTTP server instance
const httpServer = fastify();

// GET /favicon.ico
httpServer.get("/favicon.ico", (_, res) => {
  // Just return bogus response for favicon
  res.code(200);
  res.header("Content-Type", "image/x-icon");
  res.send(null);
});

// GET /*
httpServer.get("/*", async (req, res) => {
  const baseURL = req.url.split("?")[0];

  res.code(200);
  res.header("Content-Type", "text/html");

  if(baseURL in mappings) {
    await mappings[baseURL].handle(req, res);
    console.log(`[HTTP] request: ${req.url}   * handled`);
  } else {
    // res.send(JSON.stringify({ "code": 0 }));
    res.send();
    console.log(`[HTTP] request: ${req.url}   * not handled`);
  }
});

export default httpServer;