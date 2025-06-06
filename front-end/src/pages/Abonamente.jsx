import React from "react";
import "./Abonamente.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    title: "Starter",
    credits: 1,
    price: 5,
    description: "Acces pentru 1 curs cu 1 credit.",
  },
  {
    title: "Avansat",
    credits: 3,
    price: 12,
    description: "Ideal pentru învățare accelerată – 3 cursuri sau lecții.",
    popular: true, // marchează badge-ul
  },
  {
    title: "Expert",
    credits: 5,
    price: 20,
    description: "Maximizează-ți progresul cu 5 credite valabile pentru orice material.",
  },
];

export default function Abonamente() {

  const navigate = useNavigate()
  const handlePurchase = (credite, cost) => {
    navigate('/plata', {state : {credite, cost} })
  };

  return (
    <div className="abonamente-wrapper">
      <h2 className="titlu-abonamente">Alege un pachet</h2>
      <p className="subtitlu-abonamente">
        Folosește creditele pentru a accesa cursuri și materiale premium din platformă.
      </p>

      <div className="abonamente-container">
        {plans.map((plan, idx) => (
          <div key={idx} className="abonament-card">
            {plan.popular && <div className="badge-popular">Cel mai popular</div>}

            <h3>{plan.title}</h3>
            <p className="price">{plan.price}€</p>
            <p className="sub">pentru {plan.credits} credit{plan.credits > 1 ? "e" : ""}</p>
            <Button
              fullWidth
              variant="contained"
              className="btn-join"
              onClick={() => handlePurchase(plan.credits, plan.price)}
            >
              Cumpără
            </Button>
            <p className="desc">{plan.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
