import React from "react";
import { Link } from "react-router-dom";

const TryItOut = () => {

  function handleScrollDown() {
    window.scroll({
      top: document.body.offsetHeight,
      left: 0, 
      behavior: 'smooth',
    });
  }

  return (
    <div className="bg-white py-20 dark:bg-dark-primary ">
      <div className="main-container">
        <div className="flex md:flex-row flex-col gap-x-10 gap-y-8">
          {tryCards.map((card) => {
            const { id, title, desc } = card;
            return (
              <div className="" key={id}>
                <h2 className="title-secondary">{title}</h2>
                <p className="desc">{desc}</p>
              </div>
            );
          })}
        </div>
        <Link
          style={{ maxWidth: 357, height: 49 }}
          className="btn-primary dark:text-dark-primary mt-36 mx-auto"
          onClick={handleScrollDown}
          to="/"
        >
          Try it out
        </Link>
      </div>
    </div>
  );
};

export default TryItOut;

const tryCards = [
  {
    id: 1,
    title: "Optimized Market Maker",
    desc: "Gamut.Finance uses proprietary calculations based on the Balancer protocol to maximize the value of user liquidity while providing the best market prices for traders.",
  },
  {
    id: 2,
    title: "Impermanet Loss Solution",
    desc: "Minimizing impermanant loss means maximizing trading liquidity. Gamut.Finance offers quantifiable savings for liquidity providers.",
  },
  {
    id: 3,
    title: "Impermanet Loss Solution",
    desc: "The algorithmic emission of rewards to users ensures minimim sell side pressure for long-term growth and sustainability.",
  },
];
