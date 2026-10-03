import { PageHeader } from './PageHeader.jsx';
export function PlaceholderPage({ title, description }) { return <><PageHeader title={title} description={description} action={<button className="primary">+ Add {title.slice(0, -1)}</button>} /><section className="panel empty"><h2>{title}</h2><p>This module is ready for its API-backed workflow in the next implementation phase.</p></section></>; }
