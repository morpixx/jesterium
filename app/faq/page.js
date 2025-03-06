"use client";
import { useState } from 'react';

export default function FAQ() {
  const faqs = [
    { question: 'What is Jesterium?', answer: 'Jesterium is a fun and innovative crypto project that aims to bring joy to its community.' },
    { question: 'How do I connect my wallet?', answer: 'Click on the "Connect Wallet" button in the header and follow the instructions.' },
    { question: 'What is the token distribution?', answer: 'Tokenomics details are available on the Tokenomics page.' },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      <input type="text" placeholder="Search FAQs" className="search-faq" />
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3 onClick={() => toggleFAQ(index)}>{faq.question}</h3>
            {activeIndex === index && <p>{faq.answer}</p>}
          </div>
        ))}
      </div>
      <style jsx>{`
        .faq-container {
          padding: 40px;
          text-align: center;
        }
        .search-faq {
          padding: 8px;
          width: 300px;
          margin-bottom: 20px;
        }
        .faq-item {
          background: #eee;
          margin: 10px auto;
          padding: 15px;
          border-radius: 8px;
          width: 80%;
          max-width: 600px;
          text-align: left;
          cursor: pointer;
        }
        .faq-item h3 {
          margin: 0;
        }
        .faq-item p {
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}