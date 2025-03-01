"use client";
export default function Community() {
    return (
      <div className="community-container">
        <h1>Community</h1>
        <p>Stay updated with our latest news and community posts.</p>
        <div className="news-feed">
          <div className="news-item">
            <h3>Latest Tweet</h3>
            <p>&quot;Jesterium is live! Join us and have fun with crypto!&quot;</p>
          </div>
          <div className="news-item">
            <h3>Developer Update</h3>
            <p>&quot;New features are rolling out. Exciting times ahead!&quot;</p>
          </div>
        </div>
        <div className="social-buttons">
          <a href="https://discord.com/" target="_blank" rel="noopener noreferrer">Discord</a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://telegram.org/" target="_blank" rel="noopener noreferrer">Telegram</a>
        </div>
        <style jsx>{`
          .community-container {
            padding: 40px;
            text-align: center;
          }
          .news-feed {
            margin: 20px 0;
          }
          .news-item {
            background: #eee;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
          }
          .social-buttons a {
            margin: 0 10px;
            text-decoration: none;
            background: #222;
            color: #fff;
            padding: 8px 12px;
            border-radius: 4px;
          }
        `}</style>
      </div>
    );
  }