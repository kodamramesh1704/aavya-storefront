// Placeholder editorial content. Replace per client (or move to a CMS).
import { brand } from '@/brand.config';

export const STORES = [
  { id: 'mum-1', city: 'Mumbai', name: `${brand.shortName} Kala Ghoda`, address: 'Placeholder Building, Kala Ghoda, Fort, Mumbai 400001', phone: '+91 00000 00001', hours: '11am – 9pm, all days', lat: 18.928, lng: 72.832 },
  { id: 'mum-2', city: 'Mumbai', name: `${brand.shortName} Bandra`, address: 'Placeholder Lane, Bandra West, Mumbai 400050', phone: '+91 00000 00002', hours: '11am – 9pm, all days', lat: 19.059, lng: 72.829 },
  { id: 'del-1', city: 'New Delhi', name: `${brand.shortName} Khan Market`, address: 'Placeholder Shop No. 0, Khan Market, New Delhi 110003', phone: '+91 00000 00003', hours: '11am – 8:30pm, closed Tue', lat: 28.6, lng: 77.227 },
  { id: 'del-2', city: 'New Delhi', name: `${brand.shortName} Select Citywalk`, address: 'Placeholder Mall, Saket, New Delhi 110017', phone: '+91 00000 00004', hours: '11am – 9:30pm, all days', lat: 28.528, lng: 77.219 },
  { id: 'blr-1', city: 'Bengaluru', name: `${brand.shortName} Indiranagar`, address: 'Placeholder Road, Indiranagar, Bengaluru 560038', phone: '+91 00000 00005', hours: '11am – 9pm, all days', lat: 12.971, lng: 77.641 },
  { id: 'srt-1', city: 'Surat', name: `${brand.shortName} Flagship`, address: brand.contact.address, phone: brand.contact.phone, hours: '10:30am – 8:30pm, all days', lat: 21.17, lng: 72.831 },
  { id: 'hyd-1', city: 'Hyderabad', name: `${brand.shortName} Jubilee Hills`, address: 'Placeholder Road No. 0, Jubilee Hills, Hyderabad 500033', phone: '+91 00000 00006', hours: '11am – 9pm, all days', lat: 17.43, lng: 78.41 },
];

export const FAQS: { topic: string; items: { q: string; a: string }[] }[] = [
  { topic: 'Orders & Payments', items: [
    { q: 'Which payment methods do you accept?', a: 'UPI, credit and debit cards (Visa, Mastercard, RuPay, Amex), net banking, wallets and Cash on Delivery on eligible pincodes.' },
    { q: 'Are prices inclusive of GST?', a: 'Yes. All prices shown are in INR and include GST. Your invoice shows the tax breakup.' },
    { q: 'Can I change or cancel my order?', a: 'You can cancel within 12 hours of placing the order if it has not shipped. Contact us on WhatsApp or email with your order number.' },
  ] },
  { topic: 'Shipping & Delivery', items: [
    { q: 'How long does delivery take?', a: 'Metro cities: 2–4 business days. Rest of India: 4–6 business days. Remote areas: 7–10 business days. Express delivery is available at checkout.' },
    { q: 'Do you ship internationally?', a: 'Placeholder: describe international shipping zones, duties and timelines here.' },
    { q: 'Is shipping free?', a: `Standard shipping is free on orders above ₹${brand.shipping.freeThreshold.toLocaleString('en-IN')}.` },
  ] },
  { topic: 'Returns & Exchanges', items: [
    { q: 'What is your return policy?', a: 'Unused items with original tags can be returned or exchanged within 15 days of delivery. Customised pieces are not eligible.' },
    { q: 'How do refunds work?', a: 'Prepaid orders are refunded to the original payment method within 5–7 business days of the return passing quality check. COD orders are refunded as store credit or bank transfer.' },
  ] },
  { topic: 'Products & Care', items: [
    { q: 'Why does my piece look slightly different from the photo?', a: 'Handcrafted techniques like block printing and hand embroidery create small variations that make each piece unique.' },
    { q: 'How do I find my size?', a: 'Every product page has a size guide with measurements in inches and centimetres. Our stylists can also help on WhatsApp.' },
  ] },
];

