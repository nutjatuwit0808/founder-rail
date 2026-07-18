// Template — rename `Component` to match the real component before use.
import { render } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders without crashing', () => {
    render(<Component />);
  });
});
