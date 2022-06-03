import axios from "axios";
import { useEffect, useState } from "react";


export default function useSkill() {

    const [skills, setSkills] = useState([])

    useEffect(() => {
        axios.get("https://portfolio-backend-39.herokuapp.com/skill").then(res => setSkills(res.data))

    }, [skills]);

    return { skills }
}
