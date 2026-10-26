import { useState } from 'react';

export default function GiveReviews({
  report = {},
  reviewData = {},
  onSubmitReview
}) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState('5');
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const existingReview =
    report?.serialNumber != null
     ? reviewData?.[report.serialNumber]
      : null;
  const serialNumber = report?.serialNumber;
  const reviewAlreadyGiven = Boolean(existingReview) || submitted;

  function handleSubmit(event) {
    event.preventDefault();

    if (reviewAlreadyGiven || !name.trim() || !review.trim()) return;

    const newReview = {
      name: name.trim(),
      rating: Number(rating),
      review: review.trim(),
      serialNumber: serialNumber ?? null,
      submittedAt: new Date().toISOString()
    };

    try {
      const saved = JSON.parse(
        localStorage.getItem('stayhealthy_reviews') || '[]'
      );

      if (!Array.isArray(saved)) {
        throw new Error('Saved reviews are not in the expected format.');
      }

      localStorage.setItem(
        'stayhealthy_reviews',
        JSON.stringify([...saved, newReview])
      );

      if (typeof onSubmitReview === 'function') {
        onSubmitReview(newReview);
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Unable to save review:', error);
    }
  }

  return (
    <section className="give-reviews">
      <h2>Give Your Review</h2>

      {reviewAlreadyGiven ? (
        <button type="button" disabled>
          Review Given
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Share your experience</legend>

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

            <button type="submit">Submit Review</button>
          </fieldset>
        </form>
      )}
    </section>
  );
}
