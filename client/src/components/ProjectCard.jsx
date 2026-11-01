export default function ProjectCard({ project }) {
  return (
    <article className="card project-card">
      {project.image ? (
        <img src={project.image} alt={project.title} style={{ height: 180, objectFit: 'cover', width: '100%' }} />
      ) : (
        <div
          style={{
            height: 180,
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)',
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          {project.title.slice(0, 1)}
        </div>
      )}
      <div className="project-card-body">
        <h3>{project.title}</h3>
        <p>
          {project.description.length > 120
            ? `${project.description.slice(0, 120)}...`
            : project.description}
        </p>
        {project.technologies?.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {project.technologies.map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="project-links">
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer">
              Live Demo
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
