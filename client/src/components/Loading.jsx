export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="loading">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 12px' }} />
        <div>{text}</div>
      </div>
    </div>
  );
}
