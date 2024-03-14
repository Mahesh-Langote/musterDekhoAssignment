import styles from "./styles.module.css"; 
// import AllocateTask from "../Admin";
import TasksList from "../task";
import { useEffect, useState } from "react";

const Main = () => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Retrieve email from local storage
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };
    
    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>Task Management System</h1>
				<div>
				<strong>{email}</strong>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
				</div>
            </nav>
            
            <TasksList email={email} />
			{/* <AllocateTask /> */}

        </div>
    );
};

export default Main;
