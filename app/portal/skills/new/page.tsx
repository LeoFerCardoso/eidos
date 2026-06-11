import NewSkill from '@/portal/skills/new-skill';

// Static segment - takes precedence over the [id] dynamic route so
// /portal/skills/new opens the publish wizard, not the detail page.
export default function NewSkillPage() {
  return <NewSkill />;
}
