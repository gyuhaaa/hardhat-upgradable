const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Upgradeable Proxy Test", function () {
  console.log("Using network:", network.name);
  console.log("RPC:", network.config.url);
  console.log("Chain ID:", network.config.chainId);
  console.log("Account:", network.config.accounts[0]);

  let deployer;
  let counterV1, counterV2;
  let proxy, proxyAdmin;
  let proxyAsCounter;

  before(async function () {
    [deployer] = await ethers.getSigners();
    console.log("배포자 주소:", deployer.address);

    // 1. CounterV1 배포
    const CounterV1 = await ethers.getContractFactory("CounterV1");
    counterV1 = await CounterV1.deploy();
    await counterV1.waitForDeployment();
    console.log("CounterV1 배포 주소:", await counterV1.getAddress());

    // // 2. CounterV2 배포
    const CounterV2 = await ethers.getContractFactory("CounterV2");
    counterV2 = await CounterV2.deploy();
    await counterV2.waitForDeployment();
    console.log("CounterV2 배포 주소:", await counterV2.getAddress());

    // 3. Proxy 배포
    const Proxy = await ethers.getContractFactory("Proxy");
    proxy = await Proxy.deploy();
    const receipt = await proxy.waitForDeployment();
    console.log("Proxy 배포 주소:", await proxy.getAddress());

    // 4. ProxyAdmin 배포
    const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
    proxyAdmin = await ProxyAdmin.deploy();
    await proxyAdmin.waitForDeployment();
    console.log("ProxyAdmin 배포 주소:", await proxyAdmin.getAddress());
  });

  it("1. V1 업그레이드 및 기능 테스트", async function () {
    // Proxy의 admin을 ProxyAdmin으로 변경
    let tx = await proxy.changeAdmin(await proxyAdmin.getAddress());
    await tx.wait();

    // ProxyAdmin을 통해 Proxy → CounterV1 업그레이드
    tx = await proxyAdmin.upgrade(
      await proxy.getAddress(),
      await counterV1.getAddress()
    );
    await tx.wait();

    // Proxy를 CounterV1처럼 연결
    proxyAsCounter = await ethers.getContractAt(
      "CounterV1",
      await proxy.getAddress()
    );

    // inc(), count() 함수 테스트
    expect(await proxyAsCounter.count()).to.equal(0);
    await proxyAsCounter.inc();
    expect(await proxyAsCounter.count()).to.equal(1);

    try {
      await proxyAsCounter.dec();
      expect.fail("dec()는 V1에서 존재하지 않아야 함");
    } catch (error) {
      expect(error.message).to.include("proxyAsCounter.dec is not a function");
    }
  });

  it("2. V2 업그레이드 및 dec() 포함 기능 테스트", async function () {
    // ProxyAdmin을 통해 Proxy → CounterV2 업그레이드
    const tx = await proxyAdmin.upgrade(
      await proxy.getAddress(),
      await counterV2.getAddress()
    );
    await tx.wait();

    // Proxy를 CounterV2처럼 연결
    proxyAsCounter = await ethers.getContractAt(
      "CounterV2",
      await proxy.getAddress()
    );

    // inc(), dec(), count() 함수 테스트
    expect(await proxyAsCounter.count()).to.equal(1);
    await proxyAsCounter.inc();
    expect(await proxyAsCounter.count()).to.equal(2);
    await proxyAsCounter.dec();
    expect(await proxyAsCounter.count()).to.equal(1);
  });
});
