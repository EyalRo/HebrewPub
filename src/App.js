import React, { useState } from "react";
import OAuth2Login from "react-simple-oauth2-login/dist/OAuth2Login";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import {
  Grommet,
  grommet,
  Header,
  Button,
  Text,
  Page,
  PageContent,
  PageHeader,
  Box,
} from "grommet";
import { deepMerge } from "grommet/utils";
import { Moon, Sun } from "grommet-icons";

import TootSection from "./components/tootSection";
import { serverList } from "./components/tootFunctions";

const onSuccess = response => console.log(`success: ${response}`);
const onFailure = response => console.error(response);

function App() {
  const [dark, setDark] = useState(true);
  const queryClient = new QueryClient();

  return (
    <Grommet full theme={theme} dir="rtl" themeMode={dark ? "dark" : "light"}>
      <Page>
        <header className="App-header">
          <AppBar>
            <Text size="large">פדעברי: הפדיברס העברי</Text>
            <Box direction="row">
              <Button
                a11yTitle={
                  dark ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
                icon={dark ? <Moon /> : <Sun />}
                onClick={() => setDark(!dark)}
              />
              <Text alignSelf="center">כניסה לחשבון בקשקוש.נט (נסיוני)</Text>
              <OAuth2Login
                authorizationUrl="https://kishkush.net/oauth/authorize"
                responseType="code"
                clientId="qK9NvU3B7JQrt7vFa2OzKhOiLNge9kKvIcgA_gsRUVM"
                redirectUri="http://localhost:3000/oauth-callback"
                onSuccess={onSuccess}
                onFailure={onFailure}
              />
            
            </Box>
          </AppBar>
        </header>

        <PageContent>
          <PageHeader title={"פדעברי: הפדיברס העברי"} />
          <Text>
            בשביל לכתוב סטאטוס חדש, לעשות לייק או לפרסם סטאטוס קיים יש צורך
            להרשם. קל להרשם בכל אחד מהשרתים של הפדיברס העברי. בכדי להרשם, יש
            לבחור את אחד השרתים:
          </Text>
          <Box direction="row" alignSelf="center" gap="small">
            {serverList
              .sort(() => Math.random() - 0.5)
              .map((server) => (
                <Button label={server} href={`//${server}`} />
              ))}
          </Box>
          <QueryClientProvider client={queryClient}>
            <TootSection />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </PageContent>
      </Page>
    </Grommet>
  );
}

export default App;

//////////////////////////////
// Theme for the entire app //
//////////////////////////////
const theme = deepMerge(grommet, {
  global: {
    colors: {
      brand: "#484848",
    },
  },
});

//////////////////////////////
//        Components        //
//////////////////////////////

// Top Bar
const AppBar = (props) => (
  <Header
    background="brand"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="medium"
    {...props}
  />
);
