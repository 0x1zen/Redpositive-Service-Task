import { useState } from 'react';
import axios from 'axios';
const Popup = ({ isOpen, onClose }) => {
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    hobbies: ''
  });
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));

    // Validation for phone number
    if (name === 'phone') {
        if (!/^\d{10,13}$/.test(value)) {
            setPhoneError('Phone number must be between 10 to 13 digits');
        } else {
            setPhoneError('');
        }
    }

    // Validation for email
    if (name === 'email') {
        if (!/\S+@\S+\.\S+/.test(value)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
        }
    }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // Handle form submission
  const data = formData;
  console.log(data);
  try {
      const response = await axios.post('http://localhost:3000/signup', data);
      console.log('Response from server:', response.data);
      onClose();
  } catch (error) {
      console.error('Error sending data to the server:', error);
  }
};



  return (
    isOpen &&
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-lg font-bold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
            <input
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone</label>
            <input
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hobbies">Hobbies</label>
            <input
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
              type="text"
              id="hobbies"
              name="hobbies"
              value={formData.hobbies}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 mr-4"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;
