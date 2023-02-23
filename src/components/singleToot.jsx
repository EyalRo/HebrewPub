import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Card, CardHeader, CardBody, Button, Avatar, Text } from 'grommet';
import { addToots, seeToot } from '../features/toots/allTootSlice';
import { fetchOldTootsByServer } from './tootFunctions';
import useOnScreen from './useOnScreen';

const SingleToot = ({ toot }) => {
    const oldest = useSelector((state) => state.allToots.oldest);
    const seenToots = useSelector((state) => state.allToots.seenToots);
  
    const dispatch = useDispatch();
  
    const ref = useRef();
    const onScreen = useOnScreen(ref, '0px');
  
    useEffect(() => {
      var isOldest = oldest[new URL(toot.url).hostname] && toot.id === oldest[new URL(toot.url).hostname].id;
      var seen = seenToots.includes(toot.id);
      isOldest && seen && fetchOldTootsByServer(new URL(toot.url).hostname, toot.id).then((r) => dispatch(addToots(r)));
    }, [JSON.stringify(oldest), dispatch, toot]);
  
    useEffect(() => {
      var seen = seenToots.includes(toot.id);
      !seen && dispatch(seeToot(toot.id));
    }, [onScreen]);
  
    return (
      <Card
        ref={ref}
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

  export default SingleToot