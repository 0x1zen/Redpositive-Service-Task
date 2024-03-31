import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from './PopUp';
import SuccessPopup from '../components/SuccessPopUp';

function Table() {
    const [users, setUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage the popup window
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    useEffect(() => {
        axios.get('http://localhost:3000/')
            .then(response => {
                setUsers(response.data.users);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleSelectAll = () => {
        if (selectAll) {
            const updatedUsers = users.map(user => ({
                ...user,
                selected: false
            }));
            setUsers(updatedUsers);
        }
        setSelectAll(!selectAll);
    };
    
    const handleCheckboxChange = (userId) => {
        const updatedUsers = users.map(user => {
            if (user.uid === userId) {
                user.selected = !user.selected;
            }
            return user;
        });
        setUsers(updatedUsers);
    };

    // Function to open the popup window
    const openPopup = () => {
        setIsPopupOpen(true);
    };

    // Function to close the popup window
    const closePopup = () => {
        setIsPopupOpen(false);
        setShowSuccessPopup(true);
        setTimeout(() => {
            window.location.reload();
        }, 2500);
    };

    return (
        <div className="overflow-x-auto">
            <table className="table-auto min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" checked={selectAll} onChange={handleSelectAll} />
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hobbies</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update/Delete</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                        <tr key={user.uid}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" 
                                checked={user.selected || selectAll} onChange={() => handleCheckboxChange(user.uid)} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.uid}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.hobbies}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button className="text-indigo-600 hover:text-indigo-900">Update</button>
                                <button className="text-red-600 hover:text-red-900 ml-2">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-8">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded mb-4 mr-4" onClick={openPopup}>Add</button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded mb-4">Send</button>
            </div>
            {showSuccessPopup && <SuccessPopup message="User added successfully!Refreshing Page" />} {/* Conditional rendering of SuccessPopup */}
            <Popup isOpen={isPopupOpen} onClose={closePopup} />
        </div>
    );
}

export default Table;
