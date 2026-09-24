import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Search,
  Upload,
  Image as ImageIcon,
  X,
  FileText,
  Cpu,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import Modal from "../components/common/Modal";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImageMutation,
  useUploadMultipleImagesMutation,
} from "../redux/api/adminApiSlice";
import toast from "react-hot-toast";

const quillModules = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "color",
  "background",
  "list",
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: response, isLoading } = useGetProductsQuery({ search: searchTerm });
  const { data: catResponse } = useGetCategoriesQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [uploadImage, { isLoading: isUploadingSingle }] = useUploadImageMutation();
  const [uploadMultipleImages, { isLoading: isUploadingMultiple }] = useUploadMultipleImagesMutation();

  const products = response?.data || [];
  const categories = catResponse?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState("general"); // 'general' | 'photos' | 'specs' | 'condition'
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    condition: "Like New",
    categoryId: "",
    shortDescription: "",
    offerPrice: "649",
    oldPrice: "999",
    savePercentage: 35,
    storage: "256GB",
    batteryHealth: "98%",
    warranty: "1 Year Hardware Warranty",
    thumbnail: "",
    galleries: [],
    technicalSpecsHtml: "",
    conditionReportHtml: "",
    isPopular: false,
    isSold: false,
  });

  const handleOpenModal = (prod = null) => {
    setActiveFormTab("general");
    if (prod) {
      setEditingProduct(prod);
      setFormData({
        name: prod.name || "",
        condition: prod.condition || "Like New",
        categoryId: prod.categoryId?._id || prod.categoryId || "",
        shortDescription: prod.shortDescription || "",
        offerPrice: prod.offerPrice || "",
        oldPrice: prod.oldPrice || "",
        savePercentage: prod.savePercentage || 0,
        storage: prod.storage || "128GB",
        batteryHealth: prod.batteryHealth || "95%",
        warranty: prod.warranty || "1 Year Hardware Warranty",
        thumbnail: prod.thumbnail || "",
        galleries: prod.galleries || [],
        technicalSpecsHtml: prod.technicalSpecsHtml || "<p><strong>Display:</strong> 6.1-inch Super Retina XDR<br/><strong>Chip:</strong> Apple A17 Pro<br/><strong>RAM:</strong> 8GB<br/><strong>Storage:</strong> 256GB NVMe</p>",
        conditionReportHtml: prod.conditionReportHtml || "<p><strong>Screen:</strong> Flawless (No scratches)<br/><strong>Body:</strong> Mint condition<br/><strong>Battery Health:</strong> 98% OEM<br/><strong>Technician Note:</strong> 100% functional, 90-point tested.</p>",
        isPopular: prod.isPopular || false,
        isSold: prod.isSold || false,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        condition: "Like New",
        categoryId: categories[0]?._id || "",
        shortDescription: "Certified pre-owned device in mint condition.",
        offerPrice: "599",
        oldPrice: "899",
        savePercentage: 33,
        storage: "256GB",
        batteryHealth: "98%",
        warranty: "1 Year Hardware Warranty",
        thumbnail: "",
        galleries: [],
        technicalSpecsHtml: "<p><strong>Display:</strong> 6.1-inch Super Retina XDR OLED<br/><strong>Processor:</strong> High Performance Chip<br/><strong>Camera:</strong> 48MP Triple Lens System</p>",
        conditionReportHtml: "<p><strong>Screen:</strong> Flawless, zero scratches<br/><strong>Frame:</strong> Mint Grade A condition<br/><strong>Battery Health:</strong> 98%<br/><strong>Inspection:</strong> 100% passed all hardware diagnostics.</p>",
        isPopular: false,
        isSold: false,
      });
    }
    setIsModalOpen(true);
  };

  // Handle Cloudinary Single Thumbnail Upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);

    try {
      toast.loading("Uploading cover image to Cloudinary...", { id: "upload-thumb" });
      const res = await uploadImage(data).unwrap();
      const imageUrl = res.data?.url || res.data?.path;
      setFormData((prev) => ({ ...prev, thumbnail: imageUrl }));
      toast.success("Cover image uploaded successfully!", { id: "upload-thumb" });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload image", { id: "upload-thumb" });
    }
  };

  // Handle Cloudinary Multiple Gallery Images Upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const data = new FormData();
    files.forEach((f) => data.append("images", f));

    try {
      toast.loading(`Uploading ${files.length} photo(s) to Cloudinary...`, { id: "upload-gallery" });
      const res = await uploadMultipleImages(data).unwrap();
      const newUrls = Array.isArray(res.data) ? res.data : [];
      setFormData((prev) => ({
        ...prev,
        galleries: [...prev.galleries, ...newUrls],
      }));
      toast.success("Gallery photos uploaded successfully!", { id: "upload-gallery" });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload gallery images", { id: "upload-gallery" });
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      galleries: prev.galleries.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...formData }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await createProduct(formData).unwrap();
        toast.success("Product added to marketplace!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted!");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete product");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Marketplace Stock (Used & Refurbished Devices)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Manage pre-owned inventory with Cloudinary gallery images, specs, and condition reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search devices..."
                className="bg-[#18181b] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#80CF16]"
              />
            </div>

            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 rounded-xl bg-[#80CF16] text-black font-extrabold text-xs tracking-wide flex items-center gap-2 hover:bg-[#91e81b] transition-all cursor-pointer shadow-[0_0_15px_rgba(128,207,22,0.25)]"
            >
              <Plus size={16} />
              <span>Add Device</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="py-8 text-center text-xs text-zinc-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No devices found in marketplace. Click Add Device.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((prod) => (
              <div
                key={prod._id}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between transition-all group hover:border-[#80CF16]/30"
              >
                <div>
                  {/* Thumbnail Preview on Card */}
                  <div className="w-full aspect-[4/3] rounded-xl bg-[#0d0d10] border border-white/5 flex items-center justify-center mb-3 relative overflow-hidden">
                    {prod.thumbnail ? (
                      <img
                        src={prod.thumbnail}
                        alt={prod.name}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <ImageIcon className="text-zinc-600 text-3xl" />
                    )}
                    {prod.galleries && prod.galleries.length > 0 && (
                      <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-[10px] text-zinc-300 font-bold px-2 py-0.5 rounded-md border border-white/10">
                        +{prod.galleries.length} photos
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#80CF16]/10 text-[#80CF16] border border-[#80CF16]/20 text-[10px] font-bold uppercase">
                      {prod.condition}
                    </span>
                    {prod.isPopular && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1">
                        <Sparkles size={10} /> Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                    {prod.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 my-2.5 text-[11px] text-zinc-400 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    <div>Storage: <strong className="text-white">{prod.storage}</strong></div>
                    <div>Battery: <strong className="text-[#80CF16]">{prod.batteryHealth}</strong></div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-black text-[#80CF16]">
                      £{prod.offerPrice}
                    </span>
                    {prod.oldPrice && (
                      <span className="text-xs text-zinc-500 line-through">
                        £{prod.oldPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-[11px] text-zinc-400">
                    {prod.isSold ? (
                      <span className="text-red-400 font-bold">● Sold Out</span>
                    ) : (
                      <span className="text-[#80CF16] font-bold">● In Stock</span>
                    )}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(prod)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
                      title="Edit device"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                      title="Delete device"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Marketplace Device" : "Add Device to Marketplace"}
        maxWidth="max-w-3xl"
      >
        {/* Form Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-5 overflow-x-auto">
          {[
            { id: "general", label: "General Info", icon: Sparkles },
            { id: "photos", label: "Photos (Cloudinary)", icon: ImageIcon },
            { id: "specs", label: "Technical Specs", icon: Cpu },
            { id: "condition", label: "Condition Report", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFormTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFormTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#80CF16] text-black shadow-[0_0_12px_rgba(128,207,22,0.25)]"
                    : "bg-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* TAB 1: General Info */}
          {activeFormTab === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Device Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. iPhone 15 Pro"
                    required
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Condition Grade
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Offer Price (£) *
                  </label>
                  <input
                    type="text"
                    value={formData.offerPrice}
                    onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                    placeholder="e.g. 649"
                    required
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Original Price (£)
                  </label>
                  <input
                    type="text"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    placeholder="e.g. 999"
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Discount %
                  </label>
                  <input
                    type="number"
                    value={formData.savePercentage}
                    onChange={(e) => setFormData({ ...formData, savePercentage: Number(e.target.value) })}
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Storage
                  </label>
                  <input
                    type="text"
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    placeholder="e.g. 256GB"
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Battery Health
                  </label>
                  <input
                    type="text"
                    value={formData.batteryHealth}
                    onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
                    placeholder="e.g. 98%"
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Warranty Tag
                  </label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    placeholder="e.g. 1 Year Hardware Warranty"
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Short tagline or summary for the marketplace cards..."
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded accent-[#80CF16]"
                  />
                  <span>Mark as Popular</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSold}
                    onChange={(e) => setFormData({ ...formData, isSold: e.target.checked })}
                    className="rounded accent-[#80CF16]"
                  />
                  <span>Mark as Sold Out</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: Photos (Cloudinary) */}
          {activeFormTab === "photos" && (
            <div className="space-y-6">
              {/* Cover Thumbnail */}
              <div className="p-4 rounded-2xl bg-[#141416] border border-white/5">
                <label className="block text-xs font-bold text-white uppercase mb-2">
                  Main Cover Thumbnail (Shows on Marketplace Card)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-32 rounded-xl bg-[#0a0a0c] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.thumbnail ? (
                      <img
                        src={formData.thumbnail}
                        alt="Thumbnail"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-center p-2 text-zinc-600 text-xs">
                        No cover uploaded
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer">
                      <Upload size={14} />
                      <span>{isUploadingSingle ? "Uploading..." : "Upload Cover to Cloudinary"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                        disabled={isUploadingSingle}
                      />
                    </label>
                    <p className="text-[11px] text-zinc-400">
                      Or paste an external image URL directly:
                    </p>
                    <input
                      type="text"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#80CF16]"
                    />
                  </div>
                </div>
              </div>

              {/* Multi-photo Gallery */}
              <div className="p-4 rounded-2xl bg-[#141416] border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-xs font-bold text-white uppercase">
                      Multiple Detail Gallery Photos
                    </label>
                    <p className="text-[11px] text-zinc-400">
                      Users can click through multiple high-res angles on the product detail page.
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#80CF16] text-black text-xs font-extrabold hover:bg-[#91e81b] transition-all cursor-pointer shadow-sm">
                    <Upload size={13} />
                    <span>{isUploadingMultiple ? "Uploading..." : "Add Multiple Photos"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                      disabled={isUploadingMultiple}
                    />
                  </label>
                </div>

                {formData.galleries.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-500 border border-dashed border-white/10 rounded-xl">
                    No extra gallery photos yet. Click &quot;Add Multiple Photos&quot; to upload angles.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3">
                    {formData.galleries.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group aspect-square rounded-xl bg-[#0a0a0c] border border-white/10 overflow-hidden flex items-center justify-center p-1"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                          title="Remove photo"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Technical Specs (React Quill) */}
          {activeFormTab === "specs" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-1">
                  Technical Specifications (WYSIWYG Editor)
                </label>
                <p className="text-[11px] text-zinc-400 mb-2">
                  Format bullet points, highlight key specs (Display, RAM, Chip, Cameras, Ports) in bold or custom color.
                </p>
              </div>

              <div className="quill-dark-wrapper rounded-xl overflow-hidden border border-white/10 bg-[#18181b]">
                <ReactQuill
                  theme="snow"
                  value={formData.technicalSpecsHtml}
                  onChange={(val) => setFormData({ ...formData, technicalSpecsHtml: val })}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Enter specifications (Display, Processor, Storage, Cameras)..."
                />
              </div>
            </div>
          )}

          {/* TAB 4: Condition Report (React Quill) */}
          {activeFormTab === "condition" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-1">
                  Condition Report & Inspection Checklist (WYSIWYG Editor)
                </label>
                <p className="text-[11px] text-zinc-400 mb-2">
                  Detail the cosmetic grade, screen status, body scratches, battery test, and certified technician notes.
                </p>
              </div>

              <div className="quill-dark-wrapper rounded-xl overflow-hidden border border-white/10 bg-[#18181b]">
                <ReactQuill
                  theme="snow"
                  value={formData.conditionReportHtml}
                  onChange={(val) => setFormData({ ...formData, conditionReportHtml: val })}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Enter condition grades, screen status, technician notes..."
                />
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
              <CheckCircle size={13} className="text-[#80CF16]" />
              <span>Real-time instant sync to Frontend</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="px-6 py-2.5 rounded-xl bg-[#80CF16] text-black font-extrabold text-xs tracking-wide hover:bg-[#91e81b] transition-all cursor-pointer shadow-[0_0_15px_rgba(128,207,22,0.3)] disabled:opacity-50"
              >
                {isCreating || isUpdating ? "Saving..." : editingProduct ? "Update Device" : "Create Device"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Quill Styling */}
      <style>{`
        .quill-dark-wrapper .ql-toolbar.ql-snow {
          background-color: #121215;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 8px 12px;
        }
        .quill-dark-wrapper .ql-container.ql-snow {
          background-color: #18181b;
          border: none;
          min-height: 200px;
          color: #f4f4f5;
          font-size: 13px;
        }
        .quill-dark-wrapper .ql-editor {
          min-height: 200px;
          padding: 14px 16px;
        }
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
        .quill-dark-wrapper .ql-snow button:hover .ql-stroke,
        .quill-dark-wrapper .ql-snow button.ql-active .ql-stroke {
          stroke: #80CF16;
        }
      `}</style>
    </div>
  );
};

export default Marketplace;
