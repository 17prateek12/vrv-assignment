'use client';
import React, { useState, useEffect } from 'react';

const RolePage = () => {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState({
    read: false,
    write: false,
    delete: false,
    customPermissions: [], // Ensure customPermissions is always initialized as an empty array
  });

  const [customPermissionName, setCustomPermissionName] = useState(''); // For entering custom permission
  const [roles, setRoles] = useState([]);
  const [editRoleId, setEditRoleId] = useState(null); // Track which role is being edited

  // Fetch roles from local storage on component mount
  useEffect(() => {
    const savedRoles = JSON.parse(localStorage.getItem('roles')) || [];
    setRoles(savedRoles);
  }, []);

  // Save roles to local storage whenever roles change
  useEffect(() => {
    if (roles.length > 0) {
      localStorage.setItem('roles', JSON.stringify(roles));
    }
  }, [roles]);

  const handleRoleNameChange = (e) => {
    setRoleName(e.target.value);
  };

  const handlePermissionChange = (e) => {
    setPermissions({
      ...permissions,
      [e.target.name]: e.target.checked,
    });
  };

  const handleCustomPermissionChange = (e) => {
    setCustomPermissionName(e.target.value);
  };

  const handleAddCustomPermission = () => {
    if (customPermissionName && !permissions.customPermissions.includes(customPermissionName)) {
      setPermissions({
        ...permissions,
        customPermissions: [...permissions.customPermissions, customPermissionName],
      });
      setCustomPermissionName(''); // Reset custom permission input
    }
  };

  const handleDeleteCustomPermission = (permission) => {
    setPermissions({
      ...permissions,
      customPermissions: permissions.customPermissions.filter((p) => p !== permission),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!roleName) {
      alert('Role name is required!');
      return;
    }

    let updatedRoles = [...roles];

    if (editRoleId !== null) {
      // Edit an existing role
      updatedRoles = updatedRoles.map((role) => {
        if (role.id === editRoleId) {
          return {
            ...role,
            name: roleName,
            permissions,
          };
        }
        return role;
      });
      setEditRoleId(null); // Reset edit mode
    } else {
      // Create new role
      const newRole = {
        id: roles.length + 1, // In a real app, this would be handled by the backend
        name: roleName,
        permissions,
      };
      updatedRoles.push(newRole);
    }

    // Update roles and reset form
    setRoles(updatedRoles);
    setRoleName('');
    setPermissions({
      read: false,
      write: false,
      delete: false,
      customPermissions: [], // Reset custom permissions after submission
    });
  };

  // Handle role deletion
  const handleDelete = (roleId) => {
    const updatedRoles = roles.filter((role) => role.id !== roleId);
    setRoles(updatedRoles);
    localStorage.setItem('roles', JSON.stringify(updatedRoles));
  };

  // Handle role edit (populate form with role data)
  const handleEdit = (roleId) => {
    const roleToEdit = roles.find((role) => role.id === roleId);
    setRoleName(roleToEdit.name);
    setPermissions(roleToEdit.permissions);
    setEditRoleId(roleId); // Set the role to edit
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">{editRoleId ? "Edit Role" : "Create New Role"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="roleName" className="block text-gray-700">
            Role Name
          </label>
          <input
            type="text"
            id="roleName"
            className="w-full p-2 border border-gray-300 rounded"
            value={roleName}
            onChange={handleRoleNameChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Permissions</label>
          <div className="flex flex-col justify-start items-start">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="read"
                checked={permissions.read}
                onChange={handlePermissionChange}
                className="mr-2"
              />
              Read
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="write"
                checked={permissions.write}
                onChange={handlePermissionChange}
                className="mr-2"
              />
              Write
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="delete"
                checked={permissions.delete}
                onChange={handlePermissionChange}
                className="mr-2"
              />
              Delete
            </label>

            {/* Custom Permissions */}
            <div className="mt-4">
              <label htmlFor="customPermission" className="block text-gray-700">Custom Permissions</label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="customPermission"
                  className="w-3/4 p-2 border border-gray-300 rounded"
                  value={customPermissionName}
                  onChange={handleCustomPermissionChange}
                  placeholder="Enter custom permission"
                />
                <button
                  type="button"
                  className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
                  onClick={handleAddCustomPermission}
                >
                  Add
                </button>
              </div>
              <div className="mt-2">
                {permissions.customPermissions.map((permission) => (
                  <div key={permission} className="flex items-center justify-between">
                    <span>{permission}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleDeleteCustomPermission(permission)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded"
        >
          {editRoleId ? "Update Role" : "Create Role"}
        </button>
      </form>

      {/* List of existing roles */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Existing Roles</h3>
        <div className="space-y-4">
          {roles.length === 0 ? (
            <p>No roles created yet.</p>
          ) : (
            roles.map((role) => (
              <div key={role.id} className="border p-4 rounded shadow-md">
                <h4 className="font-bold text-lg">{role.name}</h4>
                <div className="mt-2">
                  <span className="font-medium">Permissions: </span>
                  <span>{role.permissions.read ? 'Read ' : ''}</span>
                  <span>{role.permissions.write ? 'Write ' : ''}</span>
                  <span>{role.permissions.delete ? 'Delete' : ''}</span>
                  {/* Safely access customPermissions */}
                  {role.permissions.customPermissions && role.permissions.customPermissions.length > 0 && (
                    <div>
                      <span className="font-medium">Custom Permissions: </span>
                      {role.permissions.customPermissions.join(', ')}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleEdit(role.id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RolePage;
