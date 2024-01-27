import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";

import Categories from "./components/Categories";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Routes nested under PrivateRoute (requires authentication) */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />

          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<CreateListing />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
