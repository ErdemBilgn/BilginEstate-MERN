import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="p-3 max-w-2xl mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4">
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

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          sign up
        </button>
      </form>
      <div className="flex gap-2 mt-5 text-lg">
        <p>Have an account?</p>
        <Link to="/signin">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
