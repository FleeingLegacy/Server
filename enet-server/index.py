import sys
import enet
import socket
from threading import Timer

EVENT_POLL_INTERVAL = 1000

def serverLoop(host: enet.Host):
  while True:
    event = host.service(EVENT_POLL_INTERVAL)

    if event.type == enet.EVENT_TYPE_CONNECT:
      print("Connection!")
    elif event.type == enet.EVENT_TYPE_DISCONNECT:
      print("Disconnection!")
    elif event.type == enet.EVENT_TYPE_RECEIVE:
      print("Receive!")

    sys.stdout.flush()

# def serverLoopTest(host: socket.socket):
#   def innerLoop():
#     message, address = host.recvfrom(128)
#     print("from {}, message {}".format(address, message))
#     serverLoopTest(host)
#   loopTimer = Timer(EVENT_POLL_INTERVAL / 1000.0, innerLoop)
#   loopTimer.start()


if __name__ == "__main__":
  # testsocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
  # testsocket.bind(("127.0.0.1", 22102))
  # serverLoopTest(testsocket)

  host = enet.Host(enet.Address(b"localhost", 22102), 10, 0, 0, 0)
  if host:
    host.intercept = lambda address, data: \
      print("[ENet] Got UDP message from {}, data: {}".format(address, data.hex()))

    # host.compress_with_range_coder()
    print("[ENet] Server running on {}:{}".format(host.address.host, host.address.port), flush=True)
    print("[ENet] Start polling in every {}ms".format(EVENT_POLL_INTERVAL), flush=True)
  else:
    raise Exception("ENet host cannot be created")

  serverLoop(host)