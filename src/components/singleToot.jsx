import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Card, CardHeader, CardBody, Button, Avatar, Text } from 'grommet';
import { addToots, cleanOldest } from '../features/toots/allTootSlice';
import { fetchOldTootsByServer } from './tootFunctions';
import useOnScreen from './useOnScreen';

const SingleToot = ({ toot }) => {
  const oldest = useSelector((state) => state.allToots.oldest);
  const dispatch = useDispatch();

  const ref = useRef();
  const onScreen = useOnScreen(ref, '0px');

  const [isOldest, setOldest] = useState(false);

  useEffect(() => {
    setOldest(oldest.includes(toot.id));
    if (isOldest && onScreen) {
      fetchOldTootsByServer(new URL(toot.url).hostname, toot.id).then((r) => dispatch(addToots(r)));
      dispatch(cleanOldest(toot.id));
    }
  }, [JSON.stringify(oldest), onScreen]);

  return (
    <Card
      background={isOldest ? 'brand' : ''}
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

export default SingleToot;
