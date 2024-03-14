import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const AllocateTask = () => {
    const [data, setData] = useState({
        taskName: "",
        taskDescription: "",
        allocatedTo: "", // Change this to an object to hold user data
        validity: ""
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [users, setUsers] = useState([]); // State to hold the list of registered users

    useEffect(() => {
       
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users/list");
                setUsers(response.data);  
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = ({ target }) => {
        setData({ ...data, [target.name]: target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/tasks";
            const { data: res } = await axios.post(url, data);
            setSuccessMessage(res.message); // Set success message

            setData({
                taskName: "",
                taskDescription: "",
                allocatedTo: "",
                validity: ""
            });
            
 
            setTimeout(() => {
                setSuccessMessage("");
            }, 4000);

            // Optionally, perform any other actions after successful submission
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message); // Set error message
            }
        }
    };

    return (
        <div className={styles.task_container}>
 
            

            <h1>Allocate Task To The User</h1>
            <form className={styles.form_container} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Task Name"
                    name="taskName"
                    value={data.taskName}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
                <textarea
                    placeholder="Task Description"
                    name="taskDescription"
                    value={data.taskDescription}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
                {/* Use a dropdown or autocomplete input to select the user */}
                <select
                    name="allocatedTo"
                    value={data.allocatedTo}
                    onChange={handleChange}
                    required
                    className={styles.input}
                >
                    <option value="">Select User</option>
                    {users.map(user => (
                        <option key={user._id} value={user.email}>{user.firstName} {user.lastName} {'('+user.email+')'} </option>
                    ))}
                </select>
                <input
                    type="date"
                    placeholder="Validity"
                    name="validity"
                    value={data.validity}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
                {error && <div className={styles.error_msg}>{error}</div>} {/* Show error message */}
                <button type="submit" className={styles.green_btn}>
                    Allocate Task
                </button>
                {successMessage && <div className={styles.success_msg}>{successMessage}</div>} {/* Show success message */}
           
            </form>
        </div>
    );
};

export default AllocateTask;
