import React from 'react';

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif' }}>
    <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-2 text-center text-black">📄 Privacy Policy</h1>
      <p className="text-center text-gray-500 mb-6">Effective Date: 19/05/2025<br/>Last Updated: 19/05/2025</p>
      <div className="space-y-6 text-black text-base">
        <p>This Privacy Policy describes how we collect, use, and protect your information when you use our application (the "App"). By using our App, you agree to the collection and use of information in accordance with this policy.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-black">1. Information We Collect</h2>
        <p>We only collect information from social media platforms when you explicitly connect your account to our App. This includes:</p>
        <ul className="list-disc ml-6">
          <li><b>From TikTok (via TikTok Login Kit):</b> Basic profile information (e.g., username, user ID, avatar), Public video data (e.g., video titles, likes, views, post dates).</li>
          <li><b>From YouTube (via YouTube Data API):</b> Channel name and ID, Subscriber count, View count, Video statistics (views, likes, comments).</li>
          <li><b>From Facebook:</b> Page name and ID, Public insights like reach, engagement, and likes.</li>
          <li><b>From Snapchat (if applicable via future integration):</b> Public profile data and story views (as permitted by their APIs).</li>
        </ul>
        <p>We do not collect any private messages, passwords, or login credentials.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-black">2. How We Use Your Information</h2>
        <p>The data collected from each platform is used exclusively to:</p>
        <ul className="list-disc ml-6">
          <li>Display your content performance inside your personal dashboard.</li>
          <li>Help you track engagement, growth, and trends.</li>
          <li>Provide cross-platform insights tailored to your content strategy.</li>
        </ul>
        <p>We do not use your data for advertising, data mining, or any third-party sharing.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-black">3. Data Storage & Retention</h2>
        <p>We do not permanently store any data retrieved from social platforms. All analytics data is retrieved in real time when you log in. Your access tokens are stored temporarily and securely to facilitate data access during your session only.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-black">4. Sharing Your Information</h2>
        <p>We do not share, sell, or rent your data with third parties. Your information is visible only to you and only while logged into your account.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-black">5. Your Control & Rights</h2>
        <p>You may:</p>
        <ul className="list-disc ml-6">
          <li>Disconnect your social accounts at any time.</li>
          <li>Revoke API access from the original platform (e.g., TikTok, YouTube, Facebook).</li>
          <li>Contact us to request deletion of any session data.</li>
        </ul>
        <p>To disconnect or revoke access:</p>
        <ul className="list-disc ml-6">
          <li>TikTok: <a href="https://www.tiktok.com/login" className="text-black underline" target="_blank" rel="noopener noreferrer">https://www.tiktok.com/login</a></li>
          <li>Google/YouTube: <a href="https://myaccount.google.com/permissions" className="text-black underline" target="_blank" rel="noopener noreferrer">https://myaccount.google.com/permissions</a></li>
          <li>Facebook: <a href="https://www.facebook.com/settings?tab=applications" className="text-black underline" target="_blank" rel="noopener noreferrer">https://www.facebook.com/settings?tab=applications</a></li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-black">6. Security</h2>
        <p>We take data security seriously and implement standard practices to prevent unauthorized access or misuse of your session data. However, no system is 100% secure, and we advise users to manage their account connections carefully.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-black">7. YouTube API Disclosure</h2>
        <p>CreatorFlowAi uses YouTube API Services to collect data such as channel name, view counts, and subscriber counts. By using our app, you agree to the YouTube Terms of Service and Google Privacy Policy.</p>
        <p>CreatorFlowAi's use and transfer of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-black">8. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. If we make material changes, we will update the effective date at the top and notify users if necessary.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-black">9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or how your data is handled, please contact us at:<br/>
        <span className="font-semibold text-black">📧 hi@creatorflowai.app</span></p>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy; 