import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BlogDetails from "./pages/BlogDetails";
import Category from "./pages/Category";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Footer from "./pages/Footer";
import Navbar from "./components/Navbar";
import QueryProvider from "./context/QueryProvider";
import SearchResults from "./pages/SearchResults";
import AdminArticlePage from "./pages/AdminArticlePage";  // New import

function App() {
  return (
    <QueryProvider>
      <Router>
        <div className="main-container">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/articles/:id" element={<BlogDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/category/:id" element={<Category />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/admin/articles" element={<AdminArticlePage />} />  {/* New Route */}
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </QueryProvider>
  );
}

export default App;
