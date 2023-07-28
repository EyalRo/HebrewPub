import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToots,
  updateNewest,
  updateOldest,
} from "../features/toots/allTootSlice";
import SingleToot from "../components/singleToot";
import { useQueries, useQuery } from "react-query";
import { Box, Layer, Spinner, Text } from "grommet";
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
        <Layer position="bottom-right" animation="fadeIn">
          <Spinner />
        </Layer>
      )}
    </Box>
  );
}

export default TootSection;
