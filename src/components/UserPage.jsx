'use client';
import React, { useState, useEffect } from 'react';

const UserPage = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [assignedRole, setAssignedRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null); // Track which user is being edited

  // Fetch roles and users from local storage on component mount
  useEffect(() => {
    const savedRoles = JSON.parse(localStorage.getItem('roles')) || [];
    setRoles(savedRoles);

    // Fetch existing users from localStorage, if any
    const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(savedUsers);
  }, []);

  // Handle form submission (for adding or editing users)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if form fields are filled
    if (!userName || !userEmail || !assignedRole) {
      alert("Please fill in all fields.");
      return;
    }

    let updatedUsers = [...users];

    if (editUserId !== null) {
      // Edit an existing user
      updatedUsers = updatedUsers.map((user) => {
        if (user.id === editUserId) {
          return {
            ...user,
            name: userName,
            email: userEmail,
            roleId: assignedRole,
          };
        }
        return user;
      });
      setEditUserId(null); // Reset edit mode
    } else {
      // Create new user
      const newUser = {
        id: users.length + 1,  // Simple logic to assign unique ID
        name: userName,
        email: userEmail,
        roleId: assignedRole, // Assigned role id
      };
      updatedUsers.push(newUser);
    }

    // Save users in localStorage (to persist across page reloads)
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Reset form fields
    setUserName('');
    setUserEmail('');
    setAssignedRole('');
  };

  // Handle user deletion
  const handleDelete = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  // Handle user edit (populate form with user data)
  const handleEdit = (userId) => {
    const userToEdit = users.find(user => user.id === userId);
    setUserName(userToEdit.name);
    setUserEmail(userToEdit.email);
    setAssignedRole(userToEdit.roleId);
    setEditUserId(userId);  // Set the user to edit
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">{editUserId ? "Edit User" : "Add New User"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="userName" className="block text-gray-700">User Name</label>
          <input
            type="text"
            id="userName"
            className="w-full p-2 border border-gray-300 rounded"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="userEmail" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="userEmail"
            className="w-full p-2 border border-gray-300 rounded"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700">Assign Role</label>
          <select
            id="role"
            className="w-full p-2 border border-gray-300 rounded"
            value={assignedRole}
            onChange={(e) => setAssignedRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded"
        >
          {editUserId ? "Update User" : "Add User"}
        </button>
      </form>

      {/* Display the list of added users */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Users List</h3>
        {users.length === 0 ? (
          <p>No users added yet.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => {
              const userRole = roles.find((role) => role.id === parseInt(user.roleId));
              return (
                <li key={user.id} className="border p-4 rounded shadow-md">
                  <h4 className="font-bold text-lg">{user.name}</h4>
                  <p>Email: {user.email}</p>
                  <p>Role: {userRole ? userRole.name : "Role not found"}</p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserPage;
