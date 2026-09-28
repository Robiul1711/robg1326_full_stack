import React, { useState, useEffect } from "react";
import {
  Save,
  Globe,
  Lock,
  Check,
  HelpCircle,
  Plus,
  Trash2,
  Package,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import {
  useGetCmsContentQuery,
  useUpdateCmsContentMutation,
  useChangePasswordMutation,
} from "../redux/api/adminApiSlice";
import toast from "react-hot-toast";

const DEFAULT_PACKAGES = [
  {
    id: "sharps",
    name: "SHARPS",
    popular: false,
    originalPrice: "$29.99",
    discountPrice: "$14.99",
    price: 14.99,
    period: "/ month",
    subtitle: "For the disciplined everyday bettor who wants sharper straight plays.",
    features: [
      "Daily straight bets on major sports",
      "Core spreads, totals, and moneylines",
      "Model-backed confidence scores",
      "Standard alerts during your trial",
      "Access to app + web dashboard",
    ],
    cta: "START 7-DAY TRIAL — SHARPS",
    accessNote:
      "Sharps Access: After purchase, log in using the same email you paid with. Your Sharps picks unlock automatically.",
  },
  {
    id: "sniper-elite",
    name: "SNIPER ELITE",
    popular: true,
    originalPrice: "$79.99",
    discountPrice: "$39.99",
    price: 39.99,
    period: "/ month",
    subtitle: "For bettors who want full-board reads, props, and deeper angles.",
    features: [
      "Everything in Sharps",
      "Player props and alt lines",
      "Parlay edges & aggressive angles",
      "Enhanced notes and line-move context",
      "Priority game alerts during your trial",
    ],
    cta: "START 7-DAY TRIAL — ELITE",
    accessNote: "",
  },
  {
    id: "whale-access",
    name: "WHALE ACCESS",
    popular: false,
    originalPrice: "$199.99",
    discountPrice: "$99.99",
    price: 99.99,
    period: "/ month",
    subtitle: "For high-stakes players who take edges and process seriously.",
    features: [
      "Everything in Sniper Elite",
      "High-conviction premium plays",
      "Advanced positions & alt markets",
      "Priority support and future private tools",
      "Built for aggressive bankrolls",
    ],
    cta: "START 7-DAY TRIAL — WHALE",
    accessNote: "",
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("cms");
  const { data: cmsRes, isLoading: isCmsLoading } = useGetCmsContentQuery();
  const [updateCmsContent, { isLoading: isUpdatingCms }] = useUpdateCmsContentMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    heroHeadline: "",
    heroSubheadline: "",
    ctaButtonText: "",
    monthlyPrice: 49,
    yearlyPrice: 399,
    siteName: "BetSnipe",
    supportEmail: "support@betsnipe.com",
    telegramLink: "",
    discordLink: "",
    announcementBanner: "",
  });

  const [faqs, setFaqs] = useState([]);
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [testimonials, setTestimonials] = useState([]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (cmsRes?.data) {
      const { hero, pricing, siteSettings, faqs: apiFaqs, packages: apiPackages } = cmsRes.data;
      setFormData({
        heroHeadline: hero?.headline || "",
        heroSubheadline: hero?.subheadline || "",
        ctaButtonText: hero?.ctaButtonText || "",
        monthlyPrice: pricing?.monthlyPrice || 49,
        yearlyPrice: pricing?.yearlyPrice || 399,
        siteName: siteSettings?.siteName || "BetSnipe",
        supportEmail: siteSettings?.supportEmail || "support@betsnipe.com",
        telegramLink: siteSettings?.telegramLink || "",
        discordLink: siteSettings?.discordLink || "",
        announcementBanner: siteSettings?.announcementBanner || "",
      });
      if (apiFaqs && apiFaqs.length > 0) {
        setFaqs(apiFaqs.map((f, i) => ({ ...f, id: f.id ?? i })));
      }
      if (apiPackages && apiPackages.length > 0) {
        setPackages(apiPackages);
      }
      if (cmsRes.data.testimonials && cmsRes.data.testimonials.length > 0) {
        setTestimonials(cmsRes.data.testimonials);
      }
    }
  }, [cmsRes]);

  const handleCmsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCmsContent({
        hero: {
          headline: formData.heroHeadline,
          subheadline: formData.heroSubheadline,
          ctaButtonText: formData.ctaButtonText,
        },
        pricing: {
          monthlyPrice: Number(formData.monthlyPrice),
          yearlyPrice: Number(formData.yearlyPrice),
        },
        siteSettings: {
          siteName: formData.siteName,
          supportEmail: formData.supportEmail,
          telegramLink: formData.telegramLink,
          discordLink: formData.discordLink,
          announcementBanner: formData.announcementBanner,
        },
      }).unwrap();
      toast.success("CMS & Website Content updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update CMS content");
    }
  };

  const handlePackagesSubmit = async (e) => {
    e.preventDefault();
    if (packages.some((p) => !p.name.trim())) {
      toast.error("All packages must have a name.");
      return;
    }
    try {
      await updateCmsContent({ packages }).unwrap();
      toast.success("Packages & Pricing updated successfully! Live on frontend.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update packages");
    }
  };

  const addPackage = () => {
    const id = `plan-${Date.now()}`;
    setPackages([
      ...packages,
      {
        id,
        name: "NEW TIER",
        popular: false,
        originalPrice: "$49.99",
        discountPrice: "$24.99",
        price: 24.99,
        period: "/ month",
        subtitle: "Custom tier description here.",
        features: ["Access to daily predictions", "Discord & Telegram alert access"],
        cta: "START 7-DAY TRIAL",
        accessNote: "",
      },
    ]);
  };

  const removePackage = (idx) => {
    setPackages(packages.filter((_, i) => i !== idx));
  };

  const updatePackageField = (idx, field, value) => {
    setPackages(
      packages.map((pkg, i) => (i === idx ? { ...pkg, [field]: value } : pkg))
    );
  };

  const handleFaqsSubmit = async (e) => {
    e.preventDefault();
    if (faqs.some((f) => !f.q.trim() || !f.a.trim())) {
      toast.error("All FAQ questions and answers must be filled in.");
      return;
    }
    try {
      await updateCmsContent({ faqs }).unwrap();
      toast.success("FAQ section updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update FAQs");
    }
  };

  const addFaq = () => {
    const newId = faqs.length > 0 ? Math.max(...faqs.map((f) => f.id)) + 1 : 0;
    setFaqs([...faqs, { id: newId, q: "", a: "" }]);
  };

  const removeFaq = (id) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const updateFaq = (id, field, value) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      toast.success("Admin password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  const handleTestimonialsSubmit = async (e) => {
    e.preventDefault();
    if (testimonials.some((t) => !t.quote.trim() || !t.author.trim())) {
      toast.error("All testimonials must have a quote and author.");
      return;
    }
    try {
      await updateCmsContent({ testimonials }).unwrap();
      toast.success("Testimonials updated successfully! Live on frontend.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update testimonials");
    }
  };

  const addTestimonial = () => {
    const id = `t-${Date.now()}`;
    setTestimonials([...testimonials, { id, quote: "", author: "", role: "Verified Member" }]);
  };

  const removeTestimonial = (id) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  const updateTestimonial = (id, field, value) => {
    setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Platform & CMS Settings
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Manage dynamic frontend text, pricing plans, contact links, and admin security.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab("cms")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "cms"
              ? "bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.3)]"
              : "text-zinc-400 hover:text-white bg-white/5"
          }`}
        >
          <Globe size={14} />
          <span>Dynamic CMS & Hero</span>
        </button>
        <button
          onClick={() => setActiveTab("packages")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "packages"
              ? "bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.3)]"
              : "text-zinc-400 hover:text-white bg-white/5"
          }`}
        >
          <Package size={14} />
          <span>Packages & Pricing</span>
        </button>
        <button
          onClick={() => setActiveTab("faq")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "faq"
              ? "bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.3)]"
              : "text-zinc-400 hover:text-white bg-white/5"
          }`}
        >
          <HelpCircle size={14} />
          <span>FAQ Management</span>
        </button>
        <button
          onClick={() => setActiveTab("testimonials")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "testimonials"
              ? "bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.3)]"
              : "text-zinc-400 hover:text-white bg-white/5"
          }`}
        >
          <MessageSquare size={14} />
          <span>Testimonials</span>
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "security"
              ? "bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.3)]"
              : "text-zinc-400 hover:text-white bg-white/5"
          }`}
        >
          <Lock size={14} />
          <span>Admin Security</span>
        </button>
      </div>

      {activeTab === "cms" && (
        <form onSubmit={handleCmsSubmit} className="space-y-6 max-w-3xl">
          {/* Hero Section */}
          <div className="rounded-3xl p-6 bg-[#0e0e11] border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Globe size={16} className="text-[#00E676]" />
              <span>Hero Section Content</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Main Headline
              </label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Sub-Headline / Description
              </label>
              <textarea
                rows={3}
                value={formData.heroSubheadline}
                onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
                className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={formData.ctaButtonText}
                onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
                className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
              />
            </div>
          </div>


          <button
            type="submit"
            disabled={isUpdatingCms}
            className="px-6 py-3 rounded-xl bg-[#00E676] hover:bg-[#00c864] text-black text-xs font-extrabold flex items-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.25)] transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isUpdatingCms ? "Saving CMS..." : "Save All CMS Changes"}</span>
          </button>
        </form>
      )}

      {activeTab === "packages" && (
        <form onSubmit={handlePackagesSubmit} className="space-y-5 max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-300 font-semibold">
                Configure Pricing Tiers & Membership Packages
              </p>
              <p className="text-[11px] text-zinc-500">
                Custom pricing, features, badges, and Stripe checkout amounts are synced live to the frontend.
              </p>
            </div>
            <button
              type="button"
              onClick={addPackage}
              className="px-4 py-2 rounded-xl bg-[#00E676]/10 hover:bg-[#00E676]/20 border border-[#00E676]/30 text-[#00E676] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Package</span>
            </button>
          </div>

          <div className="space-y-4">
            {packages.map((pkg, idx) => (
              <div
                key={pkg.id || idx}
                className={`rounded-2xl p-5 bg-[#0e0e11] border transition-all ${
                  pkg.popular ? "border-[#00E676]/50 shadow-[0_0_15px_rgba(0,230,118,0.1)]" : "border-white/5"
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#00E676] bg-[#00E676]/10 px-2.5 py-1 rounded-lg">
                      Tier #{idx + 1}
                    </span>
                    <span className="text-sm font-bold text-white uppercase">{pkg.name || "Untitled Tier"}</span>
                    {pkg.popular && (
                      <span className="text-[10px] bg-[#00E676] text-black font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles size={10} />
                        POPULAR
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removePackage(idx)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                    title="Delete Tier"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mb-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={pkg.name}
                      onChange={(e) => updatePackageField(idx, "name", e.target.value)}
                      placeholder="e.g. SNIPER ELITE"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Original Price (Display)
                    </label>
                    <input
                      type="text"
                      value={pkg.originalPrice}
                      onChange={(e) => updatePackageField(idx, "originalPrice", e.target.value)}
                      placeholder="e.g. $79.99"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Discount Price (Display)
                    </label>
                    <input
                      type="text"
                      value={pkg.discountPrice}
                      onChange={(e) => updatePackageField(idx, "discountPrice", e.target.value)}
                      placeholder="e.g. $39.99"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Stripe Charge Price ($ USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={pkg.price}
                      onChange={(e) => updatePackageField(idx, "price", parseFloat(e.target.value) || 0)}
                      placeholder="39.99"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Billing Period
                    </label>
                    <input
                      type="text"
                      value={pkg.period}
                      onChange={(e) => updatePackageField(idx, "period", e.target.value)}
                      placeholder="e.g. / month or / year"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={pkg.cta}
                      onChange={(e) => updatePackageField(idx, "cta", e.target.value)}
                      placeholder="e.g. START 7-DAY TRIAL"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Subtitle / Pitch
                    </label>
                    <input
                      type="text"
                      value={pkg.subtitle}
                      onChange={(e) => updatePackageField(idx, "subtitle", e.target.value)}
                      placeholder="Short tier description"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Features (One feature per line)
                    </label>
                    <textarea
                      rows={3}
                      value={Array.isArray(pkg.features) ? pkg.features.join("\n") : pkg.features || ""}
                      onChange={(e) =>
                        updatePackageField(
                          idx,
                          "features",
                          e.target.value.split("\n").filter((f) => f.trim() !== "")
                        )
                      }
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-300">
                      <input
                        type="checkbox"
                        checked={pkg.popular || false}
                        onChange={(e) => updatePackageField(idx, "popular", e.target.checked)}
                        className="rounded border-white/20 text-[#00E676] focus:ring-[#00E676]"
                      />
                      <span>Mark as "Most Popular" (Highlights card with glowing green border)</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}

            {packages.length === 0 && (
              <div className="text-center py-10 text-zinc-500 text-xs">
                No packages configured yet. Click "Add Package" to create one.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUpdatingCms}
            className="px-6 py-3 rounded-xl bg-[#00E676] hover:bg-[#00c864] text-black text-xs font-extrabold flex items-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.25)] transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isUpdatingCms ? "Saving Packages..." : "Save Packages & Pricing Changes"}</span>
          </button>
        </form>
      )}

      {activeTab === "faq" && (
        <form onSubmit={handleFaqsSubmit} className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">Edit, add or remove FAQ items. Changes go live on the frontend instantly.</p>
            <button
              type="button"
              onClick={addFaq}
              className="px-4 py-2 rounded-xl bg-[#00E676]/10 hover:bg-[#00E676]/20 border border-[#00E676]/30 text-[#00E676] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="rounded-2xl p-4 bg-[#0e0e11] border border-white/5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">FAQ #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFaq(faq.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">Question</label>
                  <input
                    type="text"
                    value={faq.q}
                    onChange={(e) => updateFaq(faq.id, "q", e.target.value)}
                    placeholder="Enter the question..."
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">Answer</label>
                  <textarea
                    rows={3}
                    value={faq.a}
                    onChange={(e) => updateFaq(faq.id, "a", e.target.value)}
                    placeholder="Enter the answer..."
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all resize-none"
                  />
                </div>
              </div>
            ))}

            {faqs.length === 0 && (
              <div className="text-center py-10 text-zinc-500 text-xs">
                No FAQ items yet. Click "Add FAQ" to create one.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUpdatingCms}
            className="px-6 py-3 rounded-xl bg-[#00E676] hover:bg-[#00c864] text-black text-xs font-extrabold flex items-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.25)] transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isUpdatingCms ? "Saving FAQs..." : "Save FAQ Changes"}</span>
          </button>
        </form>
      )}

      {activeTab === "testimonials" && (
        <form onSubmit={handleTestimonialsSubmit} className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-300 font-semibold">Manage Testimonials</p>
              <p className="text-[11px] text-zinc-500">Add, edit or remove testimonial cards shown in the frontend slider.</p>
            </div>
            <button
              type="button"
              onClick={addTestimonial}
              className="px-4 py-2 rounded-xl bg-[#00E676]/10 hover:bg-[#00E676]/20 border border-[#00E676]/30 text-[#00E676] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div className="space-y-3">
            {testimonials.map((t, index) => (
              <div key={t.id} className="rounded-2xl p-4 bg-[#0e0e11] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare size={13} className="text-[#00E676]" />
                    Testimonial #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTestimonial(t.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">Quote</label>
                  <textarea
                    rows={3}
                    value={t.quote}
                    onChange={(e) => updateTestimonial(t.id, "quote", e.target.value)}
                    placeholder='e.g. "Bet Snipe changed how I approach every game..."'
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">Author Name</label>
                    <input
                      type="text"
                      value={t.author}
                      onChange={(e) => updateTestimonial(t.id, "author", e.target.value)}
                      placeholder="e.g. User Alias"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">Role / Badge</label>
                    <input
                      type="text"
                      value={t.role}
                      onChange={(e) => updateTestimonial(t.id, "role", e.target.value)}
                      placeholder="e.g. Verified Member"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <div className="text-center py-10 text-zinc-500 text-xs">
                No testimonials yet. Click "Add Testimonial" to create one.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUpdatingCms}
            className="px-6 py-3 rounded-xl bg-[#00E676] hover:bg-[#00c864] text-black text-xs font-extrabold flex items-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.25)] transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isUpdatingCms ? "Saving..." : "Save Testimonials"}</span>
          </button>
        </form>
      )}

      {activeTab === "security" && (
        <form onSubmit={handlePasswordSubmit} className="rounded-3xl p-6 bg-[#0e0e11] border border-white/5 max-w-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Lock size={16} className="text-[#00E676]" />
            <span>Change Admin Password</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#00E676] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#00E676] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#00E676] transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#00E676] hover:bg-[#00c864] text-black text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.25)] transition-all cursor-pointer disabled:opacity-50"
          >
            <Check size={16} />
            <span>{isChangingPassword ? "Updating..." : "Update Password"}</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default Settings;
