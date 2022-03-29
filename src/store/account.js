import { atom, selector } from "recoil";
import abi from "../account/WavePortal.json";

export const account = atom({
  key: "account",
  default: {
    address: "0xf3b8Ca467C133c4496C7B3DAf10cf3A1F345AAEA",
    contractABI: abi.abi,
    accounts: [],
  },
});

export const accountName = selector({
  key: "accountName",
  get: ({ get }) => {
    const accounts = get(account);

    console.log(accounts);

    return accounts.length > 0 ? accounts[0] : { account: "No Account" };
  },
});
