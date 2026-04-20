import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CommentForm from '../components/commentForm';
import { createComment } from '../lib/api';

jest.mock('../lib/api', () => ({
  createComment: jest.fn(),
}));

const mockCreateComment = createComment as jest.MockedFunction<typeof createComment>;

function renderForm(props: Partial<Parameters<typeof CommentForm>[0]> = {}) {
  const defaults = {
    postId: 1,
    setCommentData: jest.fn(),
    newCommentPosted: false,
  };
  return render(<CommentForm {...defaults} {...props} />);
}

describe('CommentForm validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows all required field errors when submitting empty form', async () => {
    renderForm();
    fireEvent.submit(screen.getByText('Submit Comment').closest('form')!);
    await waitFor(() => {
      expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
      expect(screen.getByText('Please enter your email.')).toBeInTheDocument();
      expect(screen.getByText('Please enter your comment.')).toBeInTheDocument();
    });
  });

  it('shows email format error when email is invalid', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice', name: 'authorName' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email', name: 'authorEmail' } });
    fireEvent.change(screen.getByLabelText('Comment'), { target: { value: 'Hello', name: 'content' } });
    fireEvent.submit(screen.getByText('Submit Comment').closest('form')!);
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    });
    expect(screen.queryByText('Please enter your name.')).not.toBeInTheDocument();
    expect(screen.queryByText('Please enter your comment.')).not.toBeInTheDocument();
  });

  it('calls createComment and resets form on valid submission', async () => {
    const setCommentData = jest.fn();
    mockCreateComment.mockResolvedValue({ id: 42 } as any);
    renderForm({ setCommentData });

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice', name: 'authorName' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alice@example.com', name: 'authorEmail' } });
    fireEvent.change(screen.getByLabelText('Comment'), { target: { value: 'Great post!', name: 'content' } });
    fireEvent.submit(screen.getByText('Submit Comment').closest('form')!);

    await waitFor(() => {
      expect(mockCreateComment).toHaveBeenCalledWith(1, 'Alice', 'alice@example.com', '', 'Great post!');
      expect(setCommentData).toHaveBeenCalledWith({ id: 42 });
    });
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Comment') as HTMLTextAreaElement).value).toBe('');
  });

  it('shows API error message when createComment rejects', async () => {
    mockCreateComment.mockRejectedValue(new Error('Network error'));
    renderForm();

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Bob', name: 'authorName' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'bob@example.com', name: 'authorEmail' } });
    fireEvent.change(screen.getByLabelText('Comment'), { target: { value: 'Test', name: 'content' } });
    fireEvent.submit(screen.getByText('Submit Comment').closest('form')!);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'There was an error submitting your comment. Please try again later.',
      );
    });
  });

  it('shows thank you message when newCommentPosted is true', () => {
    renderForm({ newCommentPosted: true });
    expect(screen.getByRole('status')).toHaveTextContent('Thank you for your comment!');
  });

  it('sets aria-invalid on fields with errors', async () => {
    renderForm();
    fireEvent.submit(screen.getByText('Submit Comment').closest('form')!);
    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Comment')).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
