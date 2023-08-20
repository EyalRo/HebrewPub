import React, { useEffect, useState } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { useSelector, useDispatch } from "react-redux";
import { setToken, clearToken, setURL } from "./features/toots/allTootSlice";

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
import { Moon, Sun, UserExpert } from "grommet-icons";

import TootSection from "./components/tootSection";
import { serverList } from "./components/tootFunctions";
import LoginButton from "./components/loginButton";

function App() {
  const [dark, setDark] = useState(true);
  const queryClient = new QueryClient();

  const dispatch = useDispatch();
  const loginCode = useSelector((state) => state.allToots.loginToken);

  useEffect(() => {
    // Set my URL in state
    const myURL = window.location.hostname;
    setURL(myURL);

    // Get token from URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const urlCode = urlParams.get("code");
    urlParams.delete("code"); // TBD: Update the actual URL bar

    // Get token from local storage
    const storedCode = localStorage.getItem("Fedicode");

    // set the best available token
    const code = storedCode ? storedCode : urlCode ? urlCode : null;
    dispatch(setToken(code));
  }, []);

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
              <LoginButton />
            </Box>
          </AppBar>
        </header>

        <PageContent>
          <PageHeader title={"פדעברי: הפדיברס העברי"} />
          {!loginCode && (
            <>
              <Text>
                בשביל לכתוב סטאטוס חדש, לעשות לייק או לפרסם סטאטוס קיים יש צורך
                להרשם. קל להרשם בכל אחד מהשרתים של הפדיברס העברי. בכדי להרשם, יש
                לבחור את אחד השרתים:
              </Text>
              <Box
                direction="row"
                alignSelf="center"
                gap="small"
                margin="small"
                wrap={true}
              >
                {serverList
                  .filter((server) => server != `tooot.im`)
                  .sort(() => Math.random() - 0.5)
                  .map((server) => (
                    <Button
                      key={`id_${server}`}
                      label={server}
                      href={`//${server}`}
                    />
                  ))}
              </Box>
              <Text alignSelf="center">
                הפדרציה עובדת טוב יותר עם שרתים יחסית קטנים וקהילתיים שמפתחים
                אופי משלהם ולא כשכולם באותו מקום. אם תחפצו בכך ניתן להרשם גם
                לשרת <Button label={`tooot.im`} href={`//tooot.im`} /> אבל
                מכיוון שרשומים בו מעלה ממחצית המשתמשים בשפה העברית אנו ממליצים
                להרשם לשרת אחר.
              </Text>
            </>
          )}
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
