export type FeatureItem = {
  icon?: string;
  title?: string;
  desc?: string;
};

/**
 * The three claims the brand leads with: gluten free, extra calcium and very low
 * oil absorption. They live inside the editable `about.features` list in the
 * database, so they are located by their icon and fall back to the last three
 * entries if an editor changes them.
 */
const PILLAR_ICONS = ["🌾", "🦴", "💧"];

function asFeatureList(features: unknown): FeatureItem[] {
  return Array.isArray(features) ? (features as FeatureItem[]).filter(Boolean) : [];
}

export function getHealthPillars(features: unknown): FeatureItem[] {
  const list = asFeatureList(features);
  if (list.length === 0) {
    return [];
  }

  const matched = PILLAR_ICONS.map((icon) => list.find((item) => item?.icon === icon)).filter(
    (item): item is FeatureItem => Boolean(item),
  );

  return matched.length === PILLAR_ICONS.length ? matched : list.slice(-3);
}

export function getSecondaryFeatures(features: unknown, pillars: FeatureItem[]): FeatureItem[] {
  const list = asFeatureList(features);
  return list.filter((item) => !pillars.includes(item));
}
