import _ from 'lodash';

import {
  GetNotificationsParams,
  LegalFactId,
  NotificationDetailOtherDocument,
  compileRoute,
  formatFiscalCode,
} from '@pagopa-pn/pn-commons';

import { GroupStatus } from './../../models/user';

// Prefixes
const API_DELIVERY_PREFIX = 'delivery';
const API_DELIVERY_PUSH_PREFIX = 'delivery-push';
const API_EXTERNAL_REGISTRY_PREFIX = 'ext-registry';

// Segments
const API_NOTIFICATIONS_BASE = 'notifications';
const API_NOTIFICATIONS_SENT = 'sent';
const API_NOTIFICATION_CANCEL = 'cancel';
const API_NOTIFICATIONS_DOCUMENTS = 'documents';
const API_NOTIFICATIONS_DOCUMENT = 'document';
const API_NOTIFICATIONS_LEGALFACTS = 'legal-facts';
const API_NOTIFICATIONS_ATTACHMENTS = 'attachments';
const API_NOTIFICATIONS_PRELOAD = 'preload';
const API_NOTIFICATIONS_REQUESTS = 'requests';
const API_NOTIFICATIONS_PA = 'pa';
const API_VERSION_SEGMENT = 'v1';
const API_VERSION_SEGMENT_2_0 = 'v2.0';
const API_VERSION_SEGMENT_2_1 = 'v2.1';
const API_NOTIFICATIONS_GROUPS = 'groups';
const API_NOTIFICATIONS_PAYMENT = 'payment';

// Parameters
const API_NOTIFICATIONS_START_DATE_PARAMETER = 'startDate';
const API_NOTIFICATIONS_END_DATE_PARAMETER = 'endDate';
const API_NOTIFICATIONS_RECIPIENT_ID_PARAMETER = 'recipientId';
const API_NOTIFICATIONS_STATUS_PARAMETER = 'status';
const API_NOTIFICATIONS_SUBJECT_PARAMETER = 'subjectRegExp';
const API_NOTIFICATIONS_SIZE_PARAMETER = 'size';
const API_NOTIFICATIONS_NEXT_PAGES_KEY_PARAMETER = 'nextPagesKey';
const API_NOTIFICATIONS_IUN_MATCH_PARAMETER = 'iunMatch';
const API_NOTIFICATIONS_IUN_PARAMETER = 'iun';
const API_NOTIFICATIONS_DOCUMENT_INDEX_PARAMETER = 'documentIndex';
const API_NOTIFICATIONS_LEGALFACT_TYPE_PARAMETER = 'legalfactType';
const API_NOTIFICATIONS_LEGALFACT_KEY_PARAMETER = 'legalfactKey';
const API_NOTIFICATIONS_STATUS_FILTER_PARAMETER = 'statusFilter';
const API_NOTIFICATIONS_OTHER_DOCUMENT_TYPE = 'documentType';
const API_NOTIFICATIONS_ATTACHMENT_NAME_PARAMETER = 'attachmentName';
const API_NOTIFICATIONS_ATTACHMENT_IDX_PARAMETER = 'attachmentIdx';
const API_NOTIFICATIONS_RECIPIENT_INDEX_PARAMETER = 'recipientIdx';

// Paths
const API_NOTIFICATIONS_SENT_PATH = `${API_NOTIFICATIONS_BASE}/${API_NOTIFICATIONS_SENT}`;
const API_NOTIFICATION_DETAIL_PATH = `${API_NOTIFICATIONS_SENT_PATH}/:${API_NOTIFICATIONS_IUN_PARAMETER}`;
const API_NOTIFICATION_DETAIL_DOCUMENT_PATH = `${API_NOTIFICATIONS_SENT_PATH}/:${API_NOTIFICATIONS_IUN_PARAMETER}/${API_NOTIFICATIONS_ATTACHMENTS}/${API_NOTIFICATIONS_DOCUMENTS}/:${API_NOTIFICATIONS_DOCUMENT_INDEX_PARAMETER}`;
const API_NOTIFICATION_DETAIL_OTHER_DOCUMENT_PATH = `:${API_NOTIFICATIONS_IUN_PARAMETER}/${API_NOTIFICATIONS_DOCUMENT}/:${API_NOTIFICATIONS_OTHER_DOCUMENT_TYPE}`;
const API_NOTIFICATION_DETAIL_LEGALFACT_PATH = `:${API_NOTIFICATIONS_IUN_PARAMETER}/${API_NOTIFICATIONS_LEGALFACTS}/:${API_NOTIFICATIONS_LEGALFACT_TYPE_PARAMETER}/:${API_NOTIFICATIONS_LEGALFACT_KEY_PARAMETER}`;
const API_NOTIFICATION_USER_GROUPS_PATH = `${API_NOTIFICATIONS_GROUPS}`;
const API_NOTIFICATION_PRELOAD_DOCUMENT_PATH = `${API_NOTIFICATIONS_ATTACHMENTS}/${API_NOTIFICATIONS_PRELOAD}`;
const API_NOTIFICATION_PAYMENT_ATTACHMENT_PATH = `${API_NOTIFICATIONS_SENT_PATH}/:${API_NOTIFICATIONS_IUN_PARAMETER}/${API_NOTIFICATIONS_ATTACHMENTS}/${API_NOTIFICATIONS_PAYMENT}/:${API_NOTIFICATIONS_RECIPIENT_INDEX_PARAMETER}/:${API_NOTIFICATIONS_ATTACHMENT_NAME_PARAMETER}`;
const API_NOTIFICATION_CANCEL_NOTIFICATION = `${API_NOTIFICATIONS_BASE}/${API_NOTIFICATION_CANCEL}/:${API_NOTIFICATIONS_IUN_PARAMETER}`;

