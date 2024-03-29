import React from "react";
import Image from "next/image";


const About = () => {

  return (
    <div className="bg-black lg:px-36 px-6 py-3 min-h-screen">
      <div className="group">
        <h1 className="uppercase tracking-widest lg:tracking-[2.5rem] md:text-5xl">About ME</h1>
        <div className="h-1 w-full bg-gray-200 mt-3 relative">
          <span className="absolute left-0 bg-gray-50/40 h-3 w-3 top-1/2 -translate-y-1/2 rounded-full duration-[3000ms] group-hover:left-full"></span>
        </div>

        <div className="mt-10 flex items-center justify-center flex-col lg:flex-row">
          <h2 className="lg:w-1/4 font-bold text-3xl mb-3 lg:mb-0 lg:text-2xl">

            Summery
          </h2>
          <p className="lg:w-3/4 text-center lg:text-left">

            Im MD Alamin, I&apos;m MERN stack developer with 1 year of experience
            building Full-stack web applications. Proficient in MongoDB, Express,
            React, and Node.js. Skilled in designing and implementing
            user-friendly web apps. Strong problem-solving abilities and
            team player. Seeking a challenging role to utilize my skills and
            contribute to innovative web development.
          </p>
        </div>
        <div className="mt-10 flex items-center justify-center flex-col lg:flex-row">
          <h2 className="lg:w-1/4 font-bold text-3xl mb-3 lg:mb-0 lg:text-2xl">


            Technical Skills
          </h2>
          <div className="lg:w-3/4 grid md:grid-cols-3 text-center lg:text-left lg:space-x-4 gap-10 space-y-4 md:space-y-0 ">
            <div>
              <p className="font-bold">Expertise</p>
              <ul className="xl:list-disc">
                <li>JavaScript</li>
                <li>React</li>
                <li>Node & Express js</li>
                <li>Mongo DB</li>
                <li>Tailwind css & Scss</li>
              </ul>
            </div>
            <div>
              <p className="font-bold">Comfortable</p>
              <ul className="xl:list-disc">
                <li>Redux</li>
                <li>Firebase</li>
                <li>Typescript</li>
                <li>Next js</li>
              </ul>
            </div>
            <div>
              <p className="font-bold">familiar</p>
              <ul className="xl:list-disc">
                <li>Docker</li>
                <li>Php & Laravel</li>
                <li>Vue & Nuxt js</li>
                <li>Three js</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center flex-col px-10 md:px-0 lg:flex-row">
          <h2 className="lg:w-1/4 font-bold text-3xl mb-3 lg:mb-0 lg:text-2xl">

            Experience
          </h2>
          <div className="lg:w-3/4 text-center space-y-10 lg:text-left">
            <div className="">

              <p className="font-bold text-lg">
                Web Developer
              </p>
              <p className="text-gray-300 font-semibold text-sm">
                Ishqool, Dhaka Bangladesh
              </p>
              <p className="text-gray-300 text-sm">
                August 2022 - Present
              </p>

              <ul className="lg:list-disc text-gray-300 list-decimal space-y-3 text-xs my-4 lg:space-y-0">
                <li>
                  Worked on the development of the company&apos;s ed-tech platform using React, Node.js, and Postgresql.
                </li>
                <li>
                  Implemented features such as user authentication, Api Conncetions, optimized code
                </li>
                <li>
                  Collaborated with the design team to ensure a seamless user experience.
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

    </div >
  );
};

export default About;
