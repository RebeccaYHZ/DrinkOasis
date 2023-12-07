// The methods for get, post etc are written propertly to handle all cases such as success, fail, or error

import express from "express";
import { reviewDB } from "../modules/reviewDB.js";

const router = express.Router();

// Get all reviews
router.get('/reviews', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    try {
        const reviews = await reviewDB.getAllReviews({ skip, limit });
        const totalReviews = await reviewDB.countReviews();
        res.json({
            reviews,
            currentPage: page,
            totalPages: Math.ceil(totalReviews / limit),
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Insert review
router.post('/reviews', async (req, res) => {
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: "Please log in first" });
    }
    
    try {
        const review = req.body;
        review.id = req.session.user.id;

        const result = await reviewDB.insertReview(review);
        res.status(201).json({ message: 'Review added successfully'});
    } catch (error) {
        console.error("Error inserting review:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/reviews/:reviewId', async (req, res) => {
    // Check if the user is logged in
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).send({ message: "Unauthorized access." });
    }
    
    const { reviewId } = req.params;
    const userId = req.session.user.id;
    const reviewUpdates = req.body;

    try {
        const existingReview = await reviewDB.getReviewById(reviewId);
        
        // Check if the review exists and belongs to the logged-in user
        if (!existingReview) {
            return res.status(404).send({ message: 'Review not found.' });
        }
        if (existingReview.id !== userId) {
            return res.status(403).send({ message: 'Not authorized to edit this review.' });
        }

        const updatedReview = await reviewDB.updateReview(reviewId, reviewUpdates);
        res.status(200).send(updatedReview);
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).send({ message: 'Server error.' });
    }
});

// Delete review
router.delete('/reviews/:reviewId', async (req, res) => {
    // Check if the user is logged in
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).send({ message: "Unauthorized access." });
    }
    
    const { reviewId } = req.params;
    const userId = req.session.user.id;

    try {
        const existingReview = await reviewDB.getReviewById(reviewId);
        
        // Check if the review exists and belongs to the logged-in user
        if (!existingReview) {
            return res.status(404).send({ message: 'Review not found.' });
        }
        if (existingReview.id !== userId) {
            return res.status(403).send({ message: 'Not authorized to delete this review.' });
        }

        await reviewDB.deleteReview(reviewId);
        res.status(200).send({ message: 'Review deleted successfully.' });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).send({ message: 'Server error.' });
    }
});

router.get('/session', (req, res) => {
    if (req.session && req.session.user) {
      res.json({ isAuthenticated: true, user: req.session.user });
    } else {
      res.json({ isAuthenticated: false });
    }
});


export default router;
