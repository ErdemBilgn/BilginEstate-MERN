import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          className="rounded-full h-24 w-24 object-cover hover:cursor-pointer self-center mt-2"
          src={currentUser.avatar}
          alt=""
        />

        {/* Username */}
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-lg"
        />

        {/* Email */}
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
        />

        {/* Password */}
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
        />

        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <span className="text-red-700 cursor-pointer font-semibold">
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer font-semibold">
          Sign Out
        </span>
      </div>
    </div>
  );
}
