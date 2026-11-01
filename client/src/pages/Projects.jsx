import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import ProjectCard from '../components/ProjectCard';
import Loading from '../components/Loading';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data.projects);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load projects'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loading text="Loading projects..." />;

  return (
    <div className="container">
      <div className="page-head">
        <h1>Projects</h1>
        <p>Selected work and coursework built during my studies.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {projects.length ? (
        <div className="grid grid-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p>No projects available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
