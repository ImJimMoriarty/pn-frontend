import { createSlice } from '@reduxjs/toolkit';
import {
  NotificationStatus,
  NotificationDetail,
  NotificationDetailDocument,
  NotificationDetailPayment,
  NotificationDetailRecipient,
  NotificationDetailTimeline,
  NotificationStatusHistory,
  PhysicalCommunicationType,
} from '@pagopa-pn/pn-commons';

import {
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationLegalfact,
} from './actions';

/* eslint-disable functional/immutable-data */
const notificationSlice = createSlice({
  name: 'notificationSlice',
  initialState: {
    loading: false,
    notification: {
      iun: '',
      paNotificationId: '',
      subject: '',
      sentAt: '',
      cancelledIun: '',
      cancelledByIun: '',
      recipients: [] as Array<NotificationDetailRecipient>,
      documents: [] as Array<NotificationDetailDocument>,
      payment: {} as NotificationDetailPayment,
      notificationStatus: '' as NotificationStatus,
      notificationStatusHistory: [] as Array<NotificationStatusHistory>,
      timeline: [] as Array<NotificationDetailTimeline>,
      physicalCommunicationType: '' as PhysicalCommunicationType,
    } as NotificationDetail,
    documentDownloadUrl: '',
    legalFactDownloadUrl: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getReceivedNotification.fulfilled, (state, action) => {
      state.notification = action.payload;
    });
    builder.addCase(getReceivedNotificationDocument.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getReceivedNotificationDocument.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.documentDownloadUrl = action.payload.url;
      }
    });
    builder.addCase(getReceivedNotificationLegalfact.fulfilled, (state, action) => {
      if (action.payload.url) {
        state.legalFactDownloadUrl = action.payload.url;
      }
    });
  },
});

export default notificationSlice;