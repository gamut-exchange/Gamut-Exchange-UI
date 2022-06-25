import React from "react";
import { Link } from "react-router-dom";
import twitter from "../../images/social/twitter.svg";
import discord from "../../images/social/discord.svg";
import telegram from "../../images/social/telegram.svg";
import git from "../../images/social/git.svg";
import icon1 from "../../images/support/icon1.svg";
import icon2 from "../../images/support/icon2.svg";
import icon3 from "../../images/support/icon3.svg";
import icon4 from "../../images/support/icon4.svg";

const Header = () => {

  return (
    <div className="py-24 bg-white-bg dark:bg-dark-primary dark:bg-opacity-95">
      <div className="main-container">
        <div className="flex flex-col justify-center items-center">
          <div>
            <h1 className="text-light-primary mb-4 font-bold text-[50px] sm:text-[60px] md:text-[100px] lg:text-[120px] lg:leading-[155px] text-center">
              GAMUT EXCHANGE
            </h1>
            <p className="text-grey-dark text-center text-2xl sm:text-3xl md:text-[50px]">
              Allowing users to reap more crypto
            </p>
          </div>
          <div className="flex justify-center w-full mt-9 mb-11">
            <Link
              className="btn-primary dark:text-dark-primary w-full m-r-10"
              style={{ maxWidth: 182, minHeight: 49, marginRight:10 }}
              to="/swap"
            >
              Launch App
            </Link>
            <a href="https://docs.gamut.exchange/" target="_blank"
              className="btn-primary dark:text-dark-primary w-full"
              style={{ maxWidth: 182, minHeight: 49, marginLeft:10, cursor:"pointer" }}
              to="https://docs.gamut.exchange/"
            >
              Read Docs
            </a>
          </div>
          <div className="flex w-full flex-wrap gap-y-7 md:flex-row flex-col gap-x-7 max-w-xl px-2">
            <div className="flex-1">
              <p className="text-center text-base mb-2 text-grey-dark text-2xl">
                Socials
              </p>
              <ul className="flex justify-center w-full gap-x-9">
                {social.map((item) => {
                  const { id, icon, url } = item;
                  return (
                    <li key={id}>
                      <a href={url} target="_blank" className="w-7 h-7">
                        <img className="w-full h-full" src={icon} alt="icon" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            
          </div>
          <div className="mt-16 flex flex-wrap gap-y-4 justify-center gap-x-11 w-full">
            {ValueCards.map((card) => {
              const { id, title, value } = card;
              return (
                <div
                  style={{ maxWidth: 357 }}
                  className="p-8 w-full border-2 border-grey-dark text-light-primary text-center dark:text-grey-dark "
                  key={id}
                >
                  <div className="text-sm uppercase mb-3 ">{title}</div>
                  <div className="text-32 font-extrabold ">${value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

const social = [
  { id: 1, icon: twitter, url: "https://twitter.com/GamutExchange" },
  { id: 2, icon: discord, url: "https://discord.gg/GhyNp3xM8F" },
  { id: 3, icon: telegram, url: "https://t.me/GamutExchange" },
];
const support = [
  { id: 1, icon: icon1, url: "https://www.avax.network/" },
  { id: 2, icon: icon2, url: "https://fantom.foundation/" },
  { id: 3, icon: icon3, url: "https://www.xdaichain.com/" },
  { id: 4, icon: icon4, url: "https://polygon.technology/" },
];

const ValueCards = [
  { id: 1, title: "TOTAL VALUE LOCKED", value: "3,819,021" },
  { id: 2, title: "24 HOUR VOLUME", value: "600,301" },
  { id: 3, title: "GAMUT MCAP", value: "1,700,199" },
];
