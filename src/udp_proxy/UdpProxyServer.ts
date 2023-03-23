import dgram from "node:dgram";

const udpProxyServer = dgram.createSocket("udp4");

udpProxyServer.on("message", (msg, remoteInfo) => {
  console.log(`[UDP Proxy] Got message: ${msg.toString("hex")}, from ${remoteInfo.address}:${remoteInfo.port}, proxy to ENet server`);
  udpProxyServer.send(msg, 22101);

  const tempdat = Buffer.from("cfff2b28a174d947837b88b1fdf1df576b999b36fff4b98e4b4f0f80269662fd7c69e24c48d3d90608", "hex"); // useless
  udpProxyServer.send(tempdat, remoteInfo.port, remoteInfo.address);
});

export default udpProxyServer;
