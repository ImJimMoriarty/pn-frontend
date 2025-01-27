import { Fragment, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Box, Drawer, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TimelineNotification } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';
import {
  LegalFactId,
  NotificationDetailOtherDocument,
  NotificationDetailRecipient,
  NotificationStatusHistory,
} from '../../models';
import NotificationDetailTimelineStep from './NotificationDetailTimelineStep';

type Props = {
  recipients: Array<NotificationDetailRecipient>;
  statusHistory: Array<NotificationStatusHistory>;
  title: string;
  // legalFact can be either a LegalFactId, or a NotificationDetailOtherDocument
  // (generated from details.generatedAarUrl in ANALOG_FAILURE_WORKFLOW timeline elements).
  // Cfr. comment in the definition of INotificationDetailTimeline in src/models/NotificationDetail.ts.
  clickHandler: (legalFactId: LegalFactId | NotificationDetailOtherDocument) => void;
  historyButtonLabel: string;
  showMoreButtonLabel: string;
  showLessButtonLabel: string;
  eventTrackingCallbackShowMore?: () => void;
  disableDownloads?: boolean;
  isParty?: boolean;
};

const CustomDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: '100%',
  },
  '& .MuiTimeline-root': {
    marginTop: 0,
    paddingTop: 0,
  },
}));

/**
 * This component is responsible for rendering a timeline of notification details,
 * and it provides options to view the full timeline in a drawer for mobile users.
 * The component's render function returns a JSX structure that includes:
 * A grid container with a title.
 * A timeline of notification details (timelineComponent) based on the statusHistory prop.
 * A custom drawer component (CustomDrawer) that can be opened or closed by clicking an
 * icon. The drawer contains a copy of the timeline content, and its visibility
 * is controlled by the state variable.
 * @param recipients list of recipients
 * @param statusHistory notification macro-status history
 * @param clickHandler function called when user clicks on the download button
 * @param title title to show
 * @param historyButtonLabel label of the history button
 * @param showMoreButtonLabel label of show more button
 * @param showLessButtonLabel label of show less button
 * @param eventTrackingCallbackShowMore event tracking callback
 * @param disableDownloads for disable downloads
 * @param isParty for specific render of notification
 */
const NotificationDetailTimeline = ({
  recipients,
  statusHistory,
  clickHandler,
  title,
  historyButtonLabel,
  showMoreButtonLabel,
  showLessButtonLabel,
  eventTrackingCallbackShowMore,
  disableDownloads = false,
  isParty = true,
}: Props) => {
  const [state, setState] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile && state) {
    setState(false);
  }

  const toggleHistoryDrawer = () => {
    setState(!state);
  };

  const getPosition = (index: number): 'first' | 'last' | undefined => {
    if (index === 0) {
      return 'first';
    }
    if (index === statusHistory.length - 1) {
      return 'last';
    }
    return undefined;
  };

  const timelineComponent = statusHistory.map((t, i) => (
    <NotificationDetailTimelineStep
      timelineStep={t}
      recipients={recipients}
      position={getPosition(i)}
      clickHandler={clickHandler}
      key={`timeline_sep_${i}`}
      showMoreButtonLabel={showMoreButtonLabel}
      showLessButtonLabel={showLessButtonLabel}
      eventTrackingCallbackShowMore={eventTrackingCallbackShowMore}
      disableDownloads={disableDownloads}
      isParty={isParty}
    />
  ));

  return (
    <Fragment>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        data-testid="NotificationDetailTimeline"
      >
        <Grid item>
          <Typography
            id="notification-state"
            component="h5"
            color="text.primary"
            fontWeight={700}
            textTransform="uppercase"
            fontSize={14}
          >
            {title}
          </Typography>
        </Grid>
        {/* TODO: ripristinare quando sarà completata la issue pn-719 */}
        {/* <Grid item>
          <Button startIcon={<DownloadIcon />}>Scarica tutti gli allegati</Button>
        </Grid> */}
      </Grid>
      {/* 
      If is mobile, then render a small preview of timeline with the possibility to open the customDrawer
      */}
      <TimelineNotification>
        {isMobile && statusHistory.length > 0 ? (
          <NotificationDetailTimelineStep
            timelineStep={statusHistory[0]}
            recipients={recipients}
            position="first"
            clickHandler={clickHandler}
            historyButtonLabel={historyButtonLabel}
            showHistoryButton
            historyButtonClickHandler={toggleHistoryDrawer}
            disableDownloads={disableDownloads}
            isParty={isParty}
          />
        ) : (
          timelineComponent
        )}
      </TimelineNotification>
      <CustomDrawer
        anchor="bottom"
        open={state}
        onClose={toggleHistoryDrawer}
        data-testid="notification-history-drawer"
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3 }}
          data-testid="notification-history-drawer-content"
        >
          <Grid item>
            <Typography
              id="notification-state"
              color="text.primary"
              fontWeight={700}
              textTransform="uppercase"
              fontSize={14}
            >
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <CloseIcon
              data-testid="notification-drawer-close"
              onClick={toggleHistoryDrawer}
              sx={{
                color: 'action.active',
                width: '32px',
                height: '32px',
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ px: 3, height: 'calc(100vh - 87px)', overflowY: 'scroll' }}>
          <TimelineNotification>{timelineComponent}</TimelineNotification>
        </Box>
      </CustomDrawer>
    </Fragment>
  );
};

export default NotificationDetailTimeline;
