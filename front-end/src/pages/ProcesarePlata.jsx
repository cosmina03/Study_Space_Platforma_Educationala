import React from "react";
import "./ProcesarePlata.css";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../constants.js";

const ProcesarePlata = ({user}) => {
  const location = useLocation();
  const { credite, cost } = location.state;
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      await fetch(`${API_URL}/plata/${credite}`, {
        method: "POST",
        headers: {
          Authentication: localStorage.getItem("jwt") || "",
        },
      });
      alert("Plata procesata cu succes!");
      navigate("/");
    } catch (error) {
      alert("A aparut o eroare la plata.");
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-box">
        <h2 className="payment-title">
          <span role="img" aria-label="lock"> 🔒</span> Payment
        </h2>

        <div className="input-group">
          <label>Detinator Card</label>
          <input type="text" placeholder="Name on card" defaultValue={user.nume} />

          <label>Număr Card</label>
          <input type="text" placeholder="1234 5678 9012 3456" defaultValue="4632 1245 8253 8903" />

          <div className="input-row">
            <div>
              <label>Dată expirare</label>
              <input type="text" placeholder="MM/YY" defaultValue="09/27" />
            </div>
            <div>
              <label>CVV</label>
              <input type="text" placeholder="Code" defaultValue="628" />
            </div>
          </div>

          <div className="price-summary">
            <p>Plata pentru <strong>{credite}</strong> credit{credite > 1 ? 'e' : ''}</p>
            <p>Total: <strong>{cost} EURO</strong></p>
          </div>

          <button className="pay-btn" onClick={handlePayment}>
            Plătește
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcesarePlata;
/*
const ProcesarePlata = () => {

    const location = useLocation()
    const {credite, cost} = location.state
    const navigate = useNavigate()

    const handlePayment = async () => {
        try {
            await fetch(`${API_URL}/plata/${credite}`, {
                method: "POST",
                headers: {
                        'Authentication': localStorage.getItem('jwt') || ''
                    },
            })
            alert("Plata procesata cu succes!")
            navigate('/')
        } catch (error) {
            
        }
    }


    return (<div>

        <div>
            <label>Numar card</label>
            <input value={"4632 1245 8253 8903"}/>

            <label>Luna expirare</label>
            <input value={"09"}/>

            <label>An expirare</label>
            <input value={"27"}/>

            <label>Nume detinator</label>
            <input value={"Ion Popescu"}/>

            <label>CVV</label>
            <input value={"628"}/>
        </div>

        <div>
            Plata pentru {credite} credite
            Cost : {cost} RON

        </div>


        <div>
            <button onClick={handlePayment}>Plateste</button>
        </div>
    </div>)
}

export default ProcesarePlata

*/