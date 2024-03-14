import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./styles.module.css";
import TaskEditModal from '../taskEdit';
import adminNav from '../adminNav';

function AdminViewTask() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [error, setError] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const handleLogout = () => { 
        window.location = "/";
    };
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/tasks/alltasks");
                setTasks(response.data);
            } catch (error) {
                setError(error.response.data.message);
            }
        };

        fetchTasks();
    }, []);

    useEffect(() => {
        // Apply sorting
        const sortedTasks = tasks.sort((a, b) => {
            const sortOrderValue = sortOrder === 'asc' ? 1 : -1;
            return sortOrderValue * (a[sortBy] > b[sortBy] ? 1 : -1);
        });

        // Apply search filtering
        const filtered = sortedTasks.filter(task => {
            return task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.allocatedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.status.toLowerCase().includes(searchTerm.toLowerCase());
        });

        setFilteredTasks(filtered);
    }, [tasks, sortBy, sortOrder, searchTerm]);

    const handleUpdate = async (taskId, updatedTask) => {
        try {
            await axios.put(`http://localhost:8080/api/tasks/${taskId}`, updatedTask);
            // Update the task in the local state
            const updatedTasks = tasks.map(task => {
                if (task._id === taskId) {
                    return { ...task, ...updatedTask };
                }
                return task;
            });
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`http://localhost:8080/api/tasks/${taskId}`);
            // Remove the deleted task from the local state
            const filteredTasks = tasks.filter(task => task._id !== taskId);
            setTasks(filteredTasks);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleOpenEditModal = (task) => {
        setEditingTask(task);
    };

    const handleCloseEditModal = () => {
        setEditingTask(null);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleOrderChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'green';
            case 'in progress':
                return 'orange';
            case 'pending':
                return 'red';
            default:
                return 'black'; // Default color
        }
    };

    return (
        <>
        
        
             <nav className={styles.navbar}>
                <h1>Task Management System</h1>
                <div>
                <a href='/admin'>Add</a>
                <a href='/admin/view'>View</a>
                </div>
				<div> 
                <button className={styles.white_btn} onClick={handleLogout} >
                    Logout
                </button>
				</div>
            </nav>
             <div className={styles.containerr}>
            <h1>All Tasks</h1>
            {error && <p>{error}</p>}
            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Search tasks"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <label>
                    Sort by:
                    <select value={sortBy} onChange={handleSortChange}>
                        <option value="createdAt">Created At</option>
                        <option value="taskName">Task Name</option>
                        <option value="allocatedTo">Allocated To</option>
                        <option value="status">Status</option>
                    </select>
                </label>
                <label>
                    Order:
                    <select value={sortOrder} onChange={handleOrderChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Task Name</th>
                        <th>Allocated To</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Validity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.map(task => (
                        <tr key={task._id}>
                            <td>{task.taskName}</td>
                            <td>{task.allocatedTo}</td>
                            <td>
                                <span style={{ color: getStatusColor(task.status) }}>&#11044;</span>
                                {task.status}
                            </td>
                            <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                            <td>{new Date(task.validity).toLocaleDateString()}</td>
                            <td className={styles.tableActions}>
    <button className={styles.editButton} onClick={() => handleOpenEditModal(task)}>Edit</button>
    <button className={styles.deleteButton} onClick={() => handleDelete(task._id)}>Delete</button>
</td>

                        </tr>
                    ))}
                </tbody>
            </table>
            {editingTask && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modal}>
                        <TaskEditModal
                            task={editingTask}
                            onUpdate={handleUpdate}
                            onClose={handleCloseEditModal}
                        />
                    </div>
                </div>
            )}
        </div>
        </>
    );
}

export default AdminViewTask;
