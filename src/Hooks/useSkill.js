import axios from "axios";
import { useEffect, useState } from "react";
import { baseURL } from "../utils/urls";


export default function useSkill() {

    const [skills, setSkills] = useState([])

    useEffect(() => {
        axios
            .get(baseURL + "/skill")
            .then(res => setSkills(res.data))

    }, [skills]);

    return { skills }
}
