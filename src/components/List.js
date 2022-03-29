import React from "react";
import {
  List as MList,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Typography,
} from "@mui/material";

const toLocal = (date) => {
  var local = new Date(date);
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return local.toJSON();
};

export const List = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" component="div">
          No messages here yet
        </Typography>
      </Box>
    );
  }

  return (
    <MList sx={{ mb: 2 }}>
      {messages.map(({ address, message, timestamp, person }, id) => (
        <React.Fragment key={id}>
          <ListItem button>
            <ListItemAvatar>
              <Avatar alt="Profile Picture" src={person} />
            </ListItemAvatar>
            <ListItemText
              primary={address}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "block" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {message}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {toLocal(timestamp)}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        </React.Fragment>
      ))}
    </MList>
  );
};
