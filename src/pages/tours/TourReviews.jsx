import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import StarRatings from "react-star-ratings";

const TourReviews = ({ tourId, setAverageRating }) => {
  const { user } = useAuth(); // Lấy user từ context xác thực
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null); // Quản lý việc chỉnh sửa đánh giá
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const vietnameseBadWords = [
      "bậy", "tục", "chửi thề", "nhảm nhí", "ngu", "điên", "nhạy cảm", "mẹ", "chúng mày", "đần", "địt", "chết"
  ]; // Danh sách từ khiếm nhã

  // Kiểm tra và thay thế các từ khiếm nhã trong bình luận
  const filterBadWords = (inputText) => {
    let filteredText = inputText;
    vietnameseBadWords.forEach((badWord) => {
      const regex = new RegExp(badWord, 'gi'); // Tạo regex không phân biệt chữ hoa và chữ thường
      filteredText = filteredText.replace(regex, (match) => '*'.repeat(match.length));
    });
    return filteredText;
  };

  // Kiểm tra người dùng đã tham gia tour này chưa
  const hasUserParticipated = user?.numberOfToursTaken > 0; // Kiểm tra số lượng tour đã tham gia
  const hasUserReviewed = reviews.some((review) => review.userId === user?.id);

  // Lấy danh sách đánh giá từ backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/v1/review/tour/${tourId}`);
        
        const reviewData = Array.isArray(response.data) ? response.data : response.data.$values;
        setReviews(reviewData);

        // Tính điểm trung bình nếu có đánh giá
        if (reviewData.length > 0) {
          const totalRating = reviewData.reduce((acc, review) => acc + review.rating, 0);
          const avgRating = totalRating / reviewData.length;
          setAverageRating(avgRating);
        } else {
          setAverageRating(0); // Nếu không có đánh giá, điểm trung bình là 0
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
        toast.error("Không thể tải đánh giá.");
      }
    };

    fetchReviews();
  }, [tourId, setAverageRating]);

  // Gửi đánh giá mới lên backend
  const handleAddReview = async () => {
    if (hasUserReviewed) {
      toast.error("Bạn chỉ có thể đánh giá một lần cho mỗi tour!");
      return;
    }

    if (!hasUserParticipated) {
      toast.error("Bạn phải tham gia ít nhất 1 tour trước khi có thể đánh giá.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Vui lòng nhập đánh giá hợp lệ (1-5 sao).");
      return;
    }
    
    // Lọc từ khiếm nhã trong bình luận
    const filteredComment = filterBadWords(comment);

    if (!filteredComment) {
      toast.error("Vui lòng nhập bình luận hợp lệ.");
      return;
    }

    try {
      const newReview = { tourId, userId: user.id, rating: parseInt(rating), comment: filteredComment };
      await axios.post("http://localhost:4000/v1/review", newReview);
    
      // Lấy lại danh sách đánh giá mới từ backend
      const response = await axios.get(`http://localhost:4000/v1/review/tour/${tourId}`);
      const reviewData = Array.isArray(response.data) ? response.data : response.data.$values;
      setReviews(reviewData);
    
      // Tính lại điểm trung bình sau khi thêm đánh giá mới
      const totalRating = reviewData.reduce((acc, review) => acc + review.rating, 0);
      const avgRating = totalRating / reviewData.length;
      setAverageRating(avgRating);
    
      toast.success("Đã thêm đánh giá thành công!");
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Lỗi khi thêm đánh giá:", error);
    
      // Kiểm tra nếu lỗi từ API (error.response)
      if (error.response) {
        const errorMessage =
          error.response.data?.message || // Lấy thông báo lỗi từ backend
          error.response.statusText || // Lấy trạng thái lỗi từ HTTP
          "Lỗi không xác định từ máy chủ.";
          toast.error(`${errorMessage}`, {
            position: "top-center",
            autoClose: 3000, // Đóng sau 3 giây
            hideProgressBar: true, // Ẩn thanh tiến trình
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
      } else if (error.request) {
        // Lỗi khi không nhận được phản hồi từ server
        toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.");
      } else {
        // Các lỗi khác
        toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
    }    
  };

  // Lưu chỉnh sửa đánh giá
  const handleSaveEdit = async () => {
    if (!newRating || newRating < 1 || newRating > 5) {
      toast.error("Vui lòng nhập đánh giá hợp lệ (1-5 sao).");
      return;
    }

    // Lọc từ khiếm nhã trong bình luận
    const filteredComment = filterBadWords(newComment);

    if (!filteredComment) {
      toast.error("Vui lòng nhập bình luận hợp lệ.");
      return;
    }

    try {
      const updatedReview = { ...editingReview, rating: newRating, comment: filteredComment };
      await axios.put(`http://localhost:4000/v1/review/${editingReview.id}`, updatedReview);

      // Cập nhật lại danh sách đánh giá sau khi chỉnh sửa
      setReviews(
        reviews.map((review) =>
          review.id === editingReview.id ? { ...review, rating: newRating, comment: filteredComment } : review
        )
      );
      toast.success("Đánh giá đã được cập nhật!");

      // Reset form chỉnh sửa
      setEditingReview(null);
      setNewComment("");
      setNewRating(0);
    } catch (error) {
      console.error("Lỗi khi cập nhật đánh giá:", error);
      toast.error("Không thể cập nhật đánh giá.");
    }
  };

  // Xóa đánh giá
  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:4000/v1/review/${reviewId}`);
      setReviews(reviews.filter((review) => review.id !== reviewId));
      toast.success("Đánh giá đã được xóa!");
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      toast.error("Không thể xóa đánh giá.");
    }
  };

  return (
    <div className="container mx-auto p-4 border border-gray-600 rounded-lg">
      {/* Phần đánh giá */}
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="border p-4 mb-4 bg-gray-200 rounded-lg">
            <div>
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
                <strong>Người dùng:</strong> {review.user?.name}
              </p>
              <p>
                <em>Ngày tạo: {new Date(review.createdAt).toLocaleDateString()}</em>
              </p>

              {/* Chỉ hiển thị nút chỉnh sửa và xóa nếu người dùng là chủ đánh giá */}
              {review.userId === user?.id && (
                <div className="mt-2 flex justify-between">
                  <button
                    onClick={() => {
                      setEditingReview(review);
                      setNewComment(review.comment); // Gán comment của review vào form
                      setNewRating(review.rating); // Gán rating của review vào form
                    }}
                    className="text-blue-500"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-500"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>Chưa có đánh giá nào cho tour này.</p>
      )}

      

      {/* Phần thêm hoặc chỉnh sửa đánh giá */}
      {user && (
        <div className="mt-8">
          <h4 className="text-2xl font-semibold mb-4">
            {editingReview ? "Chỉnh sửa đánh giá" : "Thêm đánh giá"}
          </h4>
          <div className="mb-4">
            <label className="block mb-2">Đánh giá (1-5 sao):</label>
            <StarRatings
              rating={editingReview ? newRating : rating}
              changeRating={(newRating) => (editingReview ? setNewRating(newRating) : setRating(newRating))}
              starRatedColor="#FF8C00"
              numberOfStars={5}
              name="rating"
              starDimension="20px"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Bình luận:</label>
            <textarea
              value={editingReview ? newComment : comment}
              onChange={(e) => (editingReview ? setNewComment(e.target.value) : setComment(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={editingReview ? handleSaveEdit : handleAddReview}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={hasUserReviewed} // Disable nút "Thêm đánh giá" nếu người dùng đã có đánh giá
          >
            {editingReview ? "Lưu chỉnh sửa" : "Thêm"}
          </button>
          {editingReview && (
            <button
              onClick={() => setEditingReview(null)}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Hủy
            </button>
          )}
        </div>
      )}

      {/* Phần thông tin người dùng đăng nhập */}
      {user && (
        <div className="mt-4 text-right">
          <p><strong>Đăng nhập bởi:</strong> {user.name}</p>
        </div>
      )}

      {/* Hiển thị thông báo nếu người dùng chưa đăng nhập */}
      {!user && (
        <p className="mt-4 font-semibold">
          Vui lòng <a href="/login" className="text-blue-500">đăng nhập</a> để đánh giá tour.
        </p>
      )}
    </div>
    
  );
};

export default TourReviews;
