import React from 'react';
import { render } from '@testing-library/react-native';
import PianoBlackKey from '@/components/PianoBlackKey';

describe('PianoBlackKey', () => {
  it('renders without crashing', () => {
    render(<PianoBlackKey note="C#" offset="14%" />);
  });

  it('renders with custom width', () => {
    render(<PianoBlackKey note="C#" offset="14%" width="10%" />);
  });

  it('renders correctly when pressed', () => {
    render(<PianoBlackKey note="F#" offset="57%" isPressed={true} />);
  });

  it('renders correctly when not pressed', () => {
    render(<PianoBlackKey note="F#" offset="57%" isPressed={false} />);
  });

  it('accepts numeric offset and width', () => {
    render(<PianoBlackKey note="D#" offset={30} width={20} />);
  });
});
