import "./App.css";
import Newsapp from "./Components/Newsapp";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Footer from "./Components/Footer";
import React, { useEffect, useState } from "react";

function App() {
  return (
    <div>
      <Newsapp />;
      <Footer />
    </div>
  );
}

export default App;
