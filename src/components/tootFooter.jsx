import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, CardFooter, Text, Stack, Button } from "grommet";
import { Favorite, Next, Cycle } from "grommet-icons";

const TootFooter = (payload) => {
  const [liked, setLiked] = useState(false);

  const loginToken = useSelector((state) => state.allToots.loginToken);
  const loggedIn = loginToken != null;
  const toot = payload.toot;
  return loggedIn ? (
    <CardFooter margin={{ top: "medium" }}>
      <Box direction="row" width="medium" justify="evenly">
        {/* Like/Star/Heart */}
        <Button
          onClick={() => {
            setLiked(!liked);
          }}
        >
          <Stack anchor="bottom-right">
            <Favorite size={liked ? "large" : "medium"} color="Red" />
            <Box
              margin={{ horizontal: "small" }}
              pad={{ horizontal: "xsmall" }}
              background="brand"
              round
            >
              <Text size="small">{toot.favourites_count}</Text>
            </Box>
          </Stack>
        </Button>
        {/* Replies/Threads/Posts */}
        <Stack anchor="bottom-right">
          <Next size="medium" />
          <Box
            margin={{ horizontal: "small" }}
            pad={{ horizontal: "xsmall" }}
            background="brand"
            round
          >
            <Text size="small">{toot.replies_count}</Text>
          </Box>
        </Stack>
        {/* Reblogs/Retoot */}
        <Stack anchor="bottom-right">
          <Cycle size="medium" />
          <Box
            margin={{ horizontal: "small" }}
            pad={{ horizontal: "xsmall" }}
            background="brand"
            round
          >
            <Text size="small">{toot.reblogs_count}</Text>
          </Box>
        </Stack>
      </Box>
    </CardFooter>
  ) : (
    <CardFooter margin={{ top: "medium" }}>
      <Box direction="row" width="medium" justify="evenly">
        <Text>{`חיבובים: ${toot.favourites_count}`}</Text>
        <Text>{`תגובות: ${toot.replies_count}`}</Text>
        <Text>{`הדהודים: ${toot.reblogs_count}`}</Text>
      </Box>
    </CardFooter>
  );
};

export default TootFooter;

const favourite = async (tootID, token) => {
  const domain = `kishkush.net`
  const response = await fetch(
    `${window.location.protocol}//${domain}/api/v1/statuses/${tootID}/favourite`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
