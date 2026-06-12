import { useEffect, useState, useRef } from "react";
import { getAllMaterials, uploadMaterial, deleteMaterial } from "../services/api";
import {
  RiUploadCloud2Line, RiFilePdfLine, RiFilePptLine, RiFileWordLine,
  RiDeleteBinLine, RiDownloadLine, RiCloseLine, RiBookOpenLine,
  RiFileUnknowLine
} from "react-icons/ri";

const FILE_ICONS = {
  pdf: { icon: RiFilePdfLine, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  ppt: { icon: RiFilePptLine, color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  pptx: { icon: RiFilePptLine, color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  doc: { icon: RiFileWordLine, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  docx: { icon: RiFileWordLine, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
};

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", file: null });
  const [error, setError] = useState("");
  const fileRef = useRef();

  const fetchMaterials = async () => {
    try {
      const res = await getAllMaterials();
      setMaterials(res.data.materials);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.file) return setError("Please select a file.");
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("file", form.file);
      const res = await uploadMaterial(fd);
      setMaterials([res.data.material, ...materials]);
      setUploadModal(false);
      setForm({ title: "", file: null });
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this material?")) return;
    await deleteMaterial(id);
    setMaterials(materials.filter(m => m._id !== id));
  };

  const getFileInfo = (type) => FILE_ICONS[type] || { icon: RiFileUnknowLine, color: "text-white/50", bg: "bg-white/5 border-white/10" };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="section-header">
        <div>
          <h1 className="page-title">Study Materials</h1>
          <p className="page-subtitle">Upload and manage your resources</p>
        </div>
        <button onClick={() => setUploadModal(true)} className="btn-primary flex items-center gap-2">
          <RiUploadCloud2Line /> Upload
        </button>
      </div>

      {/* File Type Legend */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        {Object.entries(FILE_ICONS).filter(([k]) => !k.startsWith("doc") || k === "docx").map(([type, { icon: Icon, color }]) => (
          <div key={type} className="flex items-center gap-1.5 text-sm text-white/40">
            <Icon className={color} />
            <span className="uppercase">{type}</span>
          </div>
        ))}
        <span className="text-white/20 text-xs ml-auto">{materials.length} files stored</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-36 bg-surface-hover rounded-xl animate-pulse" />)}
        </div>
      ) : materials.length === 0 ? (
        <div className="empty-state glass-card">
          <RiBookOpenLine className="text-5xl text-white/20 mb-4" />
          <h3 className="text-white font-medium text-lg mb-1">No materials yet</h3>
          <p className="text-white/40 text-sm mb-5">Upload PDFs, PPTs, and DOCX files to access them anywhere.</p>
          <button onClick={() => setUploadModal(true)} className="btn-primary flex items-center gap-2">
            <RiUploadCloud2Line /> Upload First File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((material) => {
            const { icon: Icon, color, bg } = getFileInfo(material.fileType);
            return (
              <div key={material._id} className="glass-card p-5 group">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}>
                    <Icon className={`text-2xl ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate group-hover:text-accent-glow transition-colors">{material.title}</h3>
                    <span className={`badge mt-1 ${bg} ${color} border uppercase text-xs`}>{material.fileType}</span>
                    <p className="text-white/30 text-xs mt-2">{new Date(material.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-surface-border">
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 text-sm text-white/60 hover:text-accent-glow bg-surface-hover hover:bg-accent-purple/10 py-2 rounded-lg transition-all border border-surface-border hover:border-accent-purple/30"
                  >
                    <RiDownloadLine /> Download
                  </a>
                  <button
                    onClick={() => handleDelete(material._id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all border border-surface-border hover:border-red-500/30"
                  >
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal && (
        <div className="modal-overlay" onClick={() => setUploadModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Upload Material</h2>
              <button onClick={() => setUploadModal(false)} className="text-white/40 hover:text-white"><RiCloseLine className="text-xl" /></button>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2.5 mb-4">{error}</div>}

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. DSA Notes PDF" className="input-field" required />
              </div>
              <div>
                <label className="label">File (PDF, PPT, DOCX)</label>
                <div
                  onClick={() => fileRef.current.click()}
                  className="border-2 border-dashed border-surface-border hover:border-accent-purple/50 rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-accent-purple/5"
                >
                  <RiUploadCloud2Line className="text-4xl text-white/30 mx-auto mb-2" />
                  {form.file ? (
                    <p className="text-accent-glow font-medium">{form.file.name}</p>
                  ) : (
                    <>
                      <p className="text-white/50 text-sm">Click to select file</p>
                      <p className="text-white/30 text-xs mt-1">PDF, PPT, PPTX, DOC, DOCX</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  onChange={e => setForm({ ...form, file: e.target.files[0] })}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setUploadModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary flex-1">
                  {uploading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading...</span> : <><RiUploadCloud2Line className="inline" /> Upload</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
