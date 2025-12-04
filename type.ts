export enum Tone {
  FORMAL = 'formal',
  POLITE = 'polite',
  FRIENDLY = 'friendly',
  EMPATHETIC = 'empathetic',
  CONCISE = 'concise',
  UNKNOWN = 'unknown', // For cases where a tone isn't explicitly set or is default
}

export interface ToneOption {
  value: Tone;
  label: string;
}
