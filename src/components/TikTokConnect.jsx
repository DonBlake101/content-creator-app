<div className="flex flex-col items-center justify-center w-full max-w-[600px] p-8 bg-white rounded-2xl shadow-lg">
  <img src="/tiktok-icon.svg" alt="TikTok Icon" className="w-12 h-12 mb-6" />
  <h1 className="text-3xl font-bold mb-2 text-center">Connect Your TikTok Account</h1>
  <p className="text-gray-600 mb-8 text-center">Enter your TikTok username to analyze your content performance</p>
  
  <div className="w-full">
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-2">TikTok Username</label>
      <input 
        type="text"
        placeholder="Enter your TikTok username"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors mb-4">
      Connect Account
    </button>

    <button className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mb-8">
      I don't want to monetize on this platform
    </button>

    <div>
      <h2 className="text-xl font-bold mb-4">Your TikTok Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 mb-1">Followers</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 mb-1">Engagement Rate</p>
          <p className="text-3xl font-bold">0%</p>
        </div>
      </div>
    </div>
  </div>

  <p className="text-sm text-gray-600 mt-8">
    By connecting your account, you agree to our{" "}
    <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
    {" "}and{" "}
    <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
  </p>
</div> 