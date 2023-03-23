# mitmproxy script referenced from Grasscutter's script (https://github.com/Grasscutters/Grasscutter/blob/development/proxy.py)

import collections
import random
from mitmproxy import http, connection, ctx, tls
from mitmproxy.utils import human
from abc import ABC, abstractmethod
from enum import Enum

USE_SSL = False
REMOTE_HOST = "localhost"
REMOTE_PORT = 39000

class FleeingLegacyProxy:
#   IP_LIST_CONNTEST = [
#     "164.52.44.50",   # bilibili
#     "103.235.46.40",  # baidu
#     "220.181.38.149", # another baidu
#   ]

  DOMAIN_LIST = [
    "fleeinglegacy.local",
    "dispatchcnglobal.yuanshen.com",
    "dispatch.cnglobal.yuanshen.com",
    "gameapi.account.mihoyo.com",
    "gameapi-os.account.mihoyo.com",
    "resource.mihoyo.com"
  ]

  LOG_DOMAIN_LIST = [
    "log-upload.mihoyo.com",
    "log-upload-os.mihoyo.com",
    "log-upload-os.hoyoverse.com",
    "devlog-upload.mihoyo.com",
    "overseauspider.yuanshen.com",
    "uspider.yuanshen.com",
    "41.103.71.252"
  ]

  # LIST_DOMAINS = [
  #     "api-os-takumi.mihoyo.com",
  #     "hk4e-api-os-static.mihoyo.com",
  #     "hk4e-sdk-os.mihoyo.com",
  #     "dispatchosglobal.yuanshen.com",
  #     "osusadispatch.yuanshen.com",
  #     "account.mihoyo.com",
  #     "log-upload-os.mihoyo.com",
  #     "dispatchcntest.yuanshen.com",
  #     "devlog-upload.mihoyo.com",
  #     "webstatic.mihoyo.com",
  #     "log-upload.mihoyo.com",
  #     "hk4e-sdk.mihoyo.com",
  #     "api-beta-sdk.mihoyo.com",
  #     "api-beta-sdk-os.mihoyo.com",
  #     "cnbeta01dispatch.yuanshen.com",
  #     "dispatchcnglobal.yuanshen.com",
  #     "cnbeta02dispatch.yuanshen.com",
  #     "sdk-os-static.mihoyo.com",
  #     "webstatic-sea.mihoyo.com",
  #     "webstatic-sea.hoyoverse.com",
  #     "hk4e-sdk-os-static.hoyoverse.com",
  #     "sdk-os-static.hoyoverse.com",
  #     "api-account-os.hoyoverse.com",
  #     "hk4e-sdk-os.hoyoverse.com",
  #     "overseauspider.yuanshen.com",
  #     "gameapi-account.mihoyo.com",
  #     "minor-api.mihoyo.com",
  #     "public-data-api.mihoyo.com",
  #     "uspider.yuanshen.com",
  #     "sdk-static.mihoyo.com",
  #     "abtest-api-data-sg.hoyoverse.com",
  #     "log-upload-os.hoyoverse.com"
  # ]

  def request(self, flow: http.HTTPFlow) -> None:
    if flow.request.host in self.DOMAIN_LIST:
      originalUrl = flow.request.url

      if USE_SSL:
        flow.request.scheme = "https"
      else:
        flow.request.scheme = "http"
      flow.request.host = REMOTE_HOST
      flow.request.port = REMOTE_PORT

      print(f"PROXY: {originalUrl} → {flow.request.url}")
    elif flow.request.host in self.LOG_DOMAIN_LIST:
      # Block logger requests
      flow.request.host = "255.255.255.255"
      flow.request.port = 65534

class InterceptionResult(Enum):
    SUCCESS = 1
    FAILURE = 2
    SKIPPED = 3

class TlsStrategy(ABC):
    def __init__(self):
        self.history = collections.defaultdict(lambda: collections.deque(maxlen=200))

    @abstractmethod
    def should_intercept(self, server_address: connection.Address) -> bool:
        raise NotImplementedError()

    def record_success(self, server_address):
        self.history[server_address].append(InterceptionResult.SUCCESS)

    def record_failure(self, server_address):
        self.history[server_address].append(InterceptionResult.FAILURE)

    def record_skipped(self, server_address):
        self.history[server_address].append(InterceptionResult.SKIPPED)


class ConservativeStrategy(TlsStrategy):
    def should_intercept(self, server_address: connection.Address) -> bool:
        return InterceptionResult.FAILURE not in self.history[server_address]


class ProbabilisticStrategy(TlsStrategy):
    def __init__(self, p: float):
        self.p = p
        super().__init__()

    def should_intercept(self, server_address: connection.Address) -> bool:
        return random.uniform(0, 1) < self.p


class MaybeTls:
    strategy: TlsStrategy

    def load(self, l):
        l.add_option(
            "tls_strategy", int, 0,
            "TLS passthrough strategy. If set to 0, connections will be passed through after the first unsuccessful "
            "handshake. If set to 0 < p <= 100, connections with be passed through with probability p.",
        )

    def configure(self, updated):
        if "tls_strategy" not in updated:
            return
        if ctx.options.tls_strategy > 0:
            self.strategy = ProbabilisticStrategy(ctx.options.tls_strategy / 100)
        else:
            self.strategy = ConservativeStrategy()

    def tls_clienthello(self, data: tls.ClientHelloData):
        server_address = data.context.server.peername
        if not self.strategy.should_intercept(server_address):
            ctx.log(f"TLS passthrough: {human.format_address(server_address)}.")
            data.ignore_connection = True
            self.strategy.record_skipped(server_address)

    def tls_established_client(self, data: tls.TlsData):
        server_address = data.context.server.peername
        ctx.log(f"TLS handshake successful: {human.format_address(server_address)}")
        self.strategy.record_success(server_address)

    def tls_failed_client(self, data: tls.TlsData):
        server_address = data.context.server.peername
        ctx.log(f"TLS handshake failed: {human.format_address(server_address)}")
        self.strategy.record_failure(server_address)
        
addons = [
  FleeingLegacyProxy(),
  MaybeTls()
]