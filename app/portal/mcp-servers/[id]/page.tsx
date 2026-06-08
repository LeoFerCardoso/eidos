import McpDetail from '@/portal/mcp-servers/mcp-detail';

// Forge - MCP server detail route. Opened when a server card is clicked in the
// MCP servers catalog. The server id comes from the path segment.
export default async function McpDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <McpDetail id={id} />;
}
