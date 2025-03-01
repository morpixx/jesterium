"use client";
export default function Roadmap() {
    return (
      <div className="roadmap-container">
        <h1>Roadmap</h1>
        <p>Check out our future milestones and phases.</p>
        <div className="milestones">
          <div className="milestone">
            <h2>Show Kickoff</h2>
            <p>The beginning of our journey.</p>
          </div>
          <div className="milestone">
            <h2>First Act</h2>
            <p>Initial token launch and community building.</p>
          </div>
          <div className="milestone">
            <h2>Main Act</h2>
            <p>Full deployment of platform features.</p>
          </div>
        </div>
        <style jsx>{`
          .roadmap-container {
            padding: 40px;
            text-align: center;
          }
          .milestones {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
          }
          .milestone {
            background: #ffcc00;
            padding: 20px;
            border-radius: 8px;
            width: 250px;
          }
        `}</style>
      </div>
    );
  }