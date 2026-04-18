import { useState } from "react";
import { useManaImages } from "./ManaSymbol";
import ManaSymbol from "./ManaSymbol";

const ALL_SYMBOLS = [
  { key: "W", label: "White" },
  { key: "U", label: "Blue" },
  { key: "B", label: "Black" },
  { key: "R", label: "Red" },
  { key: "G", label: "Green" },
  { key: "X", label: "X (Variable)" },
  { key: "0", label: "0" },
  { key: "1", label: "1" },
  { key: "2", label: "2" },
  { key: "3", label: "3" },
  { key: "4", label: "4" },
  { key: "5", label: "5" },
  { key: "6", label: "6" },
  { key: "7", label: "7" },
  { key: "8", label: "8" },
  { key: "9", label: "9" },
  { key: "10", label: "10" },
];

export default function ManaImageManager() {
  const { manaImages, refetchManaImages } = useManaImages();
  const [uploading, setUploading] = useState(null);

  const handleUpload = async (symbol, file) => {
    if (!file) return;
    setUploading(symbol);
    try {
      const form = new FormData();
      form.append("image", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const uploadData = await uploadRes.json();
      if (uploadData.url) {
        await fetch(`/api/mana-images/${symbol}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_url: uploadData.url }),
        });
        refetchManaImages();
      }
    } catch (err) {
      console.error("Mana image upload failed:", err);
    }
    setUploading(null);
  };

  const handleRemove = async (symbol) => {
    try {
      await fetch(`/api/mana-images/${symbol}`, { method: "DELETE" });
      refetchManaImages();
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  return (
    <div className="mana-image-manager">
      <div className="mana-manager-header">
        <h1>Mana Symbol Art</h1>
        <p className="subtitle">
          Upload custom images for each mana symbol. They will replace the
          default text icons on all cards.
        </p>
      </div>

      <div className="mana-symbol-grid">
        {ALL_SYMBOLS.map(({ key, label }) => (
          <div key={key} className="mana-symbol-card">
            <div className="mana-symbol-preview">
              <ManaSymbol symbol={key} size={48} />
            </div>
            <div className="mana-symbol-info">
              <span className="mana-symbol-label">{label}</span>
              <span className="mana-symbol-key">({key})</span>
            </div>
            <div className="mana-symbol-actions">
              {manaImages[key] ? (
                <>
                  <span className="mana-status mana-status--set">Custom</span>
                  <label className="btn btn-sm btn-secondary mana-upload-label">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload(key, e.target.files?.[0])}
                      hidden
                    />
                  </label>
                  <button
                    className="btn btn-sm btn-ghost action-btn-danger"
                    onClick={() => handleRemove(key)}
                    title="Remove custom image"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <span className="mana-status mana-status--default">
                    Default
                  </span>
                  <label className="btn btn-sm btn-primary mana-upload-label">
                    {uploading === key ? "Uploading…" : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload(key, e.target.files?.[0])}
                      hidden
                      disabled={uploading === key}
                    />
                  </label>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
