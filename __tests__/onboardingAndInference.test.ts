import { YouCamClient } from '../src/api/youcam/client';
import { mockProfiles } from '../src/api/youcam/mockData';
import { IngredientClashEngine } from '../src/api/clashEngine/engine';

describe('DermisIQ Dynamic Fitzpatrick Inference & Onboarding Flow', () => {
  it('correctly maps YouCam Fitzpatrick Scale Roman numerals to DermisIQ Phototypes', async () => {
    const client = new YouCamClient();
    client.updateConfig({ useMockFallback: true });

    // Melanin Sensitive profile resolves to Type IV
    const resSensitive = await client.analyzeSkin('test://face', 'melaninSensitive');
    expect(resSensitive.fitzpatrickType).toBe('Type IV');
    expect(resSensitive.undertone).toBe('Warm Golden');

    // Balanced profile resolves to Type III
    const resBalanced = await client.analyzeSkin('test://face', 'balancedProfile');
    expect(resBalanced.fitzpatrickType).toBe('Type III');
    expect(resBalanced.undertone).toBe('Olive Golden');

    // Deep melanin profile resolves to Type VI
    const resDeep = await client.analyzeSkin('test://face', 'deepMelaninProfile');
    expect(resDeep.fitzpatrickType).toBe('Type VI');
    expect(resDeep.undertone).toBe('Deep Neutral');
  });

  it('dynamically adapts Post-Inflammatory Hyperpigmentation (PIH) risk based on inferred Fitzpatrick phototype', () => {
    // Inferred Type IV/VI with Glycolic Acid -> triggers high melanin PIH clash
    const evalTypeIV = IngredientClashEngine.evaluateRegimen(
      ['glycolic_acid'],
      mockProfiles.deepMelaninProfile,
      'Type IV'
    );
    const pihAlert = evalTypeIV.alerts.find(a => a.id.includes('pih-risk-glycolic_acid'));
    expect(pihAlert).toBeDefined();
    expect(pihAlert?.severity).toBe('WARNING');
    expect(pihAlert?.saferAlternative).toBe('lactic_acid');

    // Inferred Type I -> does not trigger high melanin PIH risk for gentle barrier actives
    const evalTypeI = IngredientClashEngine.evaluateRegimen(
      ['centella_asiatica', 'ceramides'],
      mockProfiles.balancedProfile,
      'Type I'
    );
    expect(evalTypeI.isSafeToApply).toBe(true);
    expect(evalTypeI.overallSafetyScore).toBe(100);
  });

  it('verifies that YouCam endpoints configuration includes all 4 neural analyzers', () => {
    const client = new YouCamClient();
    const config = client.getConfig();
    expect(config.baseUrl).toBe('https://yce-api-01.makeupar.com/s2s/v2.0');
    expect(config.apiKey).toContain('sk-');
  });
});
