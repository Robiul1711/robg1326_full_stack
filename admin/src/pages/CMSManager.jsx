import React, { useState, useEffect } from "react";
import {
  FileCode2,
  Save,
  Sparkles,
  Layers,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Share2,
  ShieldCheck,
  Building2,
  Home,
} from "lucide-react";
import {
  useGetCMSByKeyQuery,
  useUpdateCMSByKeyMutation,
} from "../redux/api/adminApiSlice";
import toast from "react-hot-toast";

const CMSManager = () => {
  const [activeTab, setActiveTab] = useState("homepage"); // "homepage" | "footer"

  // 1. Homepage CMS query
  const { data: homepageResponse, isLoading: isHomeLoading } =
    useGetCMSByKeyQuery("homepage");

  // 2. Footer CMS query
  const { data: footerResponse, isLoading: isFooterLoading } =
    useGetCMSByKeyQuery("footer");

  const [updateCMS, { isLoading: isUpdating }] = useUpdateCMSByKeyMutation();

  // Homepage States
  const [banner, setBanner] = useState({
    headerText: "Keep your money safe",
    title: "We repair your devices",
    description:
      "Certified technicians. Original parts. Instant online quotes for iPhone, iPad, tablet and console — no surprises.",
    rating: "4.7",
    reviewsCount: "364+",
  });

  const [stats, setStats] = useState([
    { value: "50K+", label: "Devices Repaired" },
    { value: "4.9★", label: "Average Rating" },
    { value: "120+", label: "Certified Technicians" },
    { value: "1 Year", label: "Repair Warranty" },
  ]);

  // Footer States
  const [footer, setFooter] = useState({
    tagline:
      "Your trusted partner for certified device repair & pre-owned gadgets. Original parts, expert technicians, and warranty you can trust.",
    address: "142 Tech Street, San Francisco, CA 94105",
    phone: "+1 (800) 555-REPAIR",
    email: "hello@sadistore.com",
    hours: "Mon-Sat 8am - 8pm",
    whatsappNumber: "+393930973351",
    vatNumber: "VAT: IT01559390198",
    sdiCode: "SDI: M5UXCR1",
    copyrightText: "Sadi Store. All rights reserved.",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    twitterUrl: "https://twitter.com",
    youtubeUrl: "https://youtube.com",
  });

  // Sync Homepage response
  useEffect(() => {
    if (homepageResponse?.data) {
      if (homepageResponse.data.banner) setBanner(homepageResponse.data.banner);
      if (homepageResponse.data.stats) setStats(homepageResponse.data.stats);
    }
  }, [homepageResponse]);

  // Sync Footer response
  useEffect(() => {
    if (footerResponse?.data && Object.keys(footerResponse.data).length > 0) {
      setFooter((prev) => ({
        ...prev,
        ...footerResponse.data,
      }));
    }
  }, [footerResponse]);

  // Save Homepage handler
  const handleSaveHomepage = async (e) => {
    e.preventDefault();
    try {
      await updateCMS({
        key: "homepage",
        data: {
          banner,
          stats,
        },
      }).unwrap();
      toast.success("Homepage content updated & synced in real-time!");
    } catch (err) {
      toast.error("Failed to update homepage content");
    }
  };

  // Save Footer handler
  const handleSaveFooter = async (e) => {
    e.preventDefault();
    try {
      await updateCMS({
        key: "footer",
        data: footer,
      }).unwrap();
      toast.success("Footer & contact information updated & synced in real-time!");
    } catch (err) {
      toast.error("Failed to update footer content");
    }
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  const handleFooterChange = (field, value) => {
    setFooter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        {/* Header and Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              CMS & Live Content Manager
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Customize homepage banners, statistics, and footer contact details with instant live sync.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-[#141417] border border-white/5">
            <button
              onClick={() => setActiveTab("homepage")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "homepage"
                  ? "bg-[#80CF16] text-black shadow-[0_0_15px_rgba(128,207,22,0.3)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Home size={14} />
              <span>Homepage Hero</span>
            </button>

            <button
              onClick={() => setActiveTab("footer")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "footer"
                  ? "bg-[#80CF16] text-black shadow-[0_0_15px_rgba(128,207,22,0.3)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Building2 size={14} />
              <span>Footer & Contact</span>
            </button>
          </div>
        </div>

        {/* TAB 1: HOMEPAGE CMS */}
        {activeTab === "homepage" && (
          <div>
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/5">
              <span className="text-xs font-semibold text-zinc-400">
                Editing: <strong className="text-white">Homepage Hero & Stats</strong>
              </span>
              <button
                onClick={handleSaveHomepage}
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-xl bg-[#80CF16] text-black font-extrabold text-xs tracking-wide flex items-center gap-2 hover:bg-[#91e81b] transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(128,207,22,0.25)]"
              >
                <Save size={15} />
                <span>{isUpdating ? "Saving..." : "Publish Homepage Changes"}</span>
              </button>
            </div>

            {isHomeLoading ? (
              <div className="py-8 text-center text-xs text-zinc-500">Loading Homepage CMS...</div>
            ) : (
              <form onSubmit={handleSaveHomepage} className="space-y-6">
                {/* Banner Settings */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-[#80CF16]" />
                    Main Hero Banner
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Top Pill Badge Text
                      </label>
                      <input
                        type="text"
                        value={banner.headerText}
                        onChange={(e) => setBanner({ ...banner, headerText: e.target.value })}
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Hero Main Headline
                      </label>
                      <input
                        type="text"
                        value={banner.title}
                        onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                      Hero Sub-description
                    </label>
                    <textarea
                      rows={2}
                      value={banner.description}
                      onChange={(e) => setBanner({ ...banner, description: e.target.value })}
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Google Reviews Rating (e.g. 4.7)
                      </label>
                      <input
                        type="text"
                        value={banner.rating}
                        onChange={(e) => setBanner({ ...banner, rating: e.target.value })}
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Total Reviews Count (e.g. 364+)
                      </label>
                      <input
                        type="text"
                        value={banner.reviewsCount}
                        onChange={(e) => setBanner({ ...banner, reviewsCount: e.target.value })}
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Counters */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers size={16} className="text-[#80CF16]" />
                    Live Metric Stats Ribbon
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((st, idx) => (
                      <div key={idx} className="p-3.5 bg-[#18181b] rounded-xl border border-white/5 space-y-2">
                        <input
                          type="text"
                          value={st.value}
                          onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                          placeholder="e.g. 50K+"
                          className="w-full bg-transparent border-b border-white/10 pb-1 text-sm font-black text-[#80CF16] focus:outline-none focus:border-[#80CF16]"
                        />
                        <input
                          type="text"
                          value={st.label}
                          onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                          placeholder="e.g. Devices Repaired"
                          className="w-full bg-transparent text-xs text-zinc-400 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: FOOTER CMS */}
        {activeTab === "footer" && (
          <div>
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/5">
              <span className="text-xs font-semibold text-zinc-400">
                Editing: <strong className="text-white">Footer, Contact & Social Links</strong>
              </span>
              <button
                onClick={handleSaveFooter}
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-xl bg-[#80CF16] text-black font-extrabold text-xs tracking-wide flex items-center gap-2 hover:bg-[#91e81b] transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(128,207,22,0.25)]"
              >
                <Save size={15} />
                <span>{isUpdating ? "Saving..." : "Publish Footer Changes"}</span>
              </button>
            </div>

            {isFooterLoading ? (
              <div className="py-8 text-center text-xs text-zinc-500">Loading Footer CMS...</div>
            ) : (
              <form onSubmit={handleSaveFooter} className="space-y-6">
                {/* 1. Brand & Tagline */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 size={16} className="text-[#80CF16]" />
                    Brand Tagline & Copyright
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                      Footer Brand Tagline
                    </label>
                    <textarea
                      rows={2}
                      value={footer.tagline}
                      onChange={(e) => handleFooterChange("tagline", e.target.value)}
                      placeholder="Your trusted partner for certified device repair & pre-owned gadgets..."
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                      Copyright Notice Text
                    </label>
                    <input
                      type="text"
                      value={footer.copyrightText}
                      onChange={(e) => handleFooterChange("copyrightText", e.target.value)}
                      placeholder="Sadi Store. All rights reserved."
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                    />
                  </div>
                </div>

                {/* 2. Contact & Physical Location */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin size={16} className="text-[#80CF16]" />
                    Store Contact & Opening Hours
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Store Address
                      </label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={footer.address}
                          onChange={(e) => handleFooterChange("address", e.target.value)}
                          placeholder="142 Tech Street, San Francisco, CA 94105"
                          className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Support Phone Number
                      </label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={footer.phone}
                          onChange={(e) => handleFooterChange("phone", e.target.value)}
                          placeholder="+1 (800) 555-REPAIR"
                          className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Public Support Email
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="email"
                          value={footer.email}
                          onChange={(e) => handleFooterChange("email", e.target.value)}
                          placeholder="hello@sadistore.com"
                          className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Business Hours
                      </label>
                      <div className="relative">
                        <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={footer.hours}
                          onChange={(e) => handleFooterChange("hours", e.target.value)}
                          placeholder="Mon-Sat 8am - 8pm"
                          className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. WhatsApp & Tax Info */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageCircle size={16} className="text-[#80CF16]" />
                    WhatsApp Floating Button & Legal Info
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        WhatsApp Number (with country code)
                      </label>
                      <input
                        type="text"
                        value={footer.whatsappNumber}
                        onChange={(e) => handleFooterChange("whatsappNumber", e.target.value)}
                        placeholder="+393930973351"
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        VAT Number
                      </label>
                      <input
                        type="text"
                        value={footer.vatNumber}
                        onChange={(e) => handleFooterChange("vatNumber", e.target.value)}
                        placeholder="VAT: IT01559390198"
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        SDI Code
                      </label>
                      <input
                        type="text"
                        value={footer.sdiCode}
                        onChange={(e) => handleFooterChange("sdiCode", e.target.value)}
                        placeholder="SDI: M5UXCR1"
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Social Media Links */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Share2 size={16} className="text-[#80CF16]" />
                    Social Media Profiles
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Facebook URL
                      </label>
                      <input
                        type="text"
                        value={footer.facebookUrl}
                        onChange={(e) => handleFooterChange("facebookUrl", e.target.value)}
                        placeholder="https://facebook.com/..."
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Instagram URL
                      </label>
                      <input
                        type="text"
                        value={footer.instagramUrl}
                        onChange={(e) => handleFooterChange("instagramUrl", e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Twitter / X URL
                      </label>
                      <input
                        type="text"
                        value={footer.twitterUrl}
                        onChange={(e) => handleFooterChange("twitterUrl", e.target.value)}
                        placeholder="https://twitter.com/..."
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        YouTube URL
                      </label>
                      <input
                        type="text"
                        value={footer.youtubeUrl}
                        onChange={(e) => handleFooterChange("youtubeUrl", e.target.value)}
                        placeholder="https://youtube.com/..."
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CMSManager;
