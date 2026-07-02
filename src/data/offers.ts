export type Offer = {
  eyebrow: string;
  title: string;
  description: string;
  emoji: string;
  backgroundColor: string;
  code: string;
  validTill: string;
  details: string;
};

export const OFFERS: Offer[] = [
  {
    eyebrow: 'YOUR FIRST ORDER',
    title: 'Get 50% off',
    description: 'Use code WELCOME50',
    emoji: '🛵',
    backgroundColor: '#252329',
    code: 'WELCOME50',
    validTill: 'Valid till 31 July 2026',
    details: 'Applicable on your first order only. Maximum discount ₹150.',
  },
  {
    eyebrow: 'FREE DELIVERY',
    title: 'Delivery is on us',
    description: 'Use code FREEDEL',
    emoji: '🍔',
    backgroundColor: '#193A35',
    code: 'FREEDEL',
    validTill: 'Valid till 15 July 2026',
    details: 'Applies to orders above ₹199 from selected restaurants.',
  },
  {
    eyebrow: 'WEEKEND SPECIAL',
    title: 'Save ₹150 today',
    description: 'Use code WEEKEND150',
    emoji: '🎉',
    backgroundColor: '#4A274F',
    code: 'WEEKEND150',
    validTill: 'Valid on Friday to Sunday',
    details: 'Available on orders above ₹499. One use per customer each weekend.',
  },
];
