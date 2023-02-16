import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToots, updateNewest } from '../features/toots/allTootSlice';

import { useQueries } from 'react-query';
import { Box, Card, CardHeader, CardBody, CardFooter, Button } from 'grommet';
import { Favorite, ShareOption } from 'grommet-icons';

function TootSection() {
  // redux hooks
  const allToots = useSelector((state) => state.allToots.value);
  const newest = useSelector((state) => state.allToots.newest);
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
      // add to allToots
      const queryData = (serverQueries[query].data ??= []);
      dispatch(addToots(queryData));

      // update newest toot
      queryData[0] !== undefined &&
        dispatch(updateNewest({ [`${new URL(queryData[0].url).hostname}`]: queryData[0].id }));
    }
  }, [latestTootString, dispatch]);

  return (
    <Box align='center'>
      <CardTemplate title={'Card 1'} />
      <CardTemplate title={'Card 2'} />
      <CardTemplate title={'Card 3'} />
    </Box>
  );
}

export default TootSection;

//////////////////////////////
// List of Fedivri Servers  //
//////////////////////////////
const serverList = ['tooot.im', 'kishkush.net'];

//////////////////////////////
//        Components        //
//////////////////////////////

// A Single Toot
const CardTemplate = ({ title }) => (
  <Card height='small' width='large' background='light-1' margin='xsmall'>
    <CardHeader pad='medium'>Header</CardHeader>
    <CardBody pad='medium'>Body</CardBody>
    <CardFooter pad={{ horizontal: 'small' }} background='light-2'>
      <Button icon={<Favorite color='red' />} hoverIndicator />
      <Button icon={<ShareOption color='plain' />} hoverIndicator />
    </CardFooter>
  </Card>
);

//////////////////////////////
//        Functions         //
//////////////////////////////

const fetchTootsByServer = async (server) => {
  const res = await fetch(`https://${server}/api/v1/timelines/public?local=true&limit=10`);
  const data = await res.json();
  return data;
};
