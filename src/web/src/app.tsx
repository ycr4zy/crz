import React, { useCallback, useEffect } from 'react';
import { BrowserRouter, HashRouter as Router, Link, useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Router as Route } from "./Router";
import GlobalStyle from './styles/globalStyle';
import { defaultTheme } from "./styles/themes/default";
import { fetchNui } from './helpers/fetchNui';
import { useState } from 'react';


export function App() {

   return (
      <Router>
         <GlobalStyle />
         <ThemeProvider theme={defaultTheme}>
            <Route />
         </ThemeProvider>
      </Router>
   )
}
