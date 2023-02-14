import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import { GET_PROJECT_LIST_URL } from "../utilities/urls"
import { ProjectInterface } from '../interface/ProjectInterface'

export default function Portfolio(props: { data: ProjectInterface[] }) {
  return (
    <div>
      {props.data.map((project: ProjectInterface) => <ProjectCard key={project._id} project={project} />)}
    </div>
  )
}


Portfolio.getInitialProps = async () => {
  const res = await axios.get<ProjectInterface[]>(GET_PROJECT_LIST_URL);
  const data = res.data;
  return data;

}