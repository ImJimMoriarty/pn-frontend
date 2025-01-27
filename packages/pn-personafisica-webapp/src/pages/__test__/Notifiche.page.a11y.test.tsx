import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import {
  AppResponseMessage,
  ResponseEventDispatcher,
  formatToTimezoneString,
  getNextDay,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { emptyNotificationsFromBe, notificationsDTO } from '../../__mocks__/Notifications.mock';
import { RenderResult, act, axe, render } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { NOTIFICATIONS_LIST } from '../../api/notifications/notifications.routes';
import Notifiche from '../Notifiche.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Notifiche Page - accessibility tests', () => {
  let mock: MockAdapter;
  let result: RenderResult | undefined;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('does not have basic accessibility issues - no notifications', async () => {
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
        })
      )
      .reply(200, emptyNotificationsFromBe);
    await act(async () => {
      result = render(<Notifiche />);
    });
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 15000);

  it('does not have basic accessibility issues rendering the page', async () => {
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
        })
      )
      .reply(200, notificationsDTO);

    await act(async () => {
      result = render(<Notifiche />);
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);

  it('does not have basic accessibility issues rendering the page - errors on api', async () => {
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
        })
      )
      .reply(500);

    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <Notifiche />
        </>
      );
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});
