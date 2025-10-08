import "./App.css";
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import InstagramFollowers from './pages/InstagramFollowers';
import YouTubeFollowers from './pages/YouTubeFollowers';
import Paywall from './pages/Paywall';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import PlatformSelection from './pages/PlatformSelection';
import TikTokConnect from './pages/TikTokConnect';
import TikTokOAuthCallback from './pages/TikTokOAuthCallback';
import FacebookConnect from './pages/FacebookConnect';
import YouTubeConnect from './pages/YouTubeConnect';
import SnapchatConnect from './pages/SnapchatConnect';
import CreatorDashboard from './pages/CreatorDashboard';
import ContentCalendar from './pages/ContentCalendar';
import BasicDashboard from './pages/BasicDashboard';
import Analytics from './pages/Analytics';
import PersonalizedContent from './pages/PersonalizedContent';
import EarningsAnalysis from './pages/EarningsAnalysis';
import BrandMatching from './pages/BrandMatching';
import CustomReporting from './pages/CustomReporting';
import RPMSettings from './pages/RPMSettings';
import PlatformSettings from './pages/PlatformSettings';
import Settings from './pages/Settings';
import BrandDashboard from './pages/BrandDashboard';
import { useState, useEffect } from 'react';
import Welcome from './pages/Welcome';
import BrandOnboarding from './pages/BrandOnboarding';
import FindCreators from './pages/FindCreators';
import Campaigns from './pages/Campaigns';
import PaymentSuccess from './pages/PaymentSuccess';
import CampaignTerms from './pages/CampaignTerms';
import TermsAccepted from './pages/TermsAccepted';
import CardDetails from './pages/CardDetails';
import PaymentRequired from './components/PaymentRequired';
import ManageSubscription from './pages/ManageSubscription';
import { CreatorProvider } from './context/CreatorContext';
import ManageMembership from './pages/ManageMembership';
import CreatorManageMembership from './pages/CreatorManageMembership';
import OAuth2Callback from './pages/OAuth2Callback';
import YouTubeSuccess from './pages/YouTubeSuccess';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Faq from './pages/Faq';
import CreateCampaignOffer from './pages/CreateCampaignOffer';

function App() {
  const [userPlan, setUserPlan] = useState(null);

  useEffect(() => {
    const savedPlan = localStorage.getItem('userPlan');
    setUserPlan(savedPlan);
  }, []);

  return (
    <CreatorProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/tiktok" element={<TikTokConnect />} />
          <Route path="/facebook" element={<FacebookConnect />} />
          <Route path="/youtube" element={<YouTubeConnect />} />
          <Route path="/snapchat" element={<SnapchatConnect />} />
          <Route path="/platform-selection" element={<PlatformSelection />} />
          <Route path="/tiktok/connect" element={<TikTokConnect />} />
          <Route path="/tiktok/oauth/callback" element={<TikTokOAuthCallback />} />
          <Route path="/facebook/connect" element={<FacebookConnect />} />
          <Route path="/youtube/connect" element={<YouTubeConnect />} />
          <Route path="/snapchat/connect" element={<SnapchatConnect />} />
          <Route path="/creator-dashboard" element={<CreatorDashboard />} />
          <Route path="/basic-dashboard" element={<BasicDashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/paywall" element={<Paywall />} />
          <Route path="/rpm-settings" element={<RPMSettings />} />
          <Route path="/personalized-content" element={<PersonalizedContent />} />
          <Route path="/earnings-analysis" element={<EarningsAnalysis />} />
          <Route path="/content-calendar" element={<ContentCalendar />} />
          <Route path="/instagram" element={<InstagramFollowers />} />
          <Route path="/youtube" element={<YouTubeFollowers />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/:type" element={<Checkout />} />
          <Route path="/campaign-terms/:campaignId" element={<CampaignTerms />} />
          <Route path="/terms-accepted" element={<TermsAccepted />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/brand-matching" element={<BrandMatching />} />
          <Route path="/custom-reporting" element={<CustomReporting />} />
          <Route path="/platform-settings" element={<PlatformSettings />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/manage-subscription" element={<ManageSubscription />} />
          <Route path="/brand-dashboard" element={<BrandDashboard />} />
          <Route path="/brand-onboarding" element={<BrandOnboarding />} />
          <Route path="/find-creators" element={<PaymentRequired><FindCreators /></PaymentRequired>} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/card-details" element={<CardDetails />} />
          <Route path="/manage-membership" element={<ManageMembership />} />
          <Route path="/creator/manage-membership" element={<CreatorManageMembership />} />
          <Route path="/oauth2callback" element={<OAuth2Callback />} />
          <Route path="/youtube/success" element={<YouTubeSuccess />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/create-campaign-offer/:creatorId" element={<CreateCampaignOffer />} />
        </Routes>
    </div>
    </CreatorProvider>
  );
}

export default App;




