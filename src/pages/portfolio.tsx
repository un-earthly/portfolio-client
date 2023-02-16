import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import { GET_PROJECT_LIST_URL } from "../utilities/urls"
import { ProjectInterface } from '../interface/ProjectInterface'
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

export default function Portfolio({ data }: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  return <div>
    {
      loading ? <p>loading...</p> :

        data
          .map((project: ProjectInterface) =>
            <ProjectCard
              key={project._id}
              project={project}
            />
          )}
  </div>
}

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const res = await axios.get<ProjectInterface[]>(GET_PROJECT_LIST_URL);
  const data = res.data;
  return {
    props: data
  };
}