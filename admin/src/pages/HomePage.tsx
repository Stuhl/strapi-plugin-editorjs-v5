import { Main, Typography } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import {Box} from "@strapi/design-system"

import { getTranslation } from '../utils/getTranslation';

const HomePage = () => {
  const { formatMessage } = useIntl();

  return (
    <Main padding={10}>
      <Typography variant={"alpha"} as={"h1"}>
        Editor JS
      </Typography>
      <Typography>
        The settings for the plugin
      </Typography>
      <Box marginTop={8}>
        <Typography>
          At the moment, there are no settings you can change. This might change in the future! Keep an eye out on the Github page.
        </Typography>
      </Box>
    </Main>
  );
};

export { HomePage };
