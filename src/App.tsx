import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Technology from './pages/Technology';
import Metrics from './pages/Metrics';
import Gallery from './pages/Gallery';
import BlogListing from './pages/BlogListing';
import BlogDetail from './pages/BlogDetail';
import CategoryPage from './pages/CategoryPage';
import AuthorPage from './pages/AuthorPage';
import SearchPage from './pages/SearchPage';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="technology" element={<Technology />} />
            <Route path="metrics" element={<Metrics />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="blog" element={<BlogListing />} />
            <Route path="blog/:id" element={<BlogDetail />} />
            <Route path="blog/category/:category" element={<CategoryPage />} />
            <Route path="blog/author/:authorSlug" element={<AuthorPage />} />
            <Route path="blog/search" element={<SearchPage />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}
