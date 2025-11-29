// src/components/InfoView.jsx
import { Phone, Radio, Smartphone, Mail, Copy } from "lucide-react";
import toast from "react-hot-toast";
import './Infoview.css'
export default function InfoView() {
  const handleCall = (number) => {
    window.location.href = `tel:${number.replace(/[^0-9+]/g, "")}`;
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié !");
  };

  return (
    <div className="info-view">
      <h1 className="info-title">Contacts & Fréquences</h1>

      {/* === FRÉQUENCES RADIO === */}
      <section className="info-section">
        <h2><Radio size={20} /> Fréquences radio</h2>
        <div className="freq-list">
          <div className="freq-item">
            <span className="label">Sol</span>
            <span className="value">121.705</span>
          </div>
          <div className="freq-item">
            <span className="label">Tour</span>
            <span className="value">118.700</span>
          </div>
          <div className="freq-item">
            <span className="label">Zin</span>
            <span className="value">131.510</span>
          </div>
          <div className="freq-item">
            <span className="label">Corsair</span>
            <span className="value">131.455</span>
          </div>
          <div className="freq-item">
            <span className="label">Aviapartner</span>
            <span className="value">131.410</span>
          </div>
        </div>
      </section>

      {/* === NUMÉROS DE TÉLÉPHONE === */}
      <section className="info-section">
        <h2><Phone size={20} /> Numéros de téléphone</h2>
        <div className="contact-list">
          <div className="contact-item" onClick={() => handleCall("0149755518")}>
            <span className="label">MCC</span>
            <span className="value">01 49 75 55 18</span>
            <Phone size={18} className="icon-call" />
          </div>
          <div className="contact-item" onClick={() => handleCall("0677025449")}>
            <span className="label">France Vision</span>
            <span className="value">06 77 02 54 49</span>
            <Phone size={18} className="icon-call" />
          </div>
          <div className="contact-item" onClick={() => handleCall("0174220235")}>
            <span className="label">Aviapartner</span>
            <span className="value">01 74 22 02 35</span>
            <Phone size={18} className="icon-call" />
          </div>
          <div className="contact-item" onClick={() => handleCall("0149757722")}>
            <span className="label">Maintenance passerelle</span>
            <span className="value">01 49 75 77 22 → 6</span>
            <Phone size={18} className="icon-call" />
          </div>
          <div className="contact-item" onClick={() => handleCall("0141759918")}>
            <span className="label">Pompier Orly</span>
            <span className="value">01 41 75 99 18</span>
            <Phone size={18} className="icon-call" />
          </div>
        </div>
      </section>

      {/* === APPLI SPOTLIGHT === */}
      <section className="info-section spotlight">
        <h2><Smartphone size={20} /> Appli</h2>
        <div className="spotlight-card">
          <div className="spotlight-line">
            <strong>Localisation LIFT :</strong>
            <span>
              Télécharger Spotlight ID :{" "}
              <span className="highlight">MCC@corsair.fr</span>
            </span>
          </div>
          <div className="spotlight-line">
            <strong>MDP :</strong>
            <span className="highlight">Reveal2020</span>
            <button
              className="btn-copy"
              onClick={() => handleCopy("Reveal2020")}
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="spotlight-line">
            <strong>Email :</strong>
            <span
              className="clickable"
              onClick={() => {
                handleCopy("MCC@corsair.fr");
                window.location.href = "mailto:MCC@corsair.fr";
              }}
            >
              MCC@corsair.fr <Mail size={16} />
            </span>
          </div>
        </div>
      </section>

      <div style={{ height: "100px" }}></div>
    </div>
  );
}