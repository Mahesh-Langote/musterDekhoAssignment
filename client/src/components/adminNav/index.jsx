import React from 'react'

import styles from "./styles.module.css";

function adminNav() {

  return (
    <>
      <nav className={styles.navbar}>
        <h1>Task Management System</h1>
        <div>
                <a href='/admin'>Add</a>
                <a href='/admin/view'>View</a>
                </div>
				 
        <div>
          {/* <strong>{email}</strong> */}
          <button className={styles.white_btn} >
            Logout
          </button>
        </div>
      </nav>

    </>
  )
}

export default adminNav
