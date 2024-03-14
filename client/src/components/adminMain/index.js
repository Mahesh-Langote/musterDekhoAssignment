import React, { useEffect, useState } from 'react';
import styles from "./styles.module.css";
import AllocateTask from "../Admin"; 


function AdminMain() {
    const handleLogout = () => { 
        window.location = "/";
    };
    
    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>Task Management System</h1>
                <div>
                <a href='/admin'>Add</a>
                <a href='/admin/view'>View</a>
                </div>
				
				<div> 
                <button className={styles.white_btn} onClick={handleLogout}  >
                    Logout
                </button>
				</div>
            </nav>
             
			
            <AllocateTask />
 

        </div>
    );
};

export default AdminMain;
