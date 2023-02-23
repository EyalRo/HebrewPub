import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToots, updateNewest, updateOldest } from '../features/toots/allTootSlice';
import SingleToot from '../components/singleToot';
import { useQueries } from 'react-query';
import { Box } from 'grommet';
import { fetchTootsByServer, serverList } from './tootFunctions';

function TootSection() {
  // redux hooks
  const allToots = useSelector((state) => state.allToots.value);
  const oldestToots = useSelector((state) => state.allToots.oldest);

  const dispatch = useDispatch();

  // react-query hooks
  const serverQueries = useQueries(
    serverList.map((server) => {
      return {
        queryKey: ['server', server],
        queryFn: () => fetchTootsByServer(server),
      };
    })
  );

  // This weird dependency array is a string version of the latest toot ids. triggers only when a new toot is fetched from any of the servers
  var latestTootString = JSON.stringify(serverQueries.map((query) => (query.data ? (query.data[0].id ??= 0) : 0)));

  useEffect(() => {
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
        const oldestToot = allToots.filter((toot) => new URL(toot.url).hostname === server).at(-1).id
        dispatch(updateOldest(oldestToot))
      } catch (error) {
        // not yet propogated
      }
      dispatch(updateNewest({ [server]: allToots.filter((toot) => new URL(toot.url).hostname === server).at(0) }));
    }
  }, [allToots.length]);

  return (
    <Box alignSelf='center' align='center' background='background-contrast' width='large' round={true} margin='medium'>
      {Object.values(allToots).map((toot) => (
        <SingleToot toot={toot} key={toot.id} />
      ))}
    </Box>
  );
}

export default TootSection;
