import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Smartphone,
  CheckCircle2,
  XCircle,
  Laptop,
  Tablet,
  Watch,
  Gamepad,
} from "lucide-react";
import Modal from "../components/common/Modal";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetModelsQuery,
  useCreateModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
} from "../redux/api/adminApiSlice";
import toast from "react-hot-toast";

const CategoriesAndModels = () => {
  const { data: catResponse, isLoading: catLoading } = useGetCategoriesQuery();
  const { data: modelResponse, isLoading: modelLoading } = useGetModelsQuery();

  const [createCategory, { isLoading: isCreatingCat }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCat }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [createModel, { isLoading: isCreatingModel }] = useCreateModelMutation();
  const [updateModel, { isLoading: isUpdatingModel }] = useUpdateModelMutation();
  const [deleteModel] = useDeleteModelMutation();

  const categories = catResponse?.data || [];
  const models = modelResponse?.data || [];

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({ name: "", icon: "LuSmartphone", order: 0 });

  // Model Modal State
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [modelForm, setModelForm] = useState({
    name: "",
    categoryId: "",
    shortDescription: "",
    order: 0,
  });

  const handleOpenCatModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({ name: cat.name, icon: cat.icon || "LuSmartphone", order: cat.order || 0 });
    } else {
      setEditingCat(null);
      setCatForm({ name: "", icon: "LuSmartphone", order: categories.length + 1 });
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await updateCategory({ id: editingCat._id, ...catForm }).unwrap();
        toast.success("Category updated!");
      } else {
        await createCategory(catForm).unwrap();
        toast.success("Category created!");
      }
      setIsCatModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id).unwrap();
        toast.success("Category deleted!");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete category");
      }
    }
  };

  const handleOpenModelModal = (model = null) => {
    if (model) {
      setEditingModel(model);
      setModelForm({
        name: model.name,
        categoryId: model.categoryId?._id || model.categoryId || "",
        shortDescription: model.shortDescription || "",
        order: model.order || 0,
      });
    } else {
      setEditingModel(null);
      setModelForm({
        name: "",
        categoryId: categories[0]?._id || "",
        shortDescription: "",
        order: models.length + 1,
      });
    }
    setIsModelModalOpen(true);
  };

  const handleSaveModel = async (e) => {
    e.preventDefault();
    try {
      if (editingModel) {
        await updateModel({ id: editingModel._id, ...modelForm }).unwrap();
        toast.success("Device Model updated!");
      } else {
        await createModel(modelForm).unwrap();
        toast.success("Device Model created!");
      }
      setIsModelModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save model");
    }
  };

  const handleDeleteModel = async (id) => {
    if (window.confirm("Are you sure you want to delete this device model?")) {
      try {
        await deleteModel(id).unwrap();
        toast.success("Device Model deleted!");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete model");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Device Categories Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Device Categories
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Top-level device types (iPhone, Samsung, MacBook, iPad, etc.)
            </p>
          </div>
          <button
            onClick={() => handleOpenCatModal()}
            className="px-4 py-2.5 rounded-xl bg-[#80CF16] text-black font-extrabold text-xs tracking-wide flex items-center gap-2 hover:bg-[#91e81b] transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>

        {catLoading ? (
          <div className="py-8 text-center text-xs text-zinc-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">No categories found. Click Add Category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-[#80CF16]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#80CF16]/10 border border-[#80CF16]/20 flex items-center justify-center text-[#80CF16]">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                    <p className="text-[11px] text-zinc-400">
                      {cat.models?.length || 0} Models linked
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenCatModal(cat)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Device Models Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Device Models
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Specific models per category (iPhone 15 Pro, S24 Ultra, etc.)
            </p>
          </div>
          <button
            onClick={() => handleOpenModelModal()}
            className="px-4 py-2.5 rounded-xl bg-[#80CF16] text-black font-extrabold text-xs tracking-wide flex items-center gap-2 hover:bg-[#91e81b] transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Device Model</span>
          </button>
        </div>

        {modelLoading ? (
          <div className="py-8 text-center text-xs text-zinc-500">Loading models...</div>
        ) : models.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">No device models found. Click Add Device Model.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-400 border-b border-white/5 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-4">Model Name</th>
                  <th className="pb-3 px-4">Category</th>
                  <th className="pb-3 px-4">Description</th>
                  <th className="pb-3 px-4">Services</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {models.map((model) => (
                  <tr key={model._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {model.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                        {model.categoryId?.name || "Unassigned"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate">
                      {model.shortDescription || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-[#80CF16] font-semibold">
                      {model.services?.length || 0} repairs
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModelModal(model)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteModel(model._id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title={editingCat ? "Edit Category" : "New Category"}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={catForm.name}
              onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
              placeholder="e.g. iPhone, Samsung, MacBook"
              required
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={catForm.order}
              onChange={(e) => setCatForm({ ...catForm, order: Number(e.target.value) })}
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
            />
          </div>

          <button
            type="submit"
            disabled={isCreatingCat || isUpdatingCat}
            className="w-full py-3 rounded-xl bg-[#80CF16] text-black font-extrabold text-sm hover:bg-[#91e81b] transition-all cursor-pointer mt-4"
          >
            {isCreatingCat || isUpdatingCat ? "Saving..." : "Save Category"}
          </button>
        </form>
      </Modal>

      {/* Model Modal */}
      <Modal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        title={editingModel ? "Edit Device Model" : "New Device Model"}
      >
        <form onSubmit={handleSaveModel} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
              Model Name
            </label>
            <input
              type="text"
              value={modelForm.name}
              onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
              placeholder="e.g. iPhone 15 Pro Max"
              required
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
              Category
            </label>
            <select
              value={modelForm.categoryId}
              onChange={(e) => setModelForm({ ...modelForm, categoryId: e.target.value })}
              required
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
              Short Description
            </label>
            <input
              type="text"
              value={modelForm.shortDescription}
              onChange={(e) => setModelForm({ ...modelForm, shortDescription: e.target.value })}
              placeholder="e.g. 6.1-inch Super Retina XDR"
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={modelForm.order}
              onChange={(e) => setModelForm({ ...modelForm, order: Number(e.target.value) })}
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
            />
          </div>

          <button
            type="submit"
            disabled={isCreatingModel || isUpdatingModel}
            className="w-full py-3 rounded-xl bg-[#80CF16] text-black font-extrabold text-sm hover:bg-[#91e81b] transition-all cursor-pointer mt-4"
          >
            {isCreatingModel || isUpdatingModel ? "Saving..." : "Save Device Model"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriesAndModels;
