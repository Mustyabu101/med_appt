import { useState } from 'react';
import GiveReviews from './GiveReviews';

export default function PatientReviews({ user }) {
  const serialNumber = `patient-review-${user.id}`;
  const storageKey = `stayhealthy_review_${user.id}`;

  const [reviewData, setReviewData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  function handleSubmitReview(newReview) {
    const updated = {
      ...reviewData,
      [serialNumber]: newReview
    };

    localStorage.setItem(storageKey, JSON.stringify(updated));
    setReviewData(updated);
  }

  return (
    <section
      className="patient-reviews"
      style={{
        margin: '32px 0',
        padding: '24px',
        border: '1px solid #dce5e5',
        borderRadius: '12px'
      }}
    >
      <h2>Patient Reviews</h2>
      <p>
        Share feedback about your experience using
        the StayHealthy demonstration application.
      </p>

      <GiveReviews
        report={{ serialNumber }}
        reviewData={reviewData}
        onSubmitReview={handleSubmitReview}
      />

      {reviewData[serialNumber] && (
        <p role="status">
          Your review has been saved in this browser.
          Thank you for your feedback.
        </p>
      )}
    </section>
  );
}
