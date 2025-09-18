import React from 'react';

const CardWithContent: React.FC = () => {
  return (
    <div className="mb-6 mx-3 rounded">
      <h1 className="mb-3 fixed left-0 top-0 flex w-full justify-center lg:static lg:w-auto lg:rounded-xl lg:p-4 lg:border bg-[#4a7c59] font-mono text-white">
        Welcome to the{' '}
        <span className="font-mono font-bold ml-2"> 🥔 POTATO Tipper dApp</span>
        !
      </h1>
      <p className="mb-3">
        Looking to get more followers? Tired to ask people on X and Telegram to
        follow your 🆙 on{' '}
        <a
          className="font-bold text-[#925648]"
          href="https://universaleverything.io"
          target="_blank"
        >
          universaleverything.io
        </a>
        ?
      </p>
      <p className="mb-3">
        We have a solution for you! Incentivize people to follow you by tipping
        them some 🥔 <code>$POTATO</code> tokens!
      </p>
      <h2 className="text-2xl font-bold mb-4">
        Features of the <code>$POTATO</code> Tipper
      </h2>
      <ul className="list-disc pl-5 text-lg">
        <li className="mb-2">
          Connect the <code>PotatoTipper</code> contract to your Universal
          Profile, setup the tip amount and you are all set!
        </li>
        <li className="mb-2">
          You can always change the tip amount at any time!
        </li>
        <li className="mb-2">
          Configure up to how many POTATO tokens you are allocating for tipping.
        </li>
        <li className="mb-2">
          Don't forget to topup the amount overtime, as the allowance for the
          POTATO tipper decreases as you tip!
        </li>
      </ul>
    </div>
  );
};

export default CardWithContent;
