import { Box, Button, Stack, Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

type Props = {
  isLogged: boolean;
  goToLogin: () => void;
  goToHomePage: () => void;
  message?: string;
  subtitle?: string;
};

const AccessDenied: React.FC<Props> = ({
  isLogged,
  goToLogin,
  goToHomePage,
  message,
  subtitle,
}) => {
  const finalMessage =
    message ??
    getLocalizedOrDefaultLabel(
      'common',
      isLogged ? 'access-denied' : 'not-logged',
      'Non hai le autorizzazioni necessarie per accedere a questa pagina'
    );
  const finalSubTitle =
    subtitle ?? (isLogged ? '' : getLocalizedOrDefaultLabel('common', 'not-logged-subtitle', ''));

  return (
    <Stack
      direction="column"
      alignItems="center"
      my={4}
      px={4}
      sx={{ minHeight: '50vh' }}
      data-testid="access-denied"
    >
      <Box mt={4}>
        <Typography align="center" color="text.primary" variant="h4" id="login-page-title">
          {finalMessage}
        </Typography>
      </Box>
      <Box my={2}>
        <Typography align="center" color="text.primary" variant="body1">
          {finalSubTitle}
        </Typography>
      </Box>

      <Box my={4}>
        <Button
          id="login-button"
          variant="contained"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isLogged ? goToHomePage() : goToLogin();
          }}
        >
          {isLogged
            ? getLocalizedOrDefaultLabel('common', 'button.go-to-home', 'Vai alla home page')
            : getLocalizedOrDefaultLabel('common', 'button.go-to-login', 'Accedi')}
        </Button>
      </Box>
    </Stack>
  );
};
export default AccessDenied;
