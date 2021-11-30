import { useState } from "react";

function Switch() {
  const [toggle, setToggle] = useState(true);
  const toggleClass = " transform translate-x-5";
  return (
    <>
      <div className="flex flex-col justify-center h-screen items-center ">
        {/*   Switch Container */}

        <div
          className="md:w-14 md:h-7 w-12 h-6 flex items-center bg-gray-400 rounded-full p-1 cursor-pointer"
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          {/* Switch */}
          <div
            className={
              "bg-black md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform duration-300 ease-in-out" +
              (toggle ? null : toggleClass)
            }
          ></div>
        </div>
        <div className="font-bold my-4">
          Hey If you liked it consider following me on twitter{" "}
        </div>
        <div className="bg-blue-600 text-white p-4 rounded-md">
          <a
            href="https://twitter.com/theysaymaurya?ref_src=twsrc%5Etfw"
            className="twitter-follow-button"
            data-show-count="false"
          >
            Follow @theysaymaurya
          </a>
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charSet="utf-8"
          ></script>
        </div>
      </div>
    </>
  );
}

export default Switch;
