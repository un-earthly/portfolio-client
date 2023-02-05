import axios from "axios";
import { useEffect, useState } from "react";
import { baseURL } from "../utils/urls";


export default function useSkill() {

    const [skills, setSkills] = useState([])

    useEffect(() => {
        axios
            .get(baseURL + "/skill/list")
            .then(res => setSkills(res.data.data))

    }, [skills]);

    return { skills }
}
