// Mock serviceability. Replace with Shiprocket / Delhivery serviceability API.
// ---------- Delivery / orders (mock) ----------
const PINCODES: Record<string, { city: string; state: string; zone: 'metro' | 'rest' | 'remote' }> = {
  '110001': { city: 'New Delhi', state: 'Delhi', zone: 'metro' },
  '400001': { city: 'Mumbai', state: 'Maharashtra', zone: 'metro' },
  '560001': { city: 'Bengaluru', state: 'Karnataka', zone: 'metro' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', zone: 'metro' },
  '700001': { city: 'Kolkata', state: 'West Bengal', zone: 'metro' },
  '500001': { city: 'Hyderabad', state: 'Telangana', zone: 'metro' },
  '395007': { city: 'Surat', state: 'Gujarat', zone: 'rest' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', zone: 'rest' },
  '302001': { city: 'Jaipur', state: 'Rajasthan', zone: 'rest' },
  '411001': { city: 'Pune', state: 'Maharashtra', zone: 'rest' },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh', zone: 'rest' },
  '682001': { city: 'Kochi', state: 'Kerala', zone: 'rest' },
  '791111': { city: 'Itanagar', state: 'Arunachal Pradesh', zone: 'remote' },
  '744101': { city: 'Port Blair', state: 'Andaman and Nicobar Islands', zone: 'remote' },
};
export type PincodeResult = { ok: true; city: string; state: string; days: [number, number]; cod: boolean; date: string } | { ok: false; error: string };

export function lookupPincode(pin: string) {
  return PINCODES[pin] ?? null;
}

export async function checkPincode(pin: string): Promise<PincodeResult> {
  if (!/^[1-9][0-9]{5}$/.test(pin)) return { ok: false, error: 'Enter a valid 6-digit pincode.' };
  // Unknown but valid pincodes: treat as serviceable "rest of India" so the demo always works.
  const hit = PINCODES[pin] ?? { city: '', state: '', zone: 'rest' as const };
  const days: [number, number] = hit.zone === 'metro' ? [2, 4] : hit.zone === 'rest' ? [4, 6] : [7, 10];
  const d = new Date();
  d.setDate(d.getDate() + days[1]);
  return { ok: true, city: hit.city, state: hit.state, days, cod: hit.zone !== 'remote', date: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) };
}
