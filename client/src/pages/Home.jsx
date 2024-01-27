import React from "react";
import imageSrc from "./image 289.png"; // Replace with your actual image path

const Home = () => {
  return (
    <div className="flex items-center justify-center p-2 mt-20 ">
      <div className="text-center">
        <img src={imageSrc} alt="" className="w-70 h-70 flex-shrink-0 " />

        <p className="text-purple-300 mt-4 text-2xl ">
          Welcome to Digitalflake Admin
        </p>
      </div>
    </div>
  );
};

export default Home;
