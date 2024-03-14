import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const TasksList = ({ email }) => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterStatus, setFilterStatus] = useState(""); // State for filtering task status

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/tasks", {
                    params: {
                        email: email
                    }
                });

                setTasks(response.data);
            } catch (error) {
                setError(error.response.data.message);
            }
        };

        fetchTasks();
    }, [email]);

    const handleUpdateStatus = async (taskId, newStatus) => {
        try {
            const updatedTasks = tasks.map(task => {
                if (task._id === taskId) {
                    return { ...task, status: newStatus };
                }
                return task;
            });

            setTasks(updatedTasks);

            // Make API call to update task status
            await axios.put(`http://localhost:8080/api/tasks/${taskId}`, { status: newStatus });
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (!filterStatus) {
            return true; // If no filter is applied, return all tasks
        }
        return task.status === filterStatus; // Filter tasks by status
    });

    const sortedTasks = filteredTasks.sort((a, b) => {
        if (sortOrder === "asc") {
            return a[sortBy] < b[sortBy] ? -1 : 1;
        } else {
            return a[sortBy] > b[sortBy] ? -1 : 1;
        }
    });

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleOrderChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    return (
        <div className={styles.task_container}>
            <h1 className={styles.heading}>My Tasks</h1>
            <div className={styles.filters}>
               
            </div>
            <div className={styles.sort_options}>
            <label>
                    Filter by Status:
                    <select value={filterStatus} onChange={handleFilterChange}>
                        <option value="">All</option>
                        <option value="completed">Completed</option>
                        <option value="in progress">In Progress</option>
                        <option value="pending">Pending</option> 
                    </select>
                </label>
                <label>
                    Sort by:
                    <select value={sortBy} onChange={handleSortChange}>
                        <option value="createdAt">Created At</option>
                        <option value="taskName">Task Name</option>
                        <option value="status">Status</option>
                        
                        <option value="validity">Validity</option>
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
            {error && <div className={styles.error_msg}>{error}</div>}
            <ul className={styles.task_list}>
                {sortedTasks.map(task => (
                    <li key={task._id} className={styles.task_item}>
                        <h3>{task.taskName}</h3>
                        <p>{task.taskDescription}</p>
                        <div className={styles.details}>
                            <p><strong>Allocated To:</strong> {task.allocatedTo}</p>
                            <p><strong>Status:</strong> {task.status}</p>
                            <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
                            <p><strong>Validity:</strong> {new Date(task.validity).toLocaleDateString()}</p>
                        </div>
                        <div className={styles.buttons}>
                            <button onClick={() => handleUpdateStatus(task._id, "completed")} className={styles.complete_button}>Complete</button>
                            <button onClick={() => handleUpdateStatus(task._id, "in progress")} className={styles.in_progress_button}>In Progress</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TasksList;
