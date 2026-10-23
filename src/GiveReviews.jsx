import { useState } from 'react';

export default function GiveReviews() {
  const [rating, setRating] = useState('5');
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section>
      <h2>Give Your Review</h2>

      {submitted && (
        <p role="status">Thank you! Your review has been submitted.</p>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={submitted}>
          <legend>Share your experience</legend>

          <label htmlFor="review-rating">Rating</label>
          <select
            id="review-rating"
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

          <br />

          <label htmlFor="review-text">Your Review</label>
          <textarea
            id="review-text"
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="Tell us about your experience"
            required
          />

          <br />

          <button type="submit">Submit Review</button>
        </fieldset>
      </form>
    </section>
  );
}
