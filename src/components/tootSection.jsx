import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToots,
  updateNewest,
  updateOldest,
} from "../features/toots/allTootSlice";
import SingleToot from "../components/singleToot";
import { useQueries, useQuery } from "react-query";
import { Box, Layer, Text } from "grommet";
import {
  fetchHomeByServer,
  fetchTootsByServer,
  serverList,
} from "./tootFunctions";

function TootSection() {
  // redux hooks
  const allToots = useSelector((state) => state.allToots.value);
  const isLoading = useSelector((state) => state.allToots.loading);
  const loginToken = useSelector((state) => state.allToots.loginToken);

  const dispatch = useDispatch();

  // react-query hooks
  const serverQueries = useQueries(
    serverList.map((server) => {
      return {
        queryKey: ["server", server],
        queryFn: () => fetchTootsByServer(server),
      };
    })
  );

  const homeQuery = useQuery({
    queryKey: ["home", "hardCodedKishkush"],
    queryFn: () => fetchHomeByServer(`kishkush.net`),
    enabled: loginToken != null,
  });

  const { lockScroll, unlockScroll } = useScrollLock();

  // This weird dependency array is a string version of the latest toot ids. triggers only when a new toot is fetched from any of the servers
  var latestTootString = JSON.stringify(
    serverQueries.map((query) => (query.data ? (query.data[0].id ??= 0) : 0))
  );

  useEffect(() => {
    homeQuery.isSuccess && dispatch(addToots, homeQuery.data);
    for (const query in serverQueries) {
      // add to allToots if successful
      const queryData = serverQueries[query];
      queryData.isSuccess && dispatch(addToots(queryData.data));
    }
  }, [latestTootString, dispatch]);

  useEffect(() => {
    // update oldest and newest toots
    for (let server of serverList) {
      try {
        const oldestToot = allToots
          .filter((toot) => new URL(toot.url).hostname === server)
          .at(-1).id;
        dispatch(updateOldest(oldestToot));
      } catch (error) {
        // not yet propogated
      }
      dispatch(
        updateNewest({
          [server]: allToots
            .filter((toot) => new URL(toot.url).hostname === server)
            .at(0),
        })
      );
    }
  }, [allToots.length]);

  useEffect(() => {
    if (isLoading) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }, [isLoading]);

  return (
    <Box
      alignSelf="center"
      align="center"
      background="background-contrast"
      width="large"
      round={true}
      margin="medium"
    >
      {Object.values(allToots).map((toot) => (
        <SingleToot toot={toot} key={toot.id} />
      ))}
      {isLoading && (
        <Layer
          margin="medium"
          background={{ dark: "light-2", light: "dark-2" }}
          round="large"
        >
          <Text
            size="6xl"
            textAlign="center"
            alignSelf="center"
            margin="medium"
          >
            טוען חצרוצים נוספים...
          </Text>
        </Layer>
      )}
    </Box>
  );
}

export default TootSection;

const useScrollLock = () => {
  const lockScroll = React.useCallback(() => {
    document.body.style.overflow = "hidden";
  }, []);

  const unlockScroll = React.useCallback(() => {
    document.body.style.overflow = "";
  }, []);

  return {
    lockScroll,
    unlockScroll,
  };
};
