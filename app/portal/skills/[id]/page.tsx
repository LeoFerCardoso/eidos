import SkillDetail from '@/portal/skills/skill-detail';

// Forge — Skill detail / README route. Opened when a card is clicked in the
// Skills marketplace. The skill id comes from the path segment.
export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SkillDetail id={id} />;
}
