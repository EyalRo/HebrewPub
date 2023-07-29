import { Box, CardFooter, Text } from "grommet";
import React from "react";

const TootFooter = (toot) => {
  return (
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
