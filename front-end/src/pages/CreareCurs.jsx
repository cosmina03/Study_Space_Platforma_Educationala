import { useState } from 'react'
import './CreareCurs.css'
import { API_URL } from "../constants.js";
import { useNavigate } from "react-router-dom";

const CreareCurs = () => {
    const [titlu, setTitlu] = useState('');
    const [descriere, setDescriere] = useState('');
    const [cost, setCost] = useState('');
    const [file, setFile] = useState(null)
    const navigate = useNavigate();
  
 
    const handleCreareCurs = async () => {
        try {
            if(!file){
                alert("Alegeti un fisier")
            }

            const formData = new FormData()
            formData.append('poza_curs', file)
            formData.append('titlu', titlu)
            formData.append('descriere', descriere)
            formData.append('cost', cost)

            const response = await fetch(API_URL+'/curs', {
                method:"POST",
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authentication': localStorage.getItem('jwt') || ''
                }, body: formData
            })
            const date = await response.json()
            if(response.ok){
                alert('Curs creat cu succes!')
                navigate('/cursuri');
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleCancel = () => {
      navigate('/cursuri');
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }
  
    const isValid = titlu.trim() !== '' && descriere.trim() !== '' && cost.trim() !== '';
  
    return (
      <div className="overlay">
        <div className="form-modal">
          <h2>Creare curs</h2>

          <label>Adaugati o imagine : </label>
          <input type='file' accept='image/*' onChange={handleFileChange}/>
  
          <input
            placeholder="Titlul cursului (obligatoriu)"
            value={titlu}
            onChange={e => setTitlu(e.target.value)}
          />
          <textarea
            placeholder="Descriere"
            value={descriere}
            onChange={e => setDescriere(e.target.value)}
          />
          <input
            type="number"
            placeholder="Cost"
            value={cost}
            onChange={e => setCost(e.target.value)}
          />
  
          <div className="form-buttons">
            <button className="cancel" onClick={handleCancel}>Anulați</button>
            <button className="create" onClick={handleCreareCurs} disabled={!isValid}>Creați</button>
          </div>
        </div>
      </div>
    );
  };

/*
const CreareCurs = () => {

    const [titlu, setTitlu] = useState('')
    const [descriere, setDescriere] = useState('')
    const [cost, setCost] = useState(1)

    const handleCreareCurs = async () => {
        try {
            const response = await fetch(API_URL+'/curs', {
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': localStorage.getItem('jwt') || ''
                }, body: JSON.stringify({
                    titlu, descriere, cost
                })
            })
            const date = await response.json()
            if(response.ok){
                alert('Curs creat cu succes!')
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <div className="container-creare-curs">
                <h2>Creare curs</h2>
                <label>Titlu</label>
                <input value={titlu} onChange={e=>setTitlu(e.target.value)}/>

                <label>Descriere</label>
                <textarea value={descriere} onChange={e=>setDescriere(e.target.value)} />

                <label>Cost</label>
                <input value={cost} onChange={e=>setCost(e.target.value)} type='number'/>

                <button onClick={handleCreareCurs}>Confirmare</button>
            </div>
        </div>
    )
}
*/
export default CreareCurs