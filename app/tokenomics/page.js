"use client";
export default function Tokenomics() {
    return (
      <div className="tokenomics-container">
        <h1>Tokenomics</h1>
        <p>Discover the token distribution and mechanisms behind Jesterium.</p>
        <div className="graph">
           <img src="/tokenomics-graph.png" alt="Token Distribution Graph" />
        </div>
        <ul className="details">
           <li>Emission: 1,000,000,000 tokens</li>
           <li>Allocation: Staking, Rewards, Development, Marketing</li>
           <li>Staking mechanisms include yield and liquidity incentives.</li>
        </ul>
        <style jsx>{`
          .tokenomics-container {
            padding: 40px;
            text-align: center;
          }
          .graph img {
            max-width: 600px;
            margin: 20px auto;
          }
          .details {
            list-style: none;
            padding: 0;
            font-size: 1.1rem;
          }
          .details li {
            margin: 10px 0;
          }
        `}</style>
      </div>
    );
  }