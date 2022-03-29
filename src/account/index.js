import React, { useEffect, useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import CssBaseline from "@mui/material/CssBaseline";
import MContainer from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import {
  authorize,
  getAccounts,
  getMessages,
  sendMessage,
  subscribe,
  unsubscribe,
} from "../api";
import { account } from "../store/account";
import { error } from "../store/error";
import { loading } from "../store/loading";
import { messages } from "../store/messages";
import { TopBar } from "../components/TopBar";
import { BottomBar } from "../components/BottomBar";
import { List } from "../components/List";
import { NotFound } from "../components/NotFound";

export const Container = () => {
  const [currentAccount, setAccount] = useRecoilState(account);
  const [currentError, setError] = useRecoilState(error);
  const [currentLoading, setLoading] = useRecoilState(loading);
  const [currentMessages, setMessages] = useRecoilState(messages);
  const [message, setMessage] = useState("");

  const init = useCallback(async () => {
    try {
      setLoading(true);
      const accounts = await getAccounts();

      setAccount({
        ...currentAccount,
        accounts,
      });

      if (accounts.length > 0) {
        const messages = await getMessages({
          address: currentAccount.address,
          abi: currentAccount.contractABI,
        });
        setMessages(messages);
      }

      setLoading(false);
      setError(undefined);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  }, [setAccount, setError]);

  const onConnect = useCallback(async () => {
    try {
      const accounts = await authorize();

      setAccount({
        ...currentAccount,
        accounts,
      });

      if (accounts.length) {
        const messages = await getMessages({
          address: currentAccount.address,
          abi: currentAccount.contractABI,
        });
        setMessages(messages);
      }
      setError(undefined);
    } catch (error) {
      setError(error.message);
    }
  }, [currentAccount, setAccount, setMessages, setError]);

  const onAdd = useCallback(async () => {
    if (message.length === 0) {
      setError("Enter some message");
      return;
    }

    if (currentLoading) {
      return;
    }

    try {
      setLoading(true);
      await sendMessage({
        address: currentAccount.address,
        abi: currentAccount.contractABI,
        message,
      });
      setError(undefined);
      setMessage("");
      setLoading(false);
    } catch (e) {
      console.log(e);
      setError("Something wend wrong");
      setLoading(false);
    }
  }, [currentAccount, message, currentLoading, setError, setLoading]);

  const handleChange = useCallback((e) => {
    setMessage(e.target.value);
  }, []);

  useEffect(init, [init]);

  useEffect(() => {
    if (currentAccount.accounts.length === 0) {
      return;
    }

    const emit = (address, timestamp, message) => {
      setMessages((messages) => [
        ...messages,
        { address, message, timestamp: new Date(timestamp * 1000) },
      ]);
    };

    (async () => {
      try {
        setError(undefined);
        await subscribe({
          emit,
          address: currentAccount.address,
          abi: currentAccount.contractABI,
        });
      } catch (e) {
        console.log(e);
        setError(e.message);
      }
    })();

    return () => {
      unsubscribe({ emit });
    };
  }, [currentAccount, setMessages, setError]);

  const criticalError =
    currentAccount.accounts.length === 0 && currentError !== undefined;

  return (
    <>
      <CssBaseline />
      {!criticalError && (
        <TopBar accounts={currentAccount.accounts} onConnect={onConnect} />
      )}

      {currentError !== undefined && currentAccount.accounts.length > 0 && (
        <Alert severity="error">{currentError}</Alert>
      )}

      {criticalError ? (
        <NotFound message={currentError} />
      ) : (
        <MContainer
          sx={{
            marginTop: "64px",
            overflow: "auto",
            height: "calc(100vh - 128px)",
          }}
          component="main"
        >
          {currentAccount.accounts.length > 0 && (
            <List messages={currentMessages} />
          )}
        </MContainer>
      )}

      {currentAccount.accounts.length > 0 && (
        <BottomBar
          value={message}
          loading={currentLoading}
          onChange={handleChange}
          onAdd={onAdd}
        />
      )}
    </>
  );
};
