export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Dong Mingyan — Full-Stack Portfolio &amp; Blog. Built
          with React, Node.js, Express &amp; MongoDB.
        </p>
      </div>
    </footer>
  );
}
