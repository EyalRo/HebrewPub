import { useState } from 'react';
import { Text, Box, Image, Button, Layer } from 'grommet';
import { Blurhash } from 'react-blurhash';

const Attachment = ({ attachment, contentWarning }) => {
  const [showModal, setShowModal] = useState(false);

  if (attachment.type === 'image') {
    return (
      <Box height='small' width='small' overflow='hidden' margin='xsmall' flex='shrink'>
        <Box>
          <Button
            secondary
            alignSelf='center'
            onClick={() => {
              setShowModal(true);
            }}>
            {contentWarning ? (
              <Blurhash
                hash={attachment.blurhash}
                width={attachment.meta.small.width}
                height={attachment.meta.small.height}
                resolutionX={32}
                resolutionY={32}
                punch={1}
              />
            ) : (
              <Image fit='cover' src={attachment.preview_url} />
            )}
          </Button>
        </Box>

        {showModal && (
          <Layer onEsc={() => setShowModal(false)} onClickOutside={() => setShowModal(false)}>
            <Button onClick={() => setShowModal(false)}>
              <Box height={{ max: '100vh' }}>
                <Image fit='contain' src={attachment.url} />
              </Box>
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
