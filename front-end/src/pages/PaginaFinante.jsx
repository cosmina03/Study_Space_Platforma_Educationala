import React from "react";
import "./PaginaFinante.css";
//import "./../components/StatisticiChart/StatisticiChart.css"
import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from "../constants.js";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthsMap = {
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'Mai',
  6: 'Iun',
  7: 'Iul'
}

const PaginaFinante = () => {
  const [finante, setFinante] = useState({});

  const fetchFinante = async () => {
    try {
      const response = await fetch(API_URL + `/finante`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      });
      const data = await response.json();
      if (response.ok) {
        const dataCuLuni = {...data , statisticiLunare:data.statisticiLunare.map(s => { return {...s, luna: monthsMap[+s.luna]}})}
        console.log(data);
        setFinante(dataCuLuni);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFinante();
  }, []);

  return (
    <div className="pagina-finante">
      <h2>Statistici financiare</h2>

      <div className="overview-boxes">
        {/* <div className="box">Venit Luna: <strong>100€</strong></div> */}
        <div className="box">
          Elevi: <strong>{finante?.total_elevi_unici}</strong>
        </div>
        <div className="box">
          Total cursuri vândute: <strong>{finante?.total_elevi}</strong>
        </div>
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
            {finante?.topCursuri?.map((c, idx) => (
              <tr key={idx}>
                <td>{c.titlu}</td>
                <td>{c.elevi}</td>
                <td>{c.venit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="chart-wrapper animated-chart">
        {/* <ResponsiveContainer width="100%" height="100%"> */}
          <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={finante?.statisticiLunare}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="luna"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="elevi" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          <Bar dataKey="venit" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer> 
      
      </div>
    </div>
  );
};

export default PaginaFinante;
