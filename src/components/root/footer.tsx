import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        textAlign: "center",
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderTop: "1px solid #dee2e6",
      }}
    >
      <p style={{ margin: 0 }}>
        &copy; {currentYear} PHAT MENGHOR. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