const p = (t: string) => `${t} Placeholder policy text. Replace with the client’s legally reviewed policy. This paragraph exists to show the long-form reading layout, line length and spacing for policy pages.`;

export const POLICIES: Record<string, { title: string; updated: string; sections: { id: string; title: string; body: string[] }[] }> = {
  returns: { title: 'Returns & Exchange', updated: '1 November 2026', sections: [
    { id: 'eligibility', title: 'Eligibility', body: [p('Items can be returned within 15 days of delivery if unused, unwashed and with original tags.'), p('Customised, altered and intimate items are final sale.')] },
    { id: 'how-to', title: 'How to start a return', body: [p('Log in to your account, open the order and select “Return or exchange”. Guests can use the Track Order page.')] },
    { id: 'refunds', title: 'Refunds', body: [p('Refunds are issued to the original payment method within 5–7 business days after quality check.')] },
    { id: 'exchanges', title: 'Exchanges', body: [p('Size exchanges are free once per order, subject to availability.')] },
  ] },
  shipping: { title: 'Shipping & Delivery', updated: '1 November 2026', sections: [
    { id: 'timelines', title: 'Delivery timelines', body: [p('Metro: 2–4 days. Rest of India: 4–6 days. Remote: 7–10 days.')] },
    { id: 'charges', title: 'Shipping charges', body: [p(`Free on orders above ₹${brand.shipping.freeThreshold}. Otherwise ₹${brand.shipping.standardFee}. Express ₹${brand.shipping.expressFee}.`)] },
    { id: 'cod', title: 'Cash on Delivery', body: [p(`COD is available on most pincodes for a fee of ₹${brand.shipping.codFee}.`)] },
    { id: 'international', title: 'International orders', body: [p('Describe international shipping, duties and taxes here.')] },
  ] },
  payments: { title: 'Fees & Payments', updated: '1 November 2026', sections: [
    { id: 'methods', title: 'Payment methods', body: [p('UPI, cards, net banking, wallets and COD.')] },
    { id: 'security', title: 'Payment security', body: [p('Payments are processed by a PCI-DSS compliant gateway. We never store card details.')] },
    { id: 'gst', title: 'Taxes and invoices', body: [p('All prices include GST. A GST invoice is emailed with every order.')] },
  ] },
  privacy: { title: 'Privacy Policy', updated: '1 November 2026', sections: [
    { id: 'collect', title: 'What we collect', body: [p('Contact details, delivery addresses, order history and device data.')] },
    { id: 'use', title: 'How we use it', body: [p('To fulfil orders, provide support and, with consent, send marketing.')] },
    { id: 'rights', title: 'Your rights', body: [p('Access, correction and deletion rights under the Digital Personal Data Protection Act, 2023.')] },
    { id: 'contact', title: 'Contact', body: [p(`Write to ${brand.contact.email} for privacy requests.`)] },
  ] },
  terms: { title: 'Terms & Conditions', updated: '1 November 2026', sections: [
    { id: 'use', title: 'Use of this site', body: [p('By using this site you agree to these terms.')] },
    { id: 'pricing', title: 'Pricing and availability', body: [p('Prices and availability may change without notice.')] },
    { id: 'ip', title: 'Intellectual property', body: [p('All designs, images and content belong to the brand.')] },
    { id: 'law', title: 'Governing law', body: [p('These terms are governed by the laws of India.')] },
  ] },
};

export const LOOKBOOKS: Record<string, { title: string; intro: string; hero: string; looks: { image: string; caption: string; productIdx: number[] }[] }> = {
  'the-festive-edit': {
    title: 'The Festive Edit',
    intro: 'Placeholder lookbook introduction. Two or three lines on the mood, location and craft of this campaign.',
    hero: '/placeholder/editorial.webp',
    looks: [1, 2, 3, 4, 5, 6].map((i) => ({ image: `/placeholder/look-${i}.webp`, caption: `Look ${String(i).padStart(2, '0')}`, productIdx: [i * 5, i * 5 + 13] })),
  },
};
