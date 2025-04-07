import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToots,
  updateNewest,
  updateOldest,
} from "../features/toots/allTootSlice";
import SingleToot from "../components/singleToot";
import { useQueries, useQuery } from "react-query";
import { Box, Button, Layer, Spinner, Text } from "grommet";
import {
  fetchHomeByServer,
  fetchTootsByServer,
  fetchTubesByServer,
  mastodonServerList,
  peertubeServerList,
} from "./tootFunctions";
import { Up } from "grommet-icons";

function TootSection() {
  // redux hooks
  const allToots = useSelector((state) => state.allToots.value);
  const isLoading = useSelector((state) => state.allToots.loading);
  const loginToken = useSelector((state) => state.allToots.loginToken);
  const myURL = useSelector((state) => state.allToots.myURL);

  const dispatch = useDispatch();

  // react-query hooks
  const mastodonQueries = mastodonServerList.map((server) => {
    return {
      queryKey: ["server", server],
      queryFn: () => fetchTootsByServer(server),
    };
  });
  const peertubeQueries = peertubeServerList.map((server) => {
    return {
      queryKey: ["server", server],
      queryFn: () => fetchTubesByServer(server),
    };
  });

  const serverQueries = useQueries([...mastodonQueries, ...peertubeQueries]);

  const homeQuery = useQuery({
    queryKey: ["home", myURL],
    queryFn: () => fetchHomeByServer(myURL),
    enabled: loginToken != null,
  });

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
    for (let server of mastodonServerList) {
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

      {/* Spinner when loading new posts*/}
      {isLoading && (
        <Layer
          position="bottom-right"
          animation="fadeIn"
          responsive={false}
          modal={false}
          margin="large"
        >
          <Spinner />
        </Layer>
      )}
    </Box>
  );
}

export default TootSection;
