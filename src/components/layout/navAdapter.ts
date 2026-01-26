import type { CanonNavLink, CanonNavSection, IconName } from "./navTypes";

// helper: prefer SSOT label, fall back to legacy title
const nameOf = (o: { label?: string; title?: string }) =>
  (o?.label ?? o?.title ?? "").trim();

export type SSOTChild = {
  label?: string; title?: string;
  path: string;
  icon?: string;
  testid?: string;
  badgeKey?: string;
};

export type SSOTParent = {
  label?: string; title?: string;
  icon?: string;
  testid?: string;
  children?: SSOTChild[];
};

// Generate stable keys from labels/titles (slugified)
function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// 🔧 normalize SSOT -> Sidebar model
export function adaptSections(sections: SSOTParent[]): CanonNavSection[] {
  return (sections || []).map((sec) => {
    const sectionKey = slugify(nameOf(sec));
    
    // Handle sections with direct path (no children)
    let children: CanonNavLink[] = [];
    if (sec.children && sec.children.length > 0) {
      children = sec.children.map((c) => ({
        key: slugify(nameOf(c)),
        label: nameOf(c),
        href: c.path,
        icon: c.icon as IconName,
        badgeKey: c.badgeKey,
      }));
    }

    return {
      key: sectionKey,
      label: nameOf(sec),
      icon: sec.icon as IconName,
      children,
    };
  });
}