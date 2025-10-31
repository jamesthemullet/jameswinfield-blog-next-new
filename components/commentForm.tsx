import { useState } from 'react';
import { createComment } from '../lib/api';

type CommentFormProps = {
  postId: number;
  setCommentData: (comment) => void;
  newCommentPosted: boolean;
};

type CommentFormErrors = {
  authorName?: string;
  authorEmail?: string;
  content?: string;
};

export default function CommentForm({
  postId,
  setCommentData,
  newCommentPosted,
}: CommentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorUrl: '',
    content: '',
  });
  const [formErrors, setFormErrors] = useState<CommentFormErrors>({});

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors: CommentFormErrors = {};
    if (!formData.authorName) {
      errors.authorName = 'Please enter your name.';
    }
    if (!formData.authorEmail) {
      errors.authorEmail = 'Please enter your email.';
    } else if (!/\S+@\S+\.\S+/.test(formData.authorEmail)) {
      errors.authorEmail = 'Please enter a valid email address.';
    }
    if (!formData.content) {
      errors.content = 'Please enter your comment.';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const comment = await createComment(
          postId,
          formData.authorName,
          formData.authorEmail,
          formData.authorUrl,
          formData.content,
        );
        setCommentData(comment);
      } catch (error) {
        setError(error);
      }
      setFormData({
        authorName: '',
        authorEmail: '',
        authorUrl: '',
        content: '',
      });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h3 className="mb-4 text-2xl md:text-2xl font-bold tracking-tighter leading-tight">
        Add a Comment
      </h3>
      {newCommentPosted && <p>Thank you for your comment!</p>}
      {error && <p>There was an error submitting your comment. Please try again later.</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="authorName" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="authorName"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="authorName"
            autoComplete="name"
            value={formData.authorName}
            onChange={handleInputChange}
          />
          {formErrors.authorName && <p>{formErrors.authorName}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="authorEmail" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="authorEmail"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="authorEmail"
            autoComplete="email"
            value={formData.authorEmail}
            onChange={handleInputChange}
          />
          {formErrors.authorEmail && <p>{formErrors.authorEmail}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="authorUrl" className="block text-gray-700 font-bold mb-2">
            Website (optional)
          </label>
          <input
            type="url"
            id="authorUrl"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="authorUrl"
            value={formData.authorUrl}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 font-bold mb-2">
            Comment
          </label>
          <textarea
            id="content"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="content"
            value={formData.content}
            onChange={handleInputChange}></textarea>
          {formErrors.content && <p>{formErrors.content}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {loading ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>
    </div>
  );
}
