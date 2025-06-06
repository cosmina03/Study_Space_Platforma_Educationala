import React from 'react';
import './PaginaFinante.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PaginaFinante = () => {
  const statisticiLunare = [
    { luna: 'Ian', profit: 320, eleviNoi: 10 },
    { luna: 'Feb', profit: 480, eleviNoi: 12 },
    { luna: 'Mar', profit: 560, eleviNoi: 14 },
    { luna: 'Apr', profit: 400, eleviNoi: 9 },
    { luna: 'Mai', profit: 670, eleviNoi: 18 }
  ];

  const topCursuri = [
    { titlu: 'Programare în Python', cumparatori: 45, incasari: 450 },
    { titlu: 'Bazele Economiei', cumparatori: 30, incasari: 300 },
    { titlu: 'JavaScript pentru Începători', cumparatori: 28, incasari: 280 }
  ];

  return (
    <div className="pagina-finante">
      <h2>Statistici financiare</h2>

      <div className="overview-boxes">
        <div className="box">Venit Luna: <strong>100€</strong></div>
        <div className="box">Elevi: <strong>5</strong></div>
        <div className="box">Total cursuri vândute: <strong>5</strong></div>
      </div>

  

      <div className="top-cursuri">
        <h3>Top cursuri achiziționate</h3>
        <table>
          <thead>
            <tr>
              <th>Curs</th>
              <th>Cumpărători</th>
              <th>Încăsări (€)</th>
            </tr>
          </thead>
          <tbody>
            {topCursuri.map((c, idx) => (
              <tr key={idx}>
                <td>{c.titlu}</td>
                <td>{c.cumparatori}</td>
                <td>{c.incasari}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaginaFinante;
