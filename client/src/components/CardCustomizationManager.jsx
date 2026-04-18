import { useState } from "react";
import { useCardCustomization } from "./CardCustomizationContext";
import CardPreview from "./CardPreview";

const SAMPLE_CARD = {
  name: "Sample Card",
  mana_cost: "2RG",
  card_type: "Creature",
  subtype: "Dragon Warrior",
  colors: ["R", "G"],
  power: "5",
  toughness: "4",
  rarity: "Rare",
  abilities: "Flying, trample\n\nWhen this creature enters, deal 3 damage.",
  flavor_text: '"The mountains tremble at its approach."',
  art_style: "standard",
  set_name: "CST",
  image_url: "",
  image_pos_x: 50,
  image_pos_y: 50,
};

export default function CardCustomizationManager() {
  const { customization, refetchCustomization } = useCardCustomization();
  const [uploading, setUploading] = useState(null);

  const uploadFile = async (file) => {
    const form = new FormData();
    form.append("image", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    return data.url || null;
  };

  const setSetting = async (key, value) => {
    await fetch(`/api/card-customization/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    refetchCustomization();
  };

  const removeSetting = async (key) => {
    await fetch(`/api/card-customization/${key}`, { method: "DELETE" });
    refetchCustomization();
  };

  const handleImageUpload = async (settingKey, file) => {
    if (!file) return;
    setUploading(settingKey);
    try {
      const url = await uploadFile(file);
      if (url) await setSetting(settingKey, url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(null);
  };

  const handleFontUpload = async (file) => {
    if (!file) return;
    setUploading("font");
    try {
      const url = await uploadFile(file);
      if (url) {
        const fontName = file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[^a-zA-Z0-9 _-]/g, "");
        await setSetting("font_url", url);
        await setSetting("font_name", fontName);
      }
    } catch (err) {
      console.error("Font upload failed:", err);
    }
    setUploading(null);
  };

  return (
    <div className="customization-manager">
      <div className="customization-header">
        <h1>Card Customization</h1>
        <p className="subtitle">
          Customize card borders, text box styling, and fonts used across all
          cards.
        </p>
      </div>

      <div className="customization-layout">
        <div className="customization-settings">
          {/* Font Section */}
          <div className="custom-section">
            <h2>Card Font</h2>
            <p className="section-desc">
              Upload a .ttf, .otf, .woff, or .woff2 font file to use on card
              text.
            </p>
            <div className="custom-setting-row">
              <div className="setting-status">
                {customization.font_url ? (
                  <>
                    <span className="mana-status mana-status--set">
                      {customization.font_name || "Custom"}
                    </span>
                    <span
                      className="font-preview-text"
                      style={{
                        fontFamily: customization.font_name || "CustomCardFont",
                      }}
                    >
                      The quick brown fox
                    </span>
                  </>
                ) : (
                  <span className="mana-status mana-status--default">
                    Default (Cinzel / Inter)
                  </span>
                )}
              </div>
              <div className="setting-actions">
                <label className="btn btn-sm btn-primary mana-upload-label">
                  {uploading === "font"
                    ? "Uploading…"
                    : customization.font_url
                      ? "Replace Font"
                      : "Upload Font"}
                  <input
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    onChange={(e) => handleFontUpload(e.target.files?.[0])}
                    hidden
                    disabled={uploading === "font"}
                  />
                </label>
                {customization.font_url && (
                  <button
                    className="btn btn-sm btn-ghost action-btn-danger"
                    onClick={() => {
                      removeSetting("font_url");
                      removeSetting("font_name");
                    }}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Border Image Section */}
          <div className="custom-section">
            <h2>Card Border Image</h2>
            <p className="section-desc">
              Upload an image to use as the card's outer border/frame. Use a
              seamless or card-shaped image for best results.
            </p>
            <div className="custom-setting-row">
              <div className="setting-status">
                {customization.border_image_url ? (
                  <div className="setting-thumb">
                    <img src={customization.border_image_url} alt="border" />
                    <span className="mana-status mana-status--set">Custom</span>
                  </div>
                ) : (
                  <span className="mana-status mana-status--default">
                    Default (solid color)
                  </span>
                )}
              </div>
              <div className="setting-actions">
                <label className="btn btn-sm btn-primary mana-upload-label">
                  {uploading === "border_image_url"
                    ? "Uploading…"
                    : customization.border_image_url
                      ? "Replace"
                      : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload("border_image_url", e.target.files?.[0])
                    }
                    hidden
                    disabled={uploading === "border_image_url"}
                  />
                </label>
                {customization.border_image_url && (
                  <button
                    className="btn btn-sm btn-ghost action-btn-danger"
                    onClick={() => removeSetting("border_image_url")}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Text Box Border Image Section */}
          <div className="custom-section">
            <h2>Text Box Border Image</h2>
            <p className="section-desc">
              Upload an image to use as the border around the card's
              rules/description text area.
            </p>
            <div className="custom-setting-row">
              <div className="setting-status">
                {customization.textbox_border_image_url ? (
                  <div className="setting-thumb">
                    <img
                      src={customization.textbox_border_image_url}
                      alt="textbox border"
                    />
                    <span className="mana-status mana-status--set">Custom</span>
                  </div>
                ) : (
                  <span className="mana-status mana-status--default">
                    Default (semi-transparent)
                  </span>
                )}
              </div>
              <div className="setting-actions">
                <label className="btn btn-sm btn-primary mana-upload-label">
                  {uploading === "textbox_border_image_url"
                    ? "Uploading…"
                    : customization.textbox_border_image_url
                      ? "Replace"
                      : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(
                        "textbox_border_image_url",
                        e.target.files?.[0],
                      )
                    }
                    hidden
                    disabled={uploading === "textbox_border_image_url"}
                  />
                </label>
                {customization.textbox_border_image_url && (
                  <button
                    className="btn btn-sm btn-ghost action-btn-danger"
                    onClick={() => removeSetting("textbox_border_image_url")}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="customization-preview">
          <h3>Live Preview</h3>
          <CardPreview card={SAMPLE_CARD} />
        </div>
      </div>
    </div>
  );
}
