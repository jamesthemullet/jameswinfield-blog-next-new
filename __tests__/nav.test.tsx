import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Nav from '../components/nav';

jest.mock('next/link', () => {
  const MockLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const mockUseRouter = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => mockUseRouter(),
}));

function renderNav(pathname: string) {
  mockUseRouter.mockReturnValue({ pathname });
  return render(<Nav />);
}

describe('Nav active link highlighting', () => {
  it('highlights the home link when on /', () => {
    renderNav('/');
    expect(screen.getByText('Me')).toHaveClass('text-my-yellow');
    expect(screen.getByText('Blog')).not.toHaveClass('text-my-yellow');
    expect(screen.getByText('Projects')).not.toHaveClass('text-my-yellow');
    expect(screen.getByText('Timeline')).not.toHaveClass('text-my-yellow');
  });

  it('highlights the blog link when on /blog', () => {
    renderNav('/blog');
    expect(screen.getByText('Me')).not.toHaveClass('text-my-yellow');
    expect(screen.getByText('Blog')).toHaveClass('text-my-yellow');
    expect(screen.getByText('Projects')).not.toHaveClass('text-my-yellow');
    expect(screen.getByText('Timeline')).not.toHaveClass('text-my-yellow');
  });

  it('highlights the projects link when on /projects', () => {
    renderNav('/projects');
    expect(screen.getByText('Me')).not.toHaveClass('text-my-yellow');
    expect(screen.getByText('Blog')).not.toHaveClass('text-my-yellow');
    expect(screen.getByText('Projects')).toHaveClass('text-my-yellow');
    expect(screen.getByText('Timeline')).not.toHaveClass('text-my-yellow');
  });

  it('highlights the timeline link when on /timeline', () => {
    renderNav('/timeline');
    expect(screen.getByText('Me')).not.toHaveClass('text-my-yellow');
    expect(screen.getByText('Blog')).not.toHaveClass('text-my-yellow');
    expect(screen.getByText('Projects')).not.toHaveClass('text-my-yellow');
    expect(screen.getByText('Timeline')).toHaveClass('text-my-yellow');
  });

  it('highlights no link on an unmatched route', () => {
    renderNav('/posts/some-post');
    expect(screen.getByText('Me')).not.toHaveClass('text-my-yellow');
    expect(screen.getByText('Blog')).not.toHaveClass('text-my-yellow');
    expect(screen.getByText('Projects')).not.toHaveClass('text-my-yellow');
    expect(screen.getByText('Timeline')).not.toHaveClass('text-my-yellow');
  });
});

describe('Nav mobile toggle', () => {
  it('toggles aria-expanded on the hamburger button', () => {
    renderNav('/');
    const button = screen.getByRole('button', { name: 'Toggle navigation menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the menu when Escape is pressed on the button', () => {
    renderNav('/');
    const button = screen.getByRole('button', { name: 'Toggle navigation menu' });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(button, { key: 'Escape' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
