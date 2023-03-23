import { FastifyReply, FastifyRequest } from "fastify";
import IHttpResponseHandler from "src/common/IHttpResponseHandler";
import fs from "fs/promises";

export default class VersionsHandler implements IHttpResponseHandler {
  async handle(req: FastifyRequest, res: FastifyReply) {
    if(req.url.includes("bundle_versions")) {
      res.send(await fs.readFile("src/http/resource/bundle_versions"));
    } else if(req.url.includes("asset_index")) {
      res.send(await fs.readFile("src/http/resource/asset_index"));
    } else if(req.url.includes("_versions")) {
      // Empty response to bypass remote resource checking/downloading
      res.send();
    } else {
      res.send("138541");
    }
  }
}