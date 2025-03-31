import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Button,
  Avatar,
  Text,
  CardFooter,
  Stack,
  Accordion,
  AccordionPanel,
  List,
} from "grommet";
import {
  addToots,
  cleanOldest,
  startLoading,
  stopLoading,
} from "../features/toots/allTootSlice";
import { fetchOldTootsByServer, interactURL, replaceTokens } from "./tootFunctions";
import useOnScreen from "./useOnScreen";
import Attachment from "./attachment";
import parse from "html-react-parser";

import "./designFix.scss";

const EmbedEmojis = ({ content, emojis }) => {
  const emojiDict = emojis.reduce((dict, emoji) => {
    dict[emoji.shortcode] = emoji.url;
    return dict;
  }, {});
  var newContent = replaceTokens(content, emojiDict);
  return newContent;
};

const WrapListItem = ({ content, emojis }) => {
  return (
    <div>
      {parse(EmbedEmojis({ content: content, emojis: emojis }))}
    </div>
  );
};

const MakeContent = ({ toot }) => {
  const content = EmbedEmojis({ content: toot.content, emojis: toot.emojis });
  const options = toot.poll != null ?
    toot.poll.options.map(
      option => ({
        title: WrapListItem({ content: option.title, emojis: toot.poll.emojis }),
        votes_count: option.votes_count
      })) : null;

  return (
    <>
    {parse(content)}
    {toot.poll != null && (
      <List
        primaryKey="title"
        secondaryKey="votes_count"
        margin={{horizontal:"10%"}}
        data={options}
      />
    )}
    </>);
};

const SingleToot = ({ toot }) => {
  const oldest = useSelector((state) => state.allToots.oldest);
  ///const isLoading = useSelector((state)=> state.allToots.loading)
  const dispatch = useDispatch();

  const ref = useRef();
  const onScreen = useOnScreen(ref, "500px");

  const [isOldest, setOldest] = useState(false);

  const [contentWarning, setCW] = useState(
    toot.sensitive || toot.spoiler_text !== ""
  );
  const [context, setContext] = useState({ ancestors: [], descendants: [] });
  const [contextMissing, setContextMissing] = useState(true);

  var display_name = EmbedEmojis({
    content: toot.account.display_name,
    emojis: toot.account.emojis,
  });
  const content = (<MakeContent toot={toot}/>);
  const accountURL = interactURL(toot.account.url);
  const tootURL = interactURL(toot.url);

  useEffect(() => {
    setOldest(oldest.includes(toot.id));
    if (isOldest && onScreen) {
      dispatch(startLoading());
      fetchOldTootsByServer(new URL(toot.url).hostname, toot.id)
        .then((r) => dispatch(addToots(r)))
        .then(() => dispatch(stopLoading()));
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
      background={isOldest ? "brand" : ""}
      ref={ref}
      margin="small"
      pad="medium"
      width="100%"
      elevation="none"
      border={{
        size: "medium",
        side: "bottom",
      }}
      round={false}
    >
      {/* Account & Toot Details */}
      <Button href={accountURL}>
        <CardHeader dir="ltr" pad={{ bottom: "small" }}>
          <Box width="48px" flex={false}>
            <Avatar src={toot.account.avatar} />
          </Box>

          <Box flex>
            <Text truncate dangerouslySetInnerHTML={{ __html: display_name }} />
            <Text truncate>{`@${toot.account.username}@${
              new URL(toot.account.url).hostname
            }`}</Text>
          </Box>
          <Box width="75px" flex={false}>
            <Text>
              {new Date(toot.created_at).toLocaleTimeString("he-IL", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text dir="rtl">
              {new Date(toot.created_at).toLocaleDateString("he-IL", {
                day: "2-digit",
                month: "short",
              })}
            </Text>
          </Box>
        </CardHeader>
      </Button>

      <CardBody>
        {/* Descendents */}
        {context.descendants.length > 0 && (
          <Accordion>
            <AccordionPanel label="חדשים בשרשור">
              <Box direction="column-reverse">
                {context.descendants.map((toot) => (
                  <TootForContext
                    toot={toot}
                    contentWarning={contentWarning}
                    key={`ancestor_${toot.id}`}
                  />
                ))}
              </Box>
            </AccordionPanel>
          </Accordion>
        )}

        {contentWarning == "" ? (
      <Button dir="auto" href={tootURL}>
      {content}
          </Button>
        ) : (
          <Box
            height="xsmall"
            width="full"
            align="center"
            margin={{ top: "medium", bottom: "medium" }}
          >
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
          <Box direction="row" justify="center">
            {toot.media_attachments.map((attachment) => (
              <Attachment
                key={`attachment_${attachment.id}`}
                attachment={attachment}
                contentWarning={contentWarning}
              />
            ))}
          </Box>
        )}

        {/* Ancestors */}
        {context.ancestors.length > 0 && (
          <Accordion>
            <AccordionPanel label="קודמים בשרשור">
              <Box>
                {context.ancestors
                  .slice(-3)
                  .reverse()
                  .map((toot) => (
                    <TootForContext
                      toot={toot}
                      contentWarning={contentWarning}
                      key={`ancestor_${toot.id}`}
                    />
                  ))}
              </Box>
            </AccordionPanel>
          </Accordion>
        )}
      </CardBody>

      <CardFooter margin={{ top: "medium" }}>
        <Box direction="row" width="medium" justify="evenly">
          <Text>{`חיבובים: ${toot.favourites_count}`}</Text>
          <Text>{`תגובות: ${toot.replies_count}`}</Text>
          <Text>{`הדהודים: ${toot.reblogs_count}`}</Text>
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

const TootForContext = ({ toot }) => {
  const [contentWarning, setCW] = useState(
    toot.sensitive || toot.spoiler_text !== ""
  );

  // Fill dummy information for missing account
  if (Object.keys(toot.account).length === 0) {
    toot.account.url = window.location.href + "#";
    toot.account.display_name = "לא זמין";
    toot.account.avatar = "/unavailable512.png";
    toot.account.emojis = [];
  }

  const server = new URL(toot.account.url).hostname;

  var display_name = EmbedEmojis({
    content: toot.account.display_name,
    emojis: toot.account.emojis,
  });
  const content = (<MakeContent toot={toot}/>);
  const accountURL = interactURL(toot.account.url);
  const tootURL = interactURL(toot.url);

  return (
    <>
      <Box direction="row" margin="xsmall">
        {/* Account & Toot Details */}
        <Button href={accountURL}>
          <Box dir="ltr" pad="small" width="xsmall" margin={{ top: "18px" }}>
            <Avatar src={toot.account.avatar} alignSelf="end" />
            <Box>
              <Text
                textAlign="end"
                dangerouslySetInnerHTML={{ __html: display_name }}
              />
            </Box>
          </Box>
        </Button>

        {/* Toot Content*/}
        <Box width="100%">
          {contentWarning == "" ? (
      <Button href={tootURL}>
      {content}
            </Button>
          ) : (
            <Button
              secondary
              label={`אזהרת תוכן: ${toot.spoiler_text}`}
              fill
              onClick={() => {
                setCW(!contentWarning);
              }}
            />
          )}
        </Box>
        <Box height="xsmall" border="left" alignSelf="center" />
      </Box>
    </>
  );
};
