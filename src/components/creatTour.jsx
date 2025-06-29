import React, { useState } from 'react';

const CreateTour = () => {
  const [tourData, setTourData] = useState({
    name: '',
    description: '',
    duration: 0,
    categoryId: 1,
    adultPrice: 0, // Giá người lớn
    childPrice: 0, // Giá trẻ em
    departureLocation: '', // Nơi khởi hành
    destination: '', // Điểm đến
    startDate: '',
    endDate: '',
    availableSlots: 0,
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTourData({
      ...tourData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setTourData({
      ...tourData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(tourData).forEach((key) => {
      formData.append(key, tourData[key]);
    });

    fetch('http://localhost:4000/v1/Tours', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        alert('Tour created successfully!');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Tour</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Tour Name</label>
          <input
            type="text"
            name="name"
            value={tourData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={tourData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Duration (days)</label>
          <input
            type="number"
            name="duration"
            value={tourData.duration}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Category</label>
          <input
            type="number"
            name="categoryId"
            value={tourData.categoryId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Giá người lớn */}
        <div>
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            name="Price"
            value={tourData.Price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Giá trẻ em */}
        <div>
          <label className="block text-gray-700">Child Price</label>
          <input
            type="number"
            name="childPrice"
            value={tourData.childPrice}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Nơi khởi hành */}
        <div>
          <label className="block text-gray-700">Departure Location</label>
          <input
            type="text"
            name="departureLocation"
            value={tourData.departureLocation}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Điểm đến */}
        <div>
          <label className="block text-gray-700">Destination</label>
          <input
            type="text"
            name="destination"
            value={tourData.destination}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={tourData.startDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={tourData.endDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Available Slots</label>
          <input
            type="number"
            name="availableSlots"
            value={tourData.availableSlots}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Tour Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Create Tour
        </button>
      </form>
    </div>
  );
};

export default CreateTour;
