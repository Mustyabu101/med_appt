import { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function GiveReviews({
  report = {},
  reviewData = {},
  onSubmitReview
}) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState('5');
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const serialNumber = report?.serialNumber;
  const existingReview =
    serialNumber != null ? reviewData?.[serialNumber] : null;

  const reviewAlreadyGiven = Boolean(existingReview) || submitted;

  function handleSubmit(event, close) {
    event.preventDefault();
    setError('');

    if (reviewAlreadyGiven) return;

    if (!name.trim() || !review.trim()) {
      setError('Please complete the review form.');
      return;
    }

    if (typeof onSubmitReview !== 'function') {
      setError('Review submission is not configured.');
      return;
    }

    const newReview = {
      name: name.trim(),
      rating: Number(rating),
      review: review.trim(),
      serialNumber: serialNumber ?? null,
      submittedAt: new Date().toISOString()
    };

    try {
      onSubmitReview(newReview);
      setSubmitted(true);
      close();
    } catch (submissionError) {
      console.error('Unable to save review:', submissionError);
      setError('Unable to save your review. Please try again.');
    }
  }

  return (
    <section className="give-reviews">
      <h3>Give Your Review</h3>

      {reviewAlreadyGiven ? (
        <button type="button" disabled>
          Review Given
        </button>
      ) : (
        <Popup
          trigger={
            <button type="button">
              Open Review Form
            </button>
          }
          modal
          nested
          closeOnDocumentClick
        >
          {(close) => (
            <div
              className="review-popup"
              style={{ padding: '1rem' }}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close review form"
                style={{ float: 'right' }}
              >
                ×
              </button>

              <h3>Share Your Experience</h3>

              <form
                onSubmit={(event) => handleSubmit(event, close)}
              >
                <fieldset>
                  <legend>Review details</legend>

                  <label htmlFor="review-name">Name</label>
                  <input
                    id="review-name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                  />

                  <label htmlFor="review-rating">Rating</label>
                  <select
                    id="review-rating"
                    name="rating"
                    value={rating}
                    onChange={(event) => setRating(event.target.value)}
                    required
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>

                  <label htmlFor="review-text">Your Review</label>
                  <textarea
                    id="review-text"
                    name="review"
                    value={review}
                    onChange={(event) => setReview(event.target.value)}
                    required
                  />

                  {error && <p role="alert">{error}</p>}

                  <button type="submit">
                    Submit Review
                  </button>
                </fieldset>
              </form>
            </div>
          )}
        </Popup>
      )}
    </section>
  );
}
