import { useEffect, useState } from "react";
import {
  getAllFolders, createFolder, updateFolder, deleteFolder,
  getAllNotes, createNote, updateNote, deleteNote
} from "../services/api";
import {
  RiFolderLine, RiFolderOpenLine, RiAddLine, RiEditLine,
  RiDeleteBinLine, RiCloseLine, RiStickyNoteLine, RiCheckLine,
  RiArrowLeftLine, RiFileLine
} from "react-icons/ri";

const FOLDER_COLORS = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-red-500",
  "from-green-500 to-emerald-500",
  "from-yellow-500 to-orange-500",
  "from-indigo-500 to-violet-500",
];

export default function Notes() {
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [folderModal, setFolderModal] = useState({ open: false, folder: null });
  const [noteModal, setNoteModal] = useState({ open: false, note: null });
  const [viewNote, setViewNote] = useState(null);

  const fetchFolders = async () => {
    try {
      const res = await getAllFolders();
      setFolders(res.data.folders);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async (folderId) => {
    const res = await getAllNotes(folderId);
    setNotes(res.data.notes);
  };

  useEffect(() => { fetchFolders(); }, []);
  useEffect(() => { if (activeFolder) fetchNotes(activeFolder._id); }, [activeFolder]);

  const handleFolderSave = async (name, folderId) => {
    if (folderId) {
      const res = await updateFolder(folderId, { folderName: name });
      setFolders(folders.map(f => f._id === folderId ? { ...f, folderName: res.data.folder.folderName } : f));
    } else {
      const res = await createFolder({ folderName: name });
      setFolders([res.data.folder, ...folders]);
    }
    setFolderModal({ open: false, folder: null });
  };

  const handleFolderDelete = async (id) => {
    if (!confirm("Delete folder and all its notes?")) return;
    await deleteFolder(id);
    setFolders(folders.filter(f => f._id !== id));
    if (activeFolder?._id === id) setActiveFolder(null);
  };

  const handleNoteSave = async (data, noteId) => {
    if (noteId) {
      const res = await updateNote(noteId, data);
      setNotes(notes.map(n => n._id === noteId ? res.data.note : n));
    } else {
      const res = await createNote({ ...data, folderId: activeFolder._id });
      setNotes([res.data.note, ...notes]);
    }
    setNoteModal({ open: false, note: null });
  };

  const handleNoteDelete = async (id) => {
    if (!confirm("Delete this note?")) return;
    await deleteNote(id);
    setNotes(notes.filter(n => n._id !== id));
    if (viewNote?._id === id) setViewNote(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {!activeFolder ? (
        // FOLDER VIEW
        <>
          <div className="section-header">
            <div>
              <h1 className="page-title">Notes Hub</h1>
              <p className="page-subtitle">Organize your knowledge in folders</p>
            </div>
            <button onClick={() => setFolderModal({ open: true, folder: null })} className="btn-primary flex items-center gap-2">
              <RiAddLine /> New Folder
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-surface-hover rounded-xl animate-pulse" />)}
            </div>
          ) : folders.length === 0 ? (
            <div className="empty-state glass-card">
              <RiFolderLine className="text-5xl text-white/20 mb-4" />
              <h3 className="text-white font-medium text-lg mb-1">No folders yet</h3>
              <p className="text-white/40 text-sm mb-5">Create folders like DSA, DBMS, OS to organize your notes.</p>
              <button onClick={() => setFolderModal({ open: true, folder: null })} className="btn-primary flex items-center gap-2">
                <RiAddLine /> Create First Folder
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {folders.map((folder, idx) => (
                <div key={folder._id} className="glass-card p-5 cursor-pointer group relative" onClick={() => setActiveFolder(folder)}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${FOLDER_COLORS[idx % FOLDER_COLORS.length]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <RiFolderOpenLine className="text-white text-2xl" />
                  </div>
                  <h3 className="text-white font-semibold group-hover:text-accent-glow transition-colors">{folder.folderName}</h3>
                  <p className="text-white/40 text-xs mt-1">{folder.noteCount} {folder.noteCount === 1 ? "note" : "notes"}</p>

                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setFolderModal({ open: true, folder }); }}
                      className="p-1.5 rounded-lg bg-surface-hover hover:bg-accent-purple/20 text-white/40 hover:text-accent-glow transition-all">
                      <RiEditLine className="text-sm" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleFolderDelete(folder._id); }}
                      className="p-1.5 rounded-lg bg-surface-hover hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all">
                      <RiDeleteBinLine className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // NOTES VIEW
        <>
          <div className="section-header">
            <div className="flex items-center gap-3">
              <button onClick={() => { setActiveFolder(null); setViewNote(null); }} className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-all">
                <RiArrowLeftLine className="text-lg" />
              </button>
              <div>
                <h1 className="page-title flex items-center gap-2">
                  <RiFolderOpenLine className="text-accent-glow" />
                  {activeFolder.folderName}
                </h1>
                <p className="page-subtitle">{notes.length} notes</p>
              </div>
            </div>
            <button onClick={() => setNoteModal({ open: true, note: null })} className="btn-primary flex items-center gap-2">
              <RiAddLine /> New Note
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Notes List */}
            <div className={`${viewNote ? "hidden md:block" : ""} md:col-span-1 space-y-3`}>
              {notes.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <RiStickyNoteLine className="text-3xl text-white/20 mx-auto mb-3" />
                  <p className="text-white/50 text-sm">No notes yet.</p>
                  <button onClick={() => setNoteModal({ open: true, note: null })} className="btn-primary mt-3 text-sm py-2 px-4 flex items-center gap-1 mx-auto">
                    <RiAddLine /> Add Note
                  </button>
                </div>
              ) : notes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => setViewNote(note)}
                  className={`glass-card p-4 cursor-pointer group ${viewNote?._id === note._id ? "border-accent-purple/60 shadow-glow-sm" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-white font-medium text-sm truncate group-hover:text-accent-glow transition-colors">{note.title}</h3>
                      <p className="text-white/40 text-xs mt-1 line-clamp-2">{note.content}</p>
                      <p className="text-white/20 text-xs mt-2">{new Date(note.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); setNoteModal({ open: true, note }); }}
                        className="p-1.5 rounded hover:bg-accent-purple/20 text-white/40 hover:text-accent-glow transition-all">
                        <RiEditLine className="text-xs" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleNoteDelete(note._id); }}
                        className="p-1.5 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all">
                        <RiDeleteBinLine className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Note Viewer */}
            <div className={`${!viewNote ? "hidden md:flex" : "flex"} md:col-span-2`}>
              {viewNote ? (
                <div className="glass-card p-6 w-full animate-fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">{viewNote.title}</h2>
                    <div className="flex gap-2">
                      <button onClick={() => { setNoteModal({ open: true, note: viewNote }); }} className="p-2 rounded-lg hover:bg-accent-purple/20 text-white/40 hover:text-accent-glow transition-all">
                        <RiEditLine />
                      </button>
                      <button onClick={() => handleNoteDelete(viewNote._id)} className="p-2 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all">
                        <RiDeleteBinLine />
                      </button>
                      <button onClick={() => setViewNote(null)} className="md:hidden p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white">
                        <RiArrowLeftLine />
                      </button>
                    </div>
                  </div>
                  <p className="text-white/30 text-xs mb-4">{new Date(viewNote.createdAt).toLocaleString()}</p>
                  <div className="divider" />
                  <div className="text-white/70 leading-relaxed whitespace-pre-wrap font-mono text-sm">{viewNote.content}</div>
                </div>
              ) : (
                <div className="glass-card p-8 w-full flex flex-col items-center justify-center text-center">
                  <RiFileLine className="text-4xl text-white/20 mb-3" />
                  <p className="text-white/40">Select a note to view it</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Folder Modal */}
      {folderModal.open && (
        <FolderModal
          folder={folderModal.folder}
          onClose={() => setFolderModal({ open: false, folder: null })}
          onSave={handleFolderSave}
        />
      )}

      {/* Note Modal */}
      {noteModal.open && (
        <NoteModal
          note={noteModal.note}
          onClose={() => setNoteModal({ open: false, note: null })}
          onSave={handleNoteSave}
          onView={setViewNote}
        />
      )}
    </div>
  );
}

function FolderModal({ folder, onClose, onSave }) {
  const [name, setName] = useState(folder?.folderName || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await onSave(name, folder?._id); } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{folder ? "Rename Folder" : "New Folder"}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><RiCloseLine className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Folder Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. DSA, DBMS, OS" className="input-field" required autoFocus />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving..." : <><RiCheckLine className="inline" /> Save</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NoteModal({ note, onClose, onSave }) {
  const [form, setForm] = useState({ title: note?.title || "", content: note?.content || "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await onSave(form, note?._id); } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{note ? "Edit Note" : "New Note"}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><RiCloseLine className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Note title..." className="input-field" required autoFocus />
          </div>
          <div>
            <label className="label">Content</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your notes here..." className="textarea-field font-mono text-sm" rows={10} required />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving..." : <><RiCheckLine className="inline" /> Save Note</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
