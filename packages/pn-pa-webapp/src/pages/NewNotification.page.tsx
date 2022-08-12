import { Fragment, useEffect, useState } from 'react';
// PN-2028
// import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { TitleBox, Prompt, useIsMobile, PnBreadcrumb } from '@pagopa-pn/pn-commons';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { createNewNotification } from '../redux/newNotification/actions';
import { setSenderInfos, resetState } from '../redux/newNotification/reducers';
import * as routes from '../navigation/routes.const';
import { TrackEventType } from '../utils/events';
import { trackEventByType } from '../utils/mixpanel';
import PreliminaryInformations from './components/NewNotification/PreliminaryInformations';
import Recipient from './components/NewNotification/Recipient';
import Attachments from './components/NewNotification/Attachments';
import PaymentMethods from './components/NewNotification/PaymentMethods';
import SyncFeedback from './components/NewNotification/SyncFeedback';

const useStyles = makeStyles(() => ({
  root: {
    '& .paperContainer': {
      boxShadow: 'none',
    },
  },
}));

const SubTitle = () => {
  const { t } = useTranslation(['common', 'notifiche']);
  return (
    <Fragment>
      {t('new-notification.subtitle', { ns: 'notifiche' })} {/* PN-2028 */}
      {t('menu.api-key')}
      {/*
        PN-2028
        <Link to={routes.API_KEYS}>{t('menu.api-key')}</Link>.
      */}
    </Fragment>
  );
};

const NewNotification = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const isMobile = useIsMobile();
  const notification = useAppSelector(
    (state: RootState) => state.newNotificationState.notification
  );
  const isCompleted = useAppSelector((state: RootState) => state.newNotificationState.isCompleted);
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);
  const organizationParty = useAppSelector((state: RootState) => state.userState.organizationParty);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common', 'notifiche']);
  const steps = [
    t('new-notification.steps.preliminary-informations.title', { ns: 'notifiche' }),
    t('new-notification.steps.recipient.title', { ns: 'notifiche' }),
    t('new-notification.steps.attachments.title', { ns: 'notifiche' }),
    t('new-notification.steps.payment-methods.title', { ns: 'notifiche' }),
  ];

  const eventStep = [
    TrackEventType.NOTIFICATION_SEND_PRELIMINARY_INFO,
    TrackEventType.NOTIFICATION_SEND_RECIPIENT_INFO,
    TrackEventType.NOTIFICATION_SEND_ATTACHMENTS,
    TrackEventType.NOTIFICATION_SEND_PAYMENT_MODES,
  ];

  const stepType = ['preliminary info', 'recipient', 'attachments', 'payment modes'];

  const handleEventTrackingCallbackPromptOpened = () => {
    trackEventByType(TrackEventType.NOTIFICATION_SEND_EXIT_WARNING, {
      source: stepType[activeStep],
    });
  };

  const handleEventTrackingCallbackCancel = () => {
    trackEventByType(TrackEventType.NOTIFICATION_SEND_EXIT_CANCEL, {
      source: stepType[activeStep],
    });
  };

  const handleEventTrackingCallbackConfirm = () => {
    trackEventByType(TrackEventType.NOTIFICATION_SEND_EXIT_FLOW, { source: stepType[activeStep] });
  };
  const goToNextStep = () => {
    trackEventByType(eventStep[activeStep]);
    setActiveStep((previousStep) => previousStep + 1);
  };

  const goToPreviousStep = (selectedStep?: number) => {
    if (selectedStep !== undefined && selectedStep >= 0 && selectedStep < activeStep) {
      setActiveStep(selectedStep);
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const createNotification = () => {
    // if it is last step, save notification
    if (activeStep === 3 && isCompleted) {
      void dispatch(createNewNotification(notification))
        .unwrap()
        .then(() => setActiveStep((previousStep) => previousStep + 1));
    }
  };

  useEffect(() => {
    createNotification();
  }, [isCompleted]);

  useEffect(() => {
    dispatch(
      setSenderInfos({
        senderDenomination: organizationParty.name,
        senderTaxId: organization.fiscal_code,
      })
    );
  }, [organization, organizationParty]);

  useEffect(() => () => void dispatch(resetState()), []);

  if (activeStep === 4) {
    return <SyncFeedback />;
  }

  return (
    <Prompt
      title={t('new-notification.prompt.title', { ns: 'notifiche' })}
      message={t('new-notification.prompt.message', { ns: 'notifiche' })}
      eventTrackingCallbackPromptOpened={handleEventTrackingCallbackPromptOpened}
      eventTrackingCallbackCancel={handleEventTrackingCallbackCancel}
      eventTrackingCallbackConfirm={handleEventTrackingCallbackConfirm}
    >
      <Box p={3}>
        <Grid container className={classes.root} sx={{ padding: isMobile ? '0 20px' : 0 }}>
          <Grid item xs={12} lg={8}>
            <PnBreadcrumb
              linkRoute={routes.DASHBOARD}
              linkLabel={t('new-notification.breadcrumb-root', { ns: 'notifiche' })}
              currentLocationLabel={t('new-notification.breadcrumb-leaf', { ns: 'notifiche' })}
              goBackLabel={t('button.indietro', { ns: 'common' })}
            />
            <TitleBox
              variantTitle="h4"
              title={t('new-notification.title', { ns: 'notifiche' })}
              sx={{ pt: '20px' }}
              subTitle={<SubTitle />}
              variantSubTitle="body1"
            ></TitleBox>
            <Typography sx={{ marginTop: '10px' }} variant="body2">
              {t('required-fields')}
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ marginTop: '60px' }}>
              {steps.map((label, index) => (
                <Step
                  key={label}
                  onClick={() => (index < activeStep ? goToPreviousStep(index) : undefined)}
                  sx={{ cursor: index < activeStep ? 'pointer' : 'auto' }}
                >
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 && (
              <PreliminaryInformations notification={notification} onConfirm={goToNextStep} />
            )}
            {activeStep === 1 && (
              <Recipient
                onConfirm={goToNextStep}
                onPreviousStep={goToPreviousStep}
                recipientsData={notification.recipientsForm}
              />
            )}
            {activeStep === 2 && (
              <Attachments
                onConfirm={goToNextStep}
                onPreviousStep={goToPreviousStep}
                attachmentsData={notification.documentsForm}
              />
            )}
            {activeStep === 3 && (
              <PaymentMethods
                onConfirm={createNotification}
                notification={notification}
                isCompleted={isCompleted}
                onPreviousStep={goToPreviousStep}
                paymentDocumentsData={notification.paymentDocumentsForm}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Prompt>
  );
};

export default NewNotification;
