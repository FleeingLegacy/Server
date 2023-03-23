/* eslint-disable */
const enet = require("enet");

const enetServer = enet.createServer({
  address: new enet.Address("127.0.0.1", 22102),
  peers: 32,
  channels: 0,
  down: 0,
  up: 0,
}, (err, host) => {
  if(err) return;

  console.log(`ENet server running on ${host.address.address}:${host.address.port}`);

  host.on("connect", (peer, data) => {
    peer.on("message", (packet, channel) => {
      console.log(`Receive ${data} ${packet} ${channel}`);
    })
  });

  host.on("message", console.log);
  host.on("telex", console.log);

  host.start(100);
});

module.exports = enetServer;