import React from "react";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "@mui/material/styles";
import { Container } from "../account";
import { theme } from "../theme";

const App = () => {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <Container />
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;
