* Uses ENet for UDP communication (not KCP like latest versions of the game)
* UDP 데이터 교환에 ENet 사용 (게임 최신 버전에서처럼 KCP를 사용하지 않음)

* Seems like first 10 bytes are headers
* 첫 10바이트는 헤더라고 판단됨

* First 2 bytes are something constant per message category? or command? or some ID?
* 첫 2바이트는 메시지 카테고리에 따른 상수? 아니면 커맨드나 ID같은 무언가?

0FFF66E9C56A44FF000200000003 - 패킷값 고정
