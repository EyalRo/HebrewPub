import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToots, updateNewest, updateOldest } from '../features/toots/allTootSlice';

import { useQueries } from 'react-query';
import { Box, Card, CardHeader, CardBody, Button, Avatar, Text } from 'grommet';

function TootSection() {
  // redux hooks
  const allToots = useSelector((state) => state.allToots.value);
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

    // update oldest and newest toots
    for (let server of serverList) {
      dispatch(updateOldest({ [server]: allToots.filter((toot) => new URL(toot.url).hostname === server).at(-1) }));
      dispatch(updateNewest({ [server]: allToots.filter((toot) => new URL(toot.url).hostname === server).at(0) }));
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

const fetchOldTootsByServer = async (server, pointer) => {
  const res = await fetch(`https://${server}/api/v1/timelines/public?local=true&max_id=${pointer}`);
  const data = await res.json();
  return data;
};

//////////////////////////////
//        Components        //
//////////////////////////////

const SingleToot = ({ toot }) => {
  const oldest = useSelector((state) => state.allToots.oldest);
  const dispatch = useDispatch();

  useEffect(() => {
    var isOldest = oldest[new URL(toot.url).hostname] && toot.id === oldest[new URL(toot.url).hostname].id;
    var seen = false; // need to implement
    isOldest && seen && fetchOldTootsByServer(new URL(toot.url).hostname, toot.id).then((r) => dispatch(addToots(r)));
  }, [JSON.stringify(oldest), dispatch, toot]);

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
