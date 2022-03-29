import React, { useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Paper,
  InputBase,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

export const BottomBar = ({ value, loading, onAdd, onChange }) => {
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onAdd();
      }
    },
    [onAdd]
  );

  return (
    <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
      <Toolbar>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            value={value}
            placeholder="Write a message"
            onKeyPress={handleKeyPress}
            onChange={onChange}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton color="primary" sx={{ p: "10px" }} onClick={onAdd}>
            {loading ? <CircularProgress size={22} /> : <SendIcon />}
          </IconButton>
        </Paper>
      </Toolbar>
    </AppBar>
  );
};
