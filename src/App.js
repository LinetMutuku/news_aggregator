import React from 'react';
import { ChakraProvider, Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SavedArticles from "./pages/SavedArticles";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
      <ChakraProvider>
        <Router>
          <Box minH="100vh" display="flex" flexDirection="column">
            <Header />
            <Box flex="1">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/saved" element={<SavedArticles />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </ChakraProvider>
  );
}

export default App;