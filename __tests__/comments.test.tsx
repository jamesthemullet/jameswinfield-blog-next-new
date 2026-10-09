import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// isomorphic-dompurify eagerly constructs a jsdom window for its Node.js
// fallback path, which pulls in an ESM-only transitive dependency Jest
// can't load. In this test environment (`jest-environment-jsdom`) a real
// `window` already exists, so mock in the real `dompurify` package bound
// to it directly — same sanitization logic, without the broken fallback.
jest.mock('isomorphic-dompurify', () => ({
  __esModule: true,
  default: require('dompurify'),
}));

import Comments from '../components/comments';

function buildComment(content: string) {
  return {
    node: {
      author: {
        node: {
          name: 'Jane Doe',
          avatar: { url: 'https://example.com/avatar.png' },
        },
      },
      id: 1,
      content,
      date: '2026-01-01T00:00:00',
    },
  };
}

describe('Comments sanitization', () => {
  it('strips a script tag from comment content', () => {
    render(<Comments comments={[buildComment('<p>Hello</p><script>alert("xss")</script>')]} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(document.querySelector('script')).not.toBeInTheDocument();
  });

  it('strips an inline event handler attribute from comment content', () => {
    render(<Comments comments={[buildComment('<img src="x" onerror="alert(1)" />')]} />);
    const img = document.querySelector('img');
    expect(img).not.toBeNull();
    expect(img).not.toHaveAttribute('onerror');
  });

  it('preserves safe markup in comment content', () => {
    render(<Comments comments={[buildComment('<p>Nice <strong>post</strong>!</p>')]} />);
    expect(screen.getByText('post')).toBeInTheDocument();
    expect(document.querySelector('strong')).toBeInTheDocument();
  });
});
