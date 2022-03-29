import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export const TopBar = ({ accounts, onConnect }) => {
  const emptyAccounts = accounts.length === 0;

  return (
    <AppBar
      position={emptyAccounts ? "static" : "fixed"}
      color="primary"
      sx={{ top: 0, alignItems: "center" }}
    >
      <Toolbar>
        {emptyAccounts ? (
          <Button color="inherit" onClick={onConnect}>
            Connect Wallet
          </Button>
        ) : (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {accounts[0]}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};
