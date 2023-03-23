import { AddressInfo } from "node:net";
import { spawn } from "child_process";
import { stdout } from "node:process";
import path from "node:path";
import httpServer from "./http/Server";
import udpProxyServer from "./udp_proxy/UdpProxyServer";
import generateKey from "./util/KeyGenerator";
// import kcpServer from "./kcp_notused/server";
// import enetServer from "./enetserver";

const HOST = "127.0.0.1";
const HTTP_SERVER_PORT = 39000;
const UDP_PROXY_SERVER_PORT = 22102;
const ENABLE_UDP_PROXY = false;

console.log(generateKey());

httpServer.listen({
  host: HOST,
  port: HTTP_SERVER_PORT,
}).then(() => {
  console.log(`[HTTP] Server is up!  ${(httpServer.server.address() as AddressInfo).address}:${(httpServer.server.address() as AddressInfo).port}`);
});

// const enetServer = spawn("python", ["./enet-server/index.py"], {
//   cwd: ".",
//   windowsHide: true,
// });
// const enetServer = spawn("./enet-server-dotnet/build/x64/Debug/net6.0/FleeingLegacy-ENetServer.exe", {
//   cwd: ".",
//   windowsHide: true,
// });
// enetServer.on("message", (message) => stdout.write(message.toString()));
// enetServer.stdout.setEncoding("utf-8");
// enetServer.stdout.on("data", (chunk) => stdout.write(chunk));

if(ENABLE_UDP_PROXY) {
  udpProxyServer.bind(UDP_PROXY_SERVER_PORT, HOST, () => {
    console.log(`[UDP Proxy] Server is up!  ${udpProxyServer.address().address}:${udpProxyServer.address().port}`)
  });
}

// enetServer;
// kcpServer.bind(22102).on("listening", () => {
//   console.log(`[UDP/KCP] Server is up!  ${HOST}:${kcpServer.address().port}`)
// });
