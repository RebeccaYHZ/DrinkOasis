import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../assets/css/PostReview.css';

function PostReview() {
  const [barName, setBarName] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [review, setReview] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");

  const navigate = useNavigate();
  const mainContentRef = useRef(null);

  useEffect(() => {
    mainContentRef.current.focus();
    const isAuthenticated = sessionStorage.getItem("user") !== null;
    if (!isAuthenticated) {
      navigate('/Login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = { barName, location, address, review };

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Review submitted:', result);
        alert("Review added successfully!");
        setSubmitStatus("Review added successfully!");
        navigate('/Reviews');
      } else {
        const error = await response.json();
        console.error('Failed to submit review:', error.message);
        setSubmitStatus(`Failed to submit review: ${error.message}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitStatus(`Error submitting review: ${error.message}`); 
    }
  };

  return (
    <div className="post-container" ref={mainContentRef} tabIndex="-1">
      <h1>Post a Review</h1>
      {submitStatus && <div aria-live="assertive">{submitStatus}</div>}
      <form className="post-form" onSubmit={handleSubmit}>
        <label htmlFor="barName">Bar Name</label>
        <input id="barName" placeholder="Bar Name" value={barName} onChange={e => setBarName(e.target.value)} />

        <label htmlFor="location">Location</label>
        <input id="location" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />

        <label htmlFor="address">Address</label>
        <input id="address" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />

        <label htmlFor="review">Review</label>
        <textarea id="review" placeholder="Review" value={review} onChange={e => setReview(e.target.value)} />

        <button type="submit">Submit</button>
        <Link to="/Reviews" className='back-link'>Back to Reviews</Link>
      </form>
    </div>
  );
}

PostReview.propTypes = {};

export default PostReview;
