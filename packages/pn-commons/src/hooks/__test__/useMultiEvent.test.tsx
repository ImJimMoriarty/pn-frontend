import React, { useState } from 'react';

import { act, fireEvent, render } from '../../test-utils';
import { useMultiEvent } from '../useMultiEvent';

interface IProps {
  count: number;
  interval: number;
}

const Component: React.FC<IProps> = ({ count, interval }) => {
  const [text, setText] = useState('');

  const [event] = useMultiEvent({
    callback: () => setText('Updated!'),
    count,
    interval,
  });

  return (
    <div>
      <button onClick={event}>Click me!</button>
      <h1>{text}</h1>
    </div>
  );
};

describe('test useMultiEvent hook', () => {
  it('call the completion callback', async () => {
    const count = 5;
    const interval = 100;
    const { getByRole } = render(<Component count={count} interval={interval} />);
    const btn = getByRole('button', { name: 'Click me!' });
    for (let index = 0; index < count; index++) {
      await new Promise((r) => setTimeout(r, 50));
      fireEvent.click(btn);
    }
    const paragraph = getByRole('heading', { name: 'Updated!' });
    expect(paragraph).toBeInTheDocument();
  });

  it("doesn't call the completion callback if event was not called enough times", async () => {
    const count = 5;
    const interval = 100;
    const { getByRole, queryByRole } = render(<Component count={count} interval={interval} />);
    const btn = getByRole('button', { name: 'Click me!' });
    for (let index = 0; index < count - 1; index++) {
      await new Promise((r) => setTimeout(r, 50));
      fireEvent.click(btn);
    }
    const paragraph = queryByRole('heading', { name: 'Updated!' });
    expect(paragraph).not.toBeInTheDocument();
  });

  it("doesn't call the completion callback if interval between event was too wide", async () => {
    const count = 5;
    const interval = 100;
    const { getByRole, queryByRole } = render(<Component count={count} interval={interval} />);
    const btn = getByRole('button', { name: 'Click me!' });
    await act(async () => {
      for (let index = 0; index < count; index++) {
        await new Promise((r) => setTimeout(r, 200));
        fireEvent.click(btn);
      }
    });
    const paragraph = queryByRole('heading', { name: 'Updated!' });
    expect(paragraph).not.toBeInTheDocument();
  });
});
