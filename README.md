# 업그레이드 가능한 프록시 컨트랙트 프로젝트

이 프로젝트는 Solidity에서 업그레이드 가능한 스마트 컨트랙트를 구현하는 방법을 보여줍니다. 프록시 패턴을 사용하여 컨트랙트 로직을 업그레이드하면서도 상태(스토리지)를 유지하는 방법을 구현했습니다.

## 주요 컴포넌트

- **Proxy.sol**: 모든 호출을 구현 컨트랙트에 위임하는 프록시 컨트랙트로, EIP-1967 표준을 따르는 스토리지 슬롯을 사용합니다.
- **ProxyAdmin.sol**: 프록시 컨트랙트의 관리 기능(업그레이드, 관리자 변경 등)을 제공하는 컨트랙트입니다.
- **StorageSlot.sol**: 프록시 패턴에서 스토리지 충돌을 방지하기 위한 스토리지 슬롯 유틸리티입니다.
- **CounterV1**: 초기 카운터 구현으로 증가(inc) 기능만 포함합니다.
- **CounterV2**: 업그레이드된 카운터 구현으로 증가(inc) 및 감소(dec) 기능을 포함합니다.

## 기술 스택

- Solidity 0.8.29
- Hardhat 2.23.0
- OpenZeppelin Contracts 5.3.0
- OpenZeppelin Hardhat Upgrades 3.9.0
- Ethers.js 6.13.5

## 네트워크 설정

이 프로젝트는 다음 네트워크에서 테스트할 수 있습니다:

- **Hardhat 로컬 네트워크** (chainId: 31337)
- **Edutest 테스트넷** (chainId: 656476)
- **Edu 테스트넷** (chainId: 41923)

## 테스트 방법

프로젝트에는 업그레이드 기능을 검증하는 테스트 스크립트(ProxyTest.js)가 포함되어 있습니다. 테스트는 다음 단계로 진행됩니다:

1. CounterV1, CounterV2, Proxy, ProxyAdmin 컨트랙트 배포
2. Proxy의 관리자를 ProxyAdmin으로 설정
3. CounterV1 구현으로 업그레이드 및 기능 테스트
4. CounterV2 구현으로 업그레이드 및 확장된 기능 테스트

다음 명령어로 테스트를 실행할 수 있습니다:

```shell
npm install
npx hardhat init
npx hardhat test --network edu
```
