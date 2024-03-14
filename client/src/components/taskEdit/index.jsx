import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskEditModal({ task, onUpdate, onClose }) {
    const [updatedName, setUpdatedName] = useState(task.taskName);
    const [updatedDescription, setUpdatedDescription] = useState(task.taskDescription);
    const [updatedAllocatedTo, setUpdatedAllocatedTo] = useState(task.allocatedTo);
    const [updatedStatus, setUpdatedStatus] = useState(task.status);
    const [updatedValidity, setUpdatedValidity] = useState(task.validity);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users/list");
                setUsers(response.data);
            } catch (error) {
                setError('Error fetching users');
            }
        };

        fetchUsers();
    }, []);

    const handleUpdate = async () => {
        try {
            const updatedTask = {
                taskName: updatedName,
                taskDescription: updatedDescription,
                allocatedTo: updatedAllocatedTo,
                status: updatedStatus,
                validity: updatedValidity
            };

            // Send request to update task
            await axios.put(`http://localhost:8080/api/tasks/update/${task._id}`, updatedTask);

            // Call onUpdate function to update the task in the parent component
            onUpdate(task._id, updatedTask);

            // Close the modal
            onClose();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div>
            <h2>Edit Task</h2>
            <label>
                Task Name:
                <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                />
            </label>
            <label>
                Description:
                <textarea
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                ></textarea>
            </label>
            <label>
                Allocated To:
                <select className='dropdown'
                    value={updatedAllocatedTo}
                    onChange={(e) => setUpdatedAllocatedTo(e.target.value)}
                >
                    <option value="">Select User</option>
                    {users.map(user => (
                        <option key={user._id} value={user.email}>
                            {user.firstName} {user.lastName} ({user.email})
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Status:
                <select className='dropdown' 
                    value={updatedStatus}
                    onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                    <option value="in progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
            </label>
            <label>
                Validity:
                <input
                    type="date"
                    value={updatedValidity}
                    onChange={(e) => setUpdatedValidity(e.target.value)}
                />
            </label>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={onClose}>Cancel</button>
            {error && <p>{error}</p>}
        </div>
    );
}

export default TaskEditModal;
