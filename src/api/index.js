import { ethers } from "ethers";

const getEthereum = () => {
  const { ethereum } = window;

  if (!ethereum) {
    throw new Error("Ethereum does't not connect");
  }

  return ethereum;
};

export const getAccounts = async () => {
  try {
    const ethereum = getEthereum();
    return await ethereum.request({ method: "eth_accounts" });
  } catch (e) {
    console.log(e);
    throw new Error(e.message ? e.message : "Something went wrong");
  }
};

export const authorize = async () => {
  try {
    const ethereum = getEthereum();
    return await ethereum.request({ method: "eth_requestAccounts" });
  } catch (e) {
    console.log(e);
    throw new Error(e.message ? e.message : "Something went wrong");
  }
};

export const getMessages = async ({ address, abi }) => {
  const ethereum = getEthereum();

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const wavePortalContract = new ethers.Contract(address, abi, signer);
  const waves = await wavePortalContract.getAllWaves();

  let wavesCleaned = [];
  waves.forEach((wave) => {
    wavesCleaned.push({
      address: wave.waver,
      timestamp: new Date(wave.timestamp * 1000),
      message: wave.message,
    });
  });

  return wavesCleaned;
};

export const sendMessage = async ({ address, abi, message }) => {
  const ethereum = getEthereum();

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const wavePortalContract = new ethers.Contract(address, abi, signer);

  /*
   * Execute the actual wave from your smart contract
   */
  // const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
  await wavePortalContract.wave(message, { gasLimit: 300000 });

  // await waveTxn.wait();
};

let wavePortalContract = undefined;

export const subscribe = async ({ address, abi, emit }) => {
  const ethereum = getEthereum();

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  wavePortalContract = new ethers.Contract(address, abi, signer);
  wavePortalContract.on("NewWave", emit);
};

export const unsubscribe = async ({ emit }) => {
  if (wavePortalContract) {
    wavePortalContract.off("NewWave", emit);
  }
};
