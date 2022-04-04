import { RenderResult } from '@testing-library/react';

import { render } from '../../../test-utils';
import { NotificationDetailTableRow } from '../../../types/NotificationDetail';
import NotificationDetailTable from '../NotificationDetailTable';

describe('NotificationDetailTable Component', () => {
  let result: RenderResult | undefined;

  const detailRows: Array<NotificationDetailTableRow> = [
    { id: 1, label: 'Data', value: `mocked-date` },
    { id: 2, label: 'Termini di pagamento', value: `Entro il` },
    { id: 3, label: 'Destinatario', value: `mocked-taxId` },
    { id: 4, label: 'Cognome Nome', value: `mocked-denomination` },
    { id: 5, label: 'Mittente', value: `mocked-sender` },
    { id: 6, label: 'Codice IUN annullato', value: `mocked-cancelledIun` },
    { id: 7, label: 'Codice IUN', value: `mocked-iun` },
    { id: 8, label: 'Gruppi', value: '' },
  ];

  beforeEach(() => {
    // render component
    result = render(<NotificationDetailTable rows={detailRows}/>);
  });

  afterEach(() => {
    result = undefined;
  });

  it('renders NotificationDetailTable', () => {
    const table = result?.container.querySelector('table');
    expect(table).toBeInTheDocument(); 
    expect(table).toHaveAttribute('aria-label', 'notification detail');
    const rows = table?.querySelectorAll('tr');
    expect(rows).toHaveLength(detailRows.length);
    rows?.forEach((row, index) => {
      const columns = row.querySelectorAll('td');
      expect(columns).toHaveLength(2);
      expect(columns[0]).toHaveTextContent(detailRows[index].label);
      expect(columns[1]).toHaveTextContent(detailRows[index].value as string);
    });
  });
});