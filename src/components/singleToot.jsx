import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Card, CardHeader, CardBody, Button, Avatar, Text, CardFooter, Stack } from 'grommet';
import { addToots, cleanOldest, startLoading, stopLoading } from '../features/toots/allTootSlice';
import { fetchOldTootsByServer } from './tootFunctions';
import useOnScreen from './useOnScreen';
import Attachment from './attachment';
import { BlockQuote, Cycle, Favorite, Like, Revert } from 'grommet-icons';

const SingleToot = ({ toot }) => {
  const oldest = useSelector((state) => state.allToots.oldest);
  ///const isLoading = useSelector((state)=> state.allToots.loading)
  const dispatch = useDispatch();

  const ref = useRef();
  const onScreen = useOnScreen(ref, '500px');

  const [isOldest, setOldest] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [contentWarning, setCW] = useState(toot.sensitive || toot.spoiler_text !== '');
  const [context, setContext] = useState({ ancestors: [], descendants: [] });
  const [contextMissing, setContextMissing] = useState(true);

  useEffect(() => {
    setOldest(oldest.includes(toot.id));
    if (isOldest && onScreen) {
      setLoading(true);
      dispatch(startLoading());
      fetchOldTootsByServer(new URL(toot.url).hostname, toot.id)
        .then((r) => dispatch(addToots(r)))
        .then(() => dispatch(stopLoading()))
        .then(setLoading(false));
      dispatch(cleanOldest(toot.id));
    }
  }, [JSON.stringify(oldest), onScreen]);

  useEffect(() => {
    contextMissing &&
      getContext(toot)
        .then((res) => setContext(res))
        .then(setContextMissing(false));
  }, []);

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
      {/* Account & Toot Details */}
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

      <CardBody>
        {/* Descendents */}
        <Box width='85%' direction='column-reverse'>
          {context.descendants.map((toot) => (
            <TootForContext toot={toot} contentWarning={contentWarning} key={`ancestor_${toot.id}`} />
          ))}
        </Box>

        {contentWarning == '' ? (
          <Button href={toot.url}>
            <span dangerouslySetInnerHTML={{ __html: toot.content }} />
          </Button>
        ) : (
          <Box height='xsmall' width='full' align='center' margin={{ top: 'medium', bottom: 'medium' }}>
            <Button
              secondary
              label={`אזהרת תוכן: ${toot.spoiler_text}`}
              fill
              onClick={() => {
                setCW(!contentWarning);
              }}
            />
          </Box>
        )}
        {toot.media_attachments.length > 0 && (
          <Box>
            {toot.media_attachments.map((attachment) => (
              <Attachment key={`attachment_${attachment.id}`} attachment={attachment} contentWarning={contentWarning} />
            ))}
          </Box>
        )}

        {/* Ancestors */}
        <Box width='85%'>
          {context.ancestors
            .slice(-3)
            .reverse()
            .map((toot) => (
              <TootForContext toot={toot} contentWarning={contentWarning} key={`ancestor_${toot.id}`} />
            ))}
        </Box>
      </CardBody>

      <CardFooter margin={{ top: 'medium' }}>
        <Box direction='row' width='medium' justify='evenly'>
          <Stack anchor='top-right'>
            <Favorite size='large' />
            {toot.favourites_count > 0 && (
              <Box background='brand' pad={{ horizontal: 'xsmall' }} round>
                <Text>{toot.favourites_count}</Text>
              </Box>
            )}
          </Stack>
          <Stack anchor='top-right'>
            <Revert size='large' />
            {toot.replies_count > 0 && (
              <Box background='brand' pad={{ horizontal: 'xsmall' }} round>
                <Text>{toot.replies_count}</Text>
              </Box>
            )}
          </Stack>
          <Stack anchor='top-right'>
            <Cycle size='large' />
            {toot.reblogs_count > 0 && (
              <Box background='brand' pad={{ horizontal: 'xsmall' }} round>
                <Text>{toot.reblogs_count}</Text>
              </Box>
            )}
          </Stack>
        </Box>
      </CardFooter>
    </Card>
  );
};

export default SingleToot;

const getContext = async (toot) => {
  const myId = toot.id;
  const server = new URL(toot.account.url).hostname;

  const res = await fetch(`https://${server}/api/v1/statuses/${myId}/context`);
  const data = await res.json();
  return data;
};

const TootForContext = ({ toot, context, contentWarning }) => {
  return (
    <Box direction='row' margin={{ right: 'xsmall' }}>
      {/* Account & Toot Details */}
      <Button href={toot.account.url}>
        <Box dir='ltr' pad='small' width='75px'>
          <Avatar src={toot.account.avatar} />
          <Box flex='grow'>
            <Text>{toot.account.display_name}</Text>
          </Box>
        </Box>
      </Button>

      {/* Toot Content*/}
      <Box width='100%' background='brand'>
        {contentWarning == '' ? (
          <Button href={toot.url}>
            <span dangerouslySetInnerHTML={{ __html: toot.content }} />
          </Button>
        ) : (
          <Button secondary label={`אזהרת תוכן: ${toot.spoiler_text}`} fill />
        )}
      </Box>
    </Box>
  );
};
