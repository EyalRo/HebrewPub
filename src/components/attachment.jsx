import { useState } from 'react';
import { Text, Box, Image, Button, Layer } from 'grommet';

const Attachment = ({ attachment }) => {
  const [showModal, setShowModal] = useState(false);

  if (attachment.type == 'image') {
    return (
      <Box>
        <Button
          secondary
          alignSelf='center'
          onClick={() => {
            setShowModal(true);
          }}>
          <Image fit='cover' src={attachment.preview_url} />
        </Button>

        {showModal && (
          <Layer onEsc={() => setShowModal(false)} onClickOutside={() => setShowModal(false)}>
            <Button  onClick={() => setShowModal(false)}>
              <Image fit='cover' src={attachment.url} />
            </Button>
          </Layer>
        )}
      </Box>
    );
  } else {
    return <Text key={`${attachment.type}_${attachment.id}`}>{`${attachment.type}_${attachment.id}`}</Text>;
  }
};

export default Attachment;
