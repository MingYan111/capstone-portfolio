import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import ProjectCard from '../components/ProjectCard';
import Loading from '../components/Loading';

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsRes, skillsRes, postsRes] = await Promise.all([
          api.get('/projects?featured=true'),
          api.get('/skills'),
          api.get('/posts'),
        ]);
        const featured = projectsRes.data.projects;
        // If no project is marked featured, show up to 3 newest projects.
        setFeaturedProjects(featured.length ? featured.slice(0, 3) : featured);
        setSkills(skillsRes.data.skills.slice(0, 8));
        setRecentPosts(postsRes.data.posts.slice(0, 3));
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load homepage data'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loading text="Loading portfolio..." />;

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>
            Hi, I&apos;m <span className="accent">Dong Mingyan</span>
          </h1>
          <p>
            A full-stack developer crafting modern web applications with React, Node.js, Express
            and MongoDB. Welcome to my portfolio and blog.
          </p>
          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary">
              View My Projects
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="container">
          <div className="alert alert-error">{error}</div>
        </div>
      )}

      <section className="container" style={{ marginBottom: 48 }}>
        <h2 className="section-title">Featured Projects</h2>
        {featuredProjects.length ? (
          <div className="grid grid-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <p className="muted">No featured projects yet.</p>
        )}
        <div style={{ marginTop: 20 }}>
          <Link to="/projects" className="btn btn-outline btn-sm">
            All Projects →
          </Link>
        </div>
      </section>

      <section className="container" style={{ marginBottom: 48 }}>
        <h2 className="section-title">Skills</h2>
        {skills.length ? (
          skills.map((skill) => (
            <div key={skill._id} className="skill-row">
              <span className="skill-name">{skill.name}</span>
              <div className="skill-bar-bg">
                <div className="skill-bar" style={{ width: `${skill.level}%` }} />
              </div>
              <span className="skill-level">{skill.level}%</span>
            </div>
          ))
        ) : (
          <p className="muted">No skills added yet.</p>
        )}
      </section>

      <section className="container">
        <h2 className="section-title">Latest Blog Posts</h2>
        {recentPosts.length ? (
          <div className="grid grid-3">
            {recentPosts.map((post) => (
              <article key={post._id} className="card post-card">
                <h3>
                  <Link to={`/blog/${post.slug || post._id}`}>{post.title}</Link>
                </h3>
                <div className="post-meta">
                  {new Date(post.createdAt).toLocaleDateString()} · {post.author}
                </div>
                <p className="muted" style={{ margin: 0 }}>
                  {post.excerpt || post.content.slice(0, 100) + '...'}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">No posts yet.</p>
        )}
        <div style={{ marginTop: 20 }}>
          <Link to="/blog" className="btn btn-outline btn-sm">
            Read the Blog →
          </Link>
        </div>
      </section>
    </div>
  );
}
