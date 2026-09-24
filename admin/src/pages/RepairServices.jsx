import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Wrench,
  DollarSign,
  Clock,
  ShieldCheck,
  Filter,
} from "lucide-react";
import Modal from "../components/common/Modal";
import {
  useGetServicesQuery,
  useGetModelsQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from "../redux/api/adminApiSlice";
import toast from "react-hot-toast";

const RepairServices = () => {
  const [selectedModelFilter, setSelectedModelFilter] = useState("");

  const { data: servicesResponse, isLoading: servicesLoading } =
    useGetServicesQuery(selectedModelFilter || undefined);
  const { data: modelsResponse } = useGetModelsQuery();

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const services = servicesResponse?.data || [];
  const models = modelsResponse?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    modelId: "",
    price: "",
    details: "",
    warranty: "1 Year Warranty",
    estimatedTime: "30 - 60 mins",
    order: 0,
  });

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        modelId: service.modelId?._id || service.modelId || "",
        price: service.price,
        details: Array.isArray(service.details) ? service.details.join(", ") : service.details || "",
        warranty: service.warranty || "1 Year Warranty",
        estimatedTime: service.estimatedTime || "30 - 60 mins",
        order: service.order || 0,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        modelId: selectedModelFilter || models[0]?._id || "",
        price: "£99",
        details: "Original OLED Display, TrueTone Preserved",
        warranty: "1 Year Warranty",
        estimatedTime: "30 mins",
        order: services.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const detailsArray = formData.details
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        details: detailsArray,
      };

      if (editingService) {
        await updateService({ id: editingService._id, ...payload }).unwrap();
        toast.success("Service updated & synced to live site!");
      } else {
        await createService(payload).unwrap();
        toast.success("Service created & synced to live site!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save repair service");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this repair service?")) {
      try {
        await deleteService(id).unwrap();
        toast.success("Service deleted!");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete service");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Row */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Repair Services & Pricing Matrix
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Changes to prices or warranty here will instantly update the quote calculator on the frontend.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by device model */}
            <div className="relative">
              <select
                value={selectedModelFilter}
                onChange={(e) => setSelectedModelFilter(e.target.value)}
                className="bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-xs font-semibold text-white focus:outline-none focus:border-[#80CF16]"
              >
                <option value="">All Models</option>
                {models.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 rounded-xl bg-[#80CF16] text-black font-extrabold text-xs tracking-wide flex items-center gap-2 hover:bg-[#91e81b] transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Service</span>
            </button>
          </div>
        </div>

        {/* Services Table */}
        {servicesLoading ? (
          <div className="py-8 text-center text-xs text-zinc-500">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No repair services found. Click Add Service to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-400 border-b border-white/5 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-4">Service Name</th>
                  <th className="pb-3 px-4">Target Model</th>
                  <th className="pb-3 px-4">Live Price</th>
                  <th className="pb-3 px-4">Warranty</th>
                  <th className="pb-3 px-4">Duration</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {services.map((srv) => (
                  <tr key={srv._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#80CF16]">
                          <Wrench size={16} />
                        </div>
                        <div>
                          <p>{srv.name}</p>
                          {srv.details && srv.details.length > 0 && (
                            <p className="text-[10px] text-zinc-400 font-normal">
                              {srv.details.join(" • ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-medium">
                        {srv.modelId?.name || "All"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm text-[#80CF16]">
                      {srv.price}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">
                      {srv.warranty || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {srv.estimatedTime || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(srv)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(srv._id)}
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

      {/* Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Edit Repair Service" : "New Repair Service"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
              Service Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Screen Replacement, Battery Repair"
              required
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
              Device Model
            </label>
            <select
              value={formData.modelId}
              onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
              required
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
            >
              <option value="">Select Device Model</option>
              {models.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
                Price (with currency)
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. £149 or Contact Us"
                required
                className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
                Warranty
              </label>
              <input
                type="text"
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                placeholder="e.g. 1 Year Warranty"
                className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
              Feature Highlights (comma separated)
            </label>
            <input
              type="text"
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="e.g. Original OLED Screen, TrueTone Preserved"
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
                Estimated Time
              </label>
              <input
                type="text"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                placeholder="e.g. 30 mins"
                className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#80CF16]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="w-full py-3 rounded-xl bg-[#80CF16] text-black font-extrabold text-sm hover:bg-[#91e81b] transition-all cursor-pointer mt-4"
          >
            {isCreating || isUpdating ? "Saving..." : "Save Service"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default RepairServices;
