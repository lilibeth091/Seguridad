import React, { useState, useEffect } from "react";
import PropertyComponent from "../components/Property";
const Demo: React.FC = () => {
    //Ciclo de vida
    useEffect(() => {
        console.log("Componente montado");
        return () => {
            console.log("Componente desmontado");
        }
    }, []);

    //Variables reactivas
    let [name, setName] = useState<string>("Felipe");

    const theChange = (e: any) => setName(e.target.value)

    return <div>
        <h1>Hola {name}</h1>
        <input type="text" value={name} onChange={theChange} />
        <PropertyComponent name="Mediterranean Avenue" color="brown" price={60} rent={[2, 10, 30, 90, 160, 250]} />
        <PropertyComponent name="Oriental Avenue" color="lightblue" price={100} rent={[6, 30, 90, 270, 400, 550]} />
        <PropertyComponent name="Vermont Avenue" color="lightblue" price={100} rent={[6, 30, 90, 270, 400, 550]} />
        <PropertyComponent name="Connecticut Avenue" color="lightblue" price={120} rent={[8, 40, 100, 300, 450, 600]} />

    </div>
}
export default Demo; 