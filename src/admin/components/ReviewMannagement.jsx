import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import StarRatings from "react-star-ratings";

const ManageReviews = () => {
  const [tourId, setTourId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const fetchReviews = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/v1/review/tour/${id}`);
      const reviewData = Array.isArray(response.data) ? response.data : response.data.$values;
      setReviews(reviewData);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      toast.error("Could not load reviews.");
    }
  };

  const handleFetchReviews = () => {
    if (!tourId.trim()) {
      toast.error("Please enter a valid tour ID.");
      return;
    }
    fetchReviews(tourId);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:4000/v1/review/${reviewId}`);
      setReviews(reviews.filter((review) => review.id !== reviewId));
      toast.success("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Could not delete review.");
    }
  };

  const handleEditReview = (review) => {
    setIsEditing(true);
    setEditingReview(review);
    setNewRating(review.rating);
    setNewComment(review.comment);
  };

  const handleSaveEdit = async () => {
    if (!newRating || newRating < 1 || newRating > 5) {
      toast.error("Please enter a valid rating between 1 and 5.");
      return;
    }
    if (!newComment) {
      toast.error("Please enter a comment.");
      return;
    }

    try {
      const updatedReview = { ...editingReview, rating: newRating, comment: newComment };
      await axios.put(`http://localhost:4000/v1/review/${editingReview.id}`, updatedReview);

      setReviews(
        reviews.map((review) =>
          review.id === editingReview.id
            ? { ...review, rating: newRating, comment: newComment }
            : review
        )
      );
      toast.success("Review updated successfully!");

      // Reset form
      setIsEditing(false);
      setEditingReview(null);
      setNewRating(0);
      setNewComment("");
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Could not update review.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingReview(null);
    setNewRating(0);
    setNewComment("");
  };

  return (
    <div className="container mx-auto p-4 border border-gray-300 rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Quản lí đánh giá</h2>

      {/* Input for Tour ID */}
      <div className="mb-4">
        <label className="block mb-2">Nhập mã Tour ID:</label>
        <input
          type="text"
          value={tourId}
          onChange={(e) => setTourId(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleFetchReviews}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Tìm kiếm
        </button>
      </div>

      {reviews.length > 0 ? (
        <div>
          {reviews.map((review) => (
            <div key={review.id} className="border p-4 mb-4 bg-gray-200 rounded-lg">
              <div>
                <strong>Đánh giá:</strong>{" "}
                <StarRatings
                  rating={review.rating}
                  starRatedColor="#FF8C00"
                  numberOfStars={5}
                  name="rating"
                  starDimension="20px"
                />
              </div>
              <p>
                <strong>Bình luận:</strong> {review.comment}
              </p>
              <p>
                <em>Ngày bình luận: {new Date(review.createdAt).toLocaleDateString()}</em>
              </p>
              <div className="mt-2 flex justify-between">
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-red-500"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Không tìm thấy đánh giá nào cho Tour này!!!</p>
      )}
    </div>
  );
};

export default ManageReviews;
