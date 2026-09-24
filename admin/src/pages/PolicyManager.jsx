import React, { useState, useEffect } from "react";
import { ShieldCheck, Save, FileText, Sparkles, Code2, Eye } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetCMSByKeyQuery,
  useUpdateCMSByKeyMutation,
} from "../redux/api/adminApiSlice";
import toast from "react-hot-toast";

const policyTabs = [
  { key: "privacy-policy", label: "Privacy Policy" },
  { key: "terms-of-service", label: "Terms of Service" },
  { key: "cookie-policy", label: "Cookie Policy" },
  { key: "warranty-policy", label: "Warranty Policy" },
];

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "align",
  "blockquote",
  "code-block",
  "link",
];

const PolicyManager = () => {
  const [activeTab, setActiveTab] = useState("privacy-policy");
  const [showCodeView, setShowCodeView] = useState(false);
  const { data: response, isLoading } = useGetCMSByKeyQuery("policies");
  const [updateCMS, { isLoading: isUpdating }] = useUpdateCMSByKeyMutation();

  const [policies, setPolicies] = useState({
    "privacy-policy": {
      title: "Privacy Policy",
      content: "<p>We value your privacy. This policy outlines our data collection, usage, and protection protocols.</p>",
    },
    "terms-of-service": {
      title: "Terms of Service",
      content: "<p>By utilizing our repair services and website, you agree to the following terms and conditions.</p>",
    },
    "cookie-policy": {
      title: "Cookie Policy",
      content: "<p>We use essential cookies to optimize user experience and analyze website traffic.</p>",
    },
    "warranty-policy": {
      title: "Warranty Policy",
      content: "<p>All hardware replacements are backed by our comprehensive warranty guarantee.</p>",
    },
  });

  useEffect(() => {
    if (response?.data) {
      setPolicies((prev) => ({
        ...prev,
        ...response.data,
      }));
    }
  }, [response]);

  const handleSave = async () => {
    try {
      await updateCMS({
        key: "policies",
        data: policies,
      }).unwrap();
      toast.success("Legal policies saved & synced to live site!");
    } catch (err) {
      toast.error("Failed to save policy");
    }
  };

  const currentPolicy = policies[activeTab] || { title: "", content: "" };

  const handleContentChange = (value) => {
    setPolicies((prev) => ({
      ...prev,
      [activeTab]: { ...currentPolicy, content: value },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#80CF16]/10 border border-[#80CF16]/20 text-[#80CF16] text-xs font-bold mb-2">
              <Sparkles size={12} />
              <span>WYSIWYG Rich Text Editor</span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Legal & Policy Document Editor
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Format text, change colors, add headings, lists, and links easily.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCodeView(!showCodeView)}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              {showCodeView ? <Eye size={14} /> : <Code2 size={14} />}
              <span>{showCodeView ? "Visual Editor" : "HTML Code"}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="px-5 py-2.5 rounded-xl bg-[#80CF16] text-black font-extrabold text-xs tracking-wide flex items-center gap-2 hover:bg-[#91e81b] transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(128,207,22,0.3)]"
            >
              <Save size={16} />
              <span>{isUpdating ? "Saving..." : "Save Policies"}</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6 overflow-x-auto">
          {policyTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-[#80CF16] text-black font-bold shadow-[0_0_15px_rgba(128,207,22,0.25)]"
                  : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor Area */}
        {isLoading ? (
          <div className="py-8 text-center text-xs text-zinc-500">Loading policy content...</div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Document Title
              </label>
              <input
                type="text"
                value={currentPolicy.title}
                onChange={(e) =>
                  setPolicies({
                    ...policies,
                    [activeTab]: { ...currentPolicy, title: e.target.value },
                  })
                }
                className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Document Content
              </label>

              {showCodeView ? (
                <textarea
                  rows={14}
                  value={currentPolicy.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl p-4 font-mono text-xs text-zinc-200 focus:outline-none focus:border-[#80CF16] leading-relaxed"
                />
              ) : (
                <div className="quill-dark-wrapper rounded-2xl overflow-hidden border border-white/10 bg-[#18181b]">
                  <ReactQuill
                    theme="snow"
                    value={currentPolicy.content}
                    onChange={handleContentChange}
                    modules={modules}
                    formats={formats}
                    placeholder="Write or paste your legal policy content here..."
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom Quill Dark Theme Styling */}
      <style>{`
        .quill-dark-wrapper .ql-toolbar.ql-snow {
          background-color: #121215;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 14px;
        }

        .quill-dark-wrapper .ql-container.ql-snow {
          background-color: #18181b;
          border: none;
          min-height: 280px;
          color: #f4f4f5;
          font-size: 14px;
          line-height: 1.7;
        }

        .quill-dark-wrapper .ql-editor {
          min-height: 280px;
          padding: 16px 20px;
        }

        .quill-dark-wrapper .ql-editor.ql-blank::before {
          color: #71717a;
          font-style: normal;
        }

        /* SVG Icons in Toolbar */
        .quill-dark-wrapper .ql-snow .ql-stroke {
          stroke: #a1a1aa;
        }

        .quill-dark-wrapper .ql-snow .ql-fill {
          fill: #a1a1aa;
        }

        .quill-dark-wrapper .ql-snow .ql-picker {
          color: #a1a1aa;
          font-size: 12px;
        }

        .quill-dark-wrapper .ql-snow .ql-picker-options {
          background-color: #1f1f23;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          padding: 6px;
        }

        .quill-dark-wrapper .ql-snow .ql-picker-item {
          color: #d4d4d8;
        }

        .quill-dark-wrapper .ql-snow .ql-picker-item:hover,
        .quill-dark-wrapper .ql-snow .ql-picker-item.ql-selected {
          color: #80CF16;
        }

        .quill-dark-wrapper .ql-snow button:hover .ql-stroke,
        .quill-dark-wrapper .ql-snow .ql-picker:hover .ql-stroke,
        .quill-dark-wrapper .ql-snow button.ql-active .ql-stroke {
          stroke: #80CF16;
        }

        .quill-dark-wrapper .ql-snow button:hover .ql-fill,
        .quill-dark-wrapper .ql-snow button.ql-active .ql-fill {
          fill: #80CF16;
        }

        /* Editor Headings & Colors */
        .quill-dark-wrapper .ql-editor h1,
        .quill-dark-wrapper .ql-editor h2,
        .quill-dark-wrapper .ql-editor h3,
        .quill-dark-wrapper .ql-editor h4 {
          color: #ffffff;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .quill-dark-wrapper .ql-editor h1 { font-size: 1.75rem; }
        .quill-dark-wrapper .ql-editor h2 { font-size: 1.4rem; color: #80CF16; }
        .quill-dark-wrapper .ql-editor h3 { font-size: 1.2rem; }

        .quill-dark-wrapper .ql-editor p {
          margin-bottom: 0.75rem;
          color: #d4d4d8;
        }

        .quill-dark-wrapper .ql-editor a {
          color: #80CF16;
          text-decoration: underline;
        }

        .quill-dark-wrapper .ql-editor blockquote {
          border-left: 3px solid #80CF16;
          padding-left: 12px;
          color: #a1a1aa;
        }
      `}</style>
    </div>
  );
};

export default PolicyManager;
