export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} weizhihao — Full-Stack Portfolio &amp; Blog. Built
          with React, Node.js, Express &amp; MongoDB.
        </p>
      </div>
    </footer>
  );
}
