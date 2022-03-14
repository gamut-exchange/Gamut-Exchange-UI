import { AiOutlineTwitter, AiOutlineGithub } from "react-icons/ai";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="py-20 bg-light-primary dark:bg-grey-dark">
      <div className="main-container">
        <div className="flex justify-end">
          <ul className="flex justify-end w-full gap-x-9">
            {social.map((item) => {
              const { id, icon, url } = item;
              return (
                <li key={id}>
                  <a
                    href={url}
                    className=" text-3xl text-white opacity-95 dark:text-dark-primary"
                  >
                    {icon}
                    {/* <img className="w-full h-full" src={icon} alt="icon" /> */}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;

const social = [
  { id: 1, icon: <AiOutlineTwitter />, url: "twitter" },
  { id: 2, icon: <FaDiscord />, url: "discord" },
  { id: 3, icon: <AiOutlineGithub />, url: "telegram" },
  { id: 4, icon: <FaTelegramPlane />, url: "git" },
];
