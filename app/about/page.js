"use client";
export default function About() {
    return (
      <div className="about-container">
        <h1>About Jesterium</h1>
        <p>
          Jesterium is a unique project combining creativity, technology, and fun. Our mission is to
          bring smiles to people’s faces through innovative crypto initiatives.
        </p>
        <div className="animation">
          {/* Replace with an interactive illustration if available */}
          <img src="/about-animation.gif" alt="Interactive Animation" />
        </div>
        <style jsx>{`
          .about-container {
            padding: 40px;
            text-align: center;
          }
          .animation img {
            width: 400px;
            height: auto;
            margin-top: 20px;
          }
        `}</style>
      </div>
    );
  }