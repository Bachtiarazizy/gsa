import React from "react";

const Marquee = () => {
  return (
    <div id="text-slide-section">
      <div className="bg-[#1A1AFF] py-5">
        <div className="horizontal-slide-from-left-to-right grid grid-flow-col whitespace-nowrap">
          <div className="flex text-4xl font-bold uppercase leading-5 text-primary-foreground">#cybersecurity #hacking #tech #programming #coding</div>
          <div className="flex text-4xl font-bold uppercase leading-5 text-primary-foreground">#cybersecurity #hacking #tech #programming #coding</div>
          <div className="flex text-4xl font-bold uppercase leading-5 text-primary-foreground">#cybersecurity #hacking #tech #programming #coding</div>
        </div>
      </div>
    </div>
  );
};

export default Marquee;
