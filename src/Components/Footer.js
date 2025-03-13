import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-4">
      <div className="container">
        <p className="mb-0">© 2024 Informed. All rights reserved.</p>
        <p className="mb-0">
          <a href="/privacy" className="text-light text-decoration-none">
            Privacy Policy
          </a>{" "}
          |
          <a href="/terms" className="text-light text-decoration-none mx-2">
            Terms of Service
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