// APIs
export function NOTIFICATIONS_LIST(params: GetNotificationsParams) {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: API_NOTIFICATIONS_SENT_PATH,
    query: {
      [API_NOTIFICATIONS_START_DATE_PARAMETER]: params.startDate,
      [API_NOTIFICATIONS_END_DATE_PARAMETER]: params.endDate,
      [API_NOTIFICATIONS_RECIPIENT_ID_PARAMETER]: params.recipientId
        ? formatFiscalCode(params.recipientId)
        : '',
      [API_NOTIFICATIONS_STATUS_PARAMETER]: params.status || '',
      [API_NOTIFICATIONS_SUBJECT_PARAMETER]: params.subjectRegExp || '',
      [API_NOTIFICATIONS_SIZE_PARAMETER]: params.size ? params.size.toString() : '',
      [API_NOTIFICATIONS_NEXT_PAGES_KEY_PARAMETER]: params.nextPagesKey || '',
      [API_NOTIFICATIONS_IUN_MATCH_PARAMETER]: params.iunMatch || '',
    },
  });
}

export function NOTIFICATION_DETAIL(iun: string) {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: API_NOTIFICATION_DETAIL_PATH,
    version: API_VERSION_SEGMENT_2_1,
    params: {
      [API_NOTIFICATIONS_IUN_PARAMETER]: iun,
    },
  });
}

export function NOTIFICATION_DETAIL_DOCUMENTS(iun: string, documentIndex: string) {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: API_NOTIFICATION_DETAIL_DOCUMENT_PATH,
    params: {
      [API_NOTIFICATIONS_IUN_PARAMETER]: iun,
      [API_NOTIFICATIONS_DOCUMENT_INDEX_PARAMETER]: documentIndex,
    },
  });
}

export function NOTIFICATION_DETAIL_OTHER_DOCUMENTS(
  iun: string,
  otherDocument: NotificationDetailOtherDocument
) {
  return compileRoute({
    prefix: API_DELIVERY_PUSH_PREFIX,
    path: API_NOTIFICATION_DETAIL_OTHER_DOCUMENT_PATH,
    params: {
      [API_NOTIFICATIONS_IUN_PARAMETER]: iun,
      [API_NOTIFICATIONS_OTHER_DOCUMENT_TYPE]: otherDocument.documentType,
    },
  });
}

export function NOTIFICATION_DETAIL_LEGALFACT(iun: string, legalFact: LegalFactId) {
  return compileRoute({
    prefix: API_DELIVERY_PUSH_PREFIX,
    path: API_NOTIFICATION_DETAIL_LEGALFACT_PATH,
    params: {
      [API_NOTIFICATIONS_IUN_PARAMETER]: iun,
      [API_NOTIFICATIONS_LEGALFACT_TYPE_PARAMETER]: legalFact.category,
      [API_NOTIFICATIONS_LEGALFACT_KEY_PARAMETER]: legalFact.key,
    },
  });
}

export function GET_USER_GROUPS(status?: GroupStatus) {
  return compileRoute({
    prefix: `${API_EXTERNAL_REGISTRY_PREFIX}/${API_NOTIFICATIONS_PA}`,
    version: API_VERSION_SEGMENT,
    path: API_NOTIFICATION_USER_GROUPS_PATH,
    query: {
      [API_NOTIFICATIONS_STATUS_FILTER_PARAMETER]: status ?? '',
    },
  });
}

export function NOTIFICATION_PRELOAD_DOCUMENT() {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: API_NOTIFICATION_PRELOAD_DOCUMENT_PATH,
  });
}

export function CREATE_NOTIFICATION() {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    version: API_VERSION_SEGMENT_2_1,
    path: API_NOTIFICATIONS_REQUESTS,
  });
}

export function NOTIFICATION_PAYMENT_ATTACHMENT(
  iun: string,
  attachmentName: string,
  recIndex: number,
  attachmentIdx?: number
) {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: API_NOTIFICATION_PAYMENT_ATTACHMENT_PATH,
    params: {
      [API_NOTIFICATIONS_IUN_PARAMETER]: iun,
      [API_NOTIFICATIONS_ATTACHMENT_NAME_PARAMETER]: attachmentName,
      [API_NOTIFICATIONS_RECIPIENT_INDEX_PARAMETER]: recIndex.toString(),
    },
    query: {
      [API_NOTIFICATIONS_ATTACHMENT_IDX_PARAMETER]: !_.isNil(attachmentIdx)
        ? attachmentIdx.toString()
        : '',
    },
  });
}

export function CANCEL_NOTIFICATION(iun: string) {
  return compileRoute({
    prefix: API_DELIVERY_PUSH_PREFIX,
    path: API_NOTIFICATION_CANCEL_NOTIFICATION,
    version: API_VERSION_SEGMENT_2_0,
    params: {
      [API_NOTIFICATIONS_IUN_PARAMETER]: iun,
    },
  });
}
