import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import { GET_PROJECT_LIST_URL } from "../utilities/urls"
import { ProjectInterface } from '../interface/ProjectInterface'
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import Newcard from '../components/Newcard';

export default function Portfolio({ data }: any) {
  const [loading, setLoading] = useState(true);

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

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const res = await axios.get<ProjectInterface[]>(GET_PROJECT_LIST_URL);
  const data = res.data;
  return {
    props: data
  };
}