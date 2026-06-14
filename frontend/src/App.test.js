import { describe, it, expect } from 'vitest';
import api from './_utils/api/api';

// Test de fumee : verifie que l'instance axios est correctement configuree.
describe('api', () => {
  it('expose une instance axios avec une baseURL', () => {
    expect(api.defaults.baseURL).toBeTruthy();
  });
});
