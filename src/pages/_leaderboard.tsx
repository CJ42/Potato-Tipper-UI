export default function Leaderboard() {
  return (
    <div className="flex flex-col items-center justify-center main-content">
      <h1 className="text-white text-4xl">👑 Leaderboard</h1>
      <div className="rounded-lg border border-red-100 p-5 bg-beige-soil mt-4 text-center">
        <h4 className="text-xl mb-2 font-bold">
          🍠 Who are the <code>$POTATO</code> tipping kings?
        </h4>
        <div className="mb-32 lg:mb-0 lg:max-w-3xl opacity-70">
          <p>
            Call them a <i>"sweet potato"</i> or however you want to thank them
            for their behaviour.
          </p>
          <p>
            But these are the 🆙 who have tipped the most{' '}
            <code className="font-bold ml-1">$POTATO</code> and are
            incentivizing the most.
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center bg-beige-soil rounded-lg border border-red-100 p-5 mt-4">
        <div>Coming soon...</div>
      </div>
      {/* <div className="flex flex-row items-center justify-center bg-beige-soil rounded-lg border border-red-100 p-5 mt-4">
        <div>User profile name + image appears here</div>
        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left group mt-4">
          <p className="text-sm rounded-lg border px-5 py-4 border-slate-200 bg-white mr-2 text-center">
            Total tipped
          </p>
          <p className="text-sm rounded-lg border px-5 py-4 border-slate-200 bg-white mr-2 text-center">
            Followers gained
          </p>
          <p className="text-sm rounded-lg border px-5 py-4 border-slate-200 bg-white mr-2 text-center">
            Allocated budget
          </p>
          <p className="text-sm rounded-lg border px-5 py-4 border-slate-200 bg-white text-center">
            View Profile
          </p>
        </div>
      </div> */}
    </div>
  );
}
