import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToots, updateNewest, updateOldest } from '../features/toots/allTootSlice';

import { useQueries } from 'react-query';
import { Box, Card, CardHeader, CardBody, CardFooter, Button, Avatar, Text, TextArea, Paragraph } from 'grommet';
import { Cycle, Favorite, ShareOption, UserFemale, Chat } from 'grommet-icons';

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
        const needToUpdate = oldestToot ? oldestToot.date > queryData.at(-1).date : false;
        needToUpdate && dispatch(updateOldest({ [`${new URL(queryData.at(-1).url).hostname}`]: queryData.at(-1).id }));
      }
    }
  }, [latestTootString, dispatch]);

  return (
    <Box alignSelf='center' align='center' background='background-contrast' width='large' round={true} margin='medium'>
      {Object.values(allToots).map((toot) => (
        <SingleToot toot={toot} key={toot.id} />
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
//        Functions         //
//////////////////////////////

const fetchTootsByServer = async (server) => {
  const res = await fetch(`https://${server}/api/v1/timelines/public?local=true`);
  const data = await res.json();
  return data;
};

//////////////////////////////
//        Components        //
//////////////////////////////

const SingleToot = ({ toot }) => {
  return (
    <Card
      margin='small'
      pad='medium'
      width='100%'
      elevation='none'
      border={{
        size: 'medium',
        side: 'bottom',
      }}
      round={false}>
      <Button href={toot.account.url}>
        <CardHeader dir='ltr' pad={{ bottom: 'small' }}>
          <Avatar src={toot.account.avatar} />
          <Box flex='grow'>
            <Text>{toot.account.display_name}</Text>
            <Text>{`@${toot.account.username}@${new URL(toot.account.url).hostname}`}</Text>
          </Box>
          <Box>
            <Text>{new Date(toot.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</Text>
            <Text dir='rtl'>
              {new Date(toot.created_at).toLocaleDateString('he-IL', { day: '2-digit', month: 'short' })}
            </Text>
          </Box>
        </CardHeader>
      </Button>
      <Button href={toot.url}>
        <CardBody>
          <span dangerouslySetInnerHTML={{ __html: toot.content }} />
        </CardBody>
      </Button>
     
    </Card>
  );
};
