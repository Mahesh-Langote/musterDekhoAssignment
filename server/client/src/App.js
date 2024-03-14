import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
// import AllocateTask from "./components/Admin";
import AdminMain from "./components/adminMain";
import AdminViewTask from "./components/adminViewTask";

function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<Main />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/admin" exact element={<AdminMain />} />
			<Route path="/admin/view" exact element={<AdminViewTask />} />
			<Route path="/" element={<Navigate replace to="/login" />} />

		</Routes>
	);
}

export default App;
