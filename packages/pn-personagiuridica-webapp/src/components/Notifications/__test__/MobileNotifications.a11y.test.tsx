import * as React from 'react';

import { formatToTimezoneString, tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import { notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { RenderResult, act, axe, render } from '../../../__test__/test-utils';
import MobileNotifications from '../MobileNotifications';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('MobileNotifications Component - accessibility tests', () => {
  it('does not have basic accessibility issues', async () => {
    let result: RenderResult | undefined;
    await act(async () => {
      result = await render(<MobileNotifications notifications={notificationsToFe.resultsPage} />);
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 15000);

  it('does not have basic accessibility issues - delegate access', async () => {
    let result: RenderResult | undefined;
    await act(async () => {
      result = await render(
        <MobileNotifications notifications={notificationsToFe.resultsPage} isDelegatedPage />
      );
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 15000);

  it('does not have basic accessibility issues (empty notifications)', async () => {
    let result: RenderResult | undefined;
    await act(async () => {
      result = await render(<MobileNotifications notifications={[]} />);
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 15000);

  it('does not have basic accessibility issues (empty notifications after filter)', async () => {
    let result: RenderResult | undefined;
    await act(async () => {
      result = render(<MobileNotifications notifications={[]} />, {
        preloadedState: {
          dashboardState: {
            filters: {
              startDate: formatToTimezoneString(tenYearsAgo),
              endDate: formatToTimezoneString(today),
              iunMatch: 'ABCD-EFGH-ILMN-123456-A-1',
            },
          },
        },
      });
    });
    // the rerendering must be done to take the useRef updates
    result!.rerender(<MobileNotifications notifications={[]} />);
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 15000);
});
