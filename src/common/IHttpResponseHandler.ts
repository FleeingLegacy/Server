import { FastifyReply, FastifyRequest } from "fastify";

export default interface IHttpResponseHandler {
  handle(req: FastifyRequest, res: FastifyReply): void;
}