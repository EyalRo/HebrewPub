import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToots, updateNewest, updateOldest } from '../features/toots/allTootSlice';

import { useQueries } from 'react-query';
import { Box, Card, CardHeader, CardBody, CardFooter, Button, Avatar, Text, TextArea, Paragraph } from 'grommet';
import { Favorite, ShareOption, UserFemale } from 'grommet-icons';

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

      // update oldest toot
      if (queryData[0] !== undefined) {
        const tootURL = new URL(queryData.at(-1).url).hostname;
        const oldestToot = allToots.filter((toot) => new URL(toot.url).hostname === tootURL).at(-1);
        const needToUpdate = oldestToot?(oldestToot.date > queryData.at(-1).date):false
        needToUpdate && dispatch(updateOldest({ [`${new URL(queryData.at(-1).url).hostname}`]: queryData.at(-1).id }));
      }
    }
  }, [latestTootString, dispatch]);

  return (
    <Box align='center'>
      {Object.values(allToots).map((toot) => (
        <CardTemplate toot={toot} key={toot.id} />
      ))}
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
const CardTemplate = ({ toot }) => (
  <Card width="50vw" background='background-front' margin='medium' pad='medium'>
    <CardHeader dir='ltr'>
      <Avatar background='background-contrast'>
        <UserFemale color='text-strong' />
      </Avatar>
      <Box>
        <Text>Name</Text>
        <Text>Address</Text>
      </Box>
      <Text>time of toot</Text>
    </CardHeader>
    <CardBody border={'top'}>
      <span dangerouslySetInnerHTML={{ __html: toot.content }} />
    </CardBody>
    <CardFooter justify='start' dir='ltr'>
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
