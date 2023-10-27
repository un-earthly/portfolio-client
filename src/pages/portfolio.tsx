import axios from 'axios';
import { GET_PROJECT_LIST_URL } from "../utilities/urls"
import { ProjectInterface } from '../interface/ProjectInterface'
import { useEffect, useState } from 'react';
import Newcard from '../components/Newcard';

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(GET_PROJECT_LIST_URL);
        setData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  return <div>
    <h1 className="text-3xl py-10 text-bold text-center ">
      Portfolio projects
    </h1>
    <div className='grid lg:grid-cols-3 relative gap-8 px-10'>
      {
        loading ? <p>loading...</p> :

          data
            .map((project: ProjectInterface) =>
              <Newcard
                key={project._id}
                project={project}
              />
            )}
    </div>
  </div>
}
