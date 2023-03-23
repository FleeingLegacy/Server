import { FastifyReply, FastifyRequest } from "fastify";
import IHttpResponseHandler from "src/common/IHttpResponseHandler";

export default class AccountTokenLoginHandler implements IHttpResponseHandler {
  handle(req: FastifyRequest, res: FastifyReply): void {
    if((req.query as Record<string, string>)["token"] == "FLEEINGLEGACY") {
      res.send(JSON.stringify({
        retcode: 0,
        message: "OK",
        data: {
          uid: 3939,
          token: "FLEEINGLEGACY",
        }
      }));
    } else {
      res.send(JSON.stringify({
        retcode: -1,
        message: "Token doesn't match!",
      }));
    }
  }
}