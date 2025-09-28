import ProfilePreview from '@/components/ProfilePreview';

export default function Dashboard() {
  return (
    <div className="flex items-center justify-center main-content mt-6">
      <div>
        <div className="card bg-beige-soil">
          <ProfilePreview />
        </div>
        <div className="card bg-beige-soil">Dashboard page coming soon...</div>
      </div>

      <div>
        <div className="rounded-lg border border-red-100 p-5 bg-beige-soil mt-4">
          <h4 className="text-xl mb-2 font-bold">🥔 ➡️ Tips sent</h4>
          <div className="mb-32 lg:mb-0 lg:max-w-3xl opacity-70 text-sm">
            See the total amount of 🥔 you have tipped, how many followers you
            gained, and your remaining tipping budget.
            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left group mt-4">
              <p className="text-sm rounded-lg border px-5 py-4 border-slate-200 bg-white mr-2 text-center">
                Tips sent
              </p>
              <p className="text-sm rounded-lg border px-5 py-4 border-slate-200 bg-white mr-2 text-center">
                New Followers gained
              </p>
              <p className="text-sm rounded-lg border px-5 py-4 border-slate-200 bg-white mr-2 text-center">
                Budget left
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-red-100 p-5 bg-beige-soil mt-4">
          <h4 className="text-xl mb-2 font-bold">🥔 ⬅️ Tips received</h4>
          <div className="mb-32 lg:mb-0 lg:max-w-3xl opacity-70 text-sm">
            <p>
              See the total amount of 🥔 you have received, how many 🆙 you have
              followed that sent you tips, and who they are.
            </p>
            <p className="italic">
              (You might have followed them without knowing they have tipped you
              🥔🥔🥔!)
            </p>
            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left group mt-4">
              <p className="text-sm rounded-lg border px-5 py-4 border-slate-200 bg-white mr-2 text-center">
                Tips received
              </p>
              <p className="text-sm rounded-lg border px-5 py-4 border-slate-200 bg-white mr-2 text-center">
                Number of 🆙 who tipped you
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
