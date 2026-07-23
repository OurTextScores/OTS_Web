import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InspectorPanel } from '../components/InspectorPanel';

describe('InspectorPanel', () => {
  it('renders the typed property manifest and forwards validated UI values', () => {
    const onChange = vi.fn();
    render(
      <InspectorPanel
        data={{
          selectionCount: 2,
          elementType: 'Mixed',
          properties: {
            visible: { value: null, mixed: true, applicableCount: 2 },
            color: { value: '#000000', mixed: false, applicableCount: 2 },
            placement: { value: 'above', mixed: false, applicableCount: 2 },
            offsetX: { value: 0, mixed: false, applicableCount: 2 },
            offsetY: { value: 1, mixed: false, applicableCount: 2 },
            small: { value: false, mixed: false, applicableCount: 1 },
            stemDirection: { value: 'auto', mixed: false, applicableCount: 1 },
            lineStyle: { value: 'solid', mixed: false, applicableCount: 1 },
          },
        }}
        onChange={onChange}
      />,
    );

    expect(screen.getByTestId('inspector-selection-type')).toHaveTextContent('Mixed · 2 selected');
    expect(screen.getByTestId('inspector-visible')).toHaveProperty('indeterminate', true);
    fireEvent.change(screen.getByTestId('inspector-stemDirection'), { target: { value: 'down' } });
    expect(onChange).toHaveBeenCalledWith('stemDirection', 'down');
    fireEvent.blur(screen.getByTestId('inspector-offsetX'), { target: { value: '2.5' } });
    expect(onChange).toHaveBeenCalledWith('offsetX', 2.5);
  });
});
