import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <div className="h-screen flex flex-1 pt-24 px-14">
      <div className="col flex-1">
        <h1>Online Live Quiz</h1>
      </div>
      <div className="col flex-1">
        <Image
          src="/pexels-shvetsa-3987020.jpg"
          alt="Quiz"
          width={500}
          height={800}
        />
      </div>
    </div>
  );
}
