
import "./PopupAlert.css";

export default function PopupAlert({ mesaj, onClose, actiune }) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>{mesaj}</h3>
        <div className="popup-buttons">
          <button className="btn-primary" onClick={actiune}>
            Mergi la abonamente
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Închide
          </button>
        </div>
      </div>
    </div>
  );
}
