import * as React from 'react';

import { formatToTimezoneString, tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import { notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { RenderResult, act, axe, render } from '../../../__test__/test-utils';
import DesktopNotifications from '../DesktopNotifications';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('DesktopNotifications Component - accessibility tests', () => {
  it('does not have basic accessibility issues', async () => {
    let result: RenderResult | undefined;
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={notificationsToFe.resultsPage}
          onManualSend={() => {}}
          onApiKeys={() => {}}
        />
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
      result = render(
        <DesktopNotifications notifications={[]} onManualSend={() => {}} onApiKeys={() => {}} />
      );
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
      result = render(
        <DesktopNotifications notifications={[]} onManualSend={() => {}} onApiKeys={() => {}} />,
        {
          preloadedState: {
            dashboardState: {
              filters: {
                startDate: formatToTimezoneString(tenYearsAgo),
                endDate: formatToTimezoneString(today),
                iunMatch: 'ABCD-EFGH-ILMN-123456-A-1',
              },
            },
          },
        }
      );
    });
    // the rerendering must be done to take the useRef updates
    result!.rerender(
      <DesktopNotifications notifications={[]} onManualSend={() => {}} onApiKeys={() => {}} />
    );
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 15000);
});
