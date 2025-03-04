import  Login  from "@/components/Login"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import  Signup from './components/Signup';
import  Books  from "./components/Books";

function App() {
	const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}"); 
  const isLoggedIn =
		userInfo.token !== undefined && userInfo.token !== "";
  return (
    <BrowserRouter>
			<Routes>
      {!isLoggedIn ? (
					<>
          <Route
							path="/login"
							element={<Login/>}></Route>
      <Route
							path="/signup"
							element={<Signup/>}></Route>
              <Route
							path="*"
							element={<Navigate to="/login" />}/>
						
					</>
				) : (
					<>
						<Route
							path="/"
							element={<Books/>}/>
						
						<Route
							path="*"
							element={<Navigate to="/" />}
						/>
					</>
				)}
      
  </Routes>
		</BrowserRouter>
  );
}

export default App;
