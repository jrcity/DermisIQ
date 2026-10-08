import { IngredientClashEngine } from '../src/api/clashEngine/engine';
import { mockProfiles } from '../src/api/youcam/mockData';

describe('IngredientClashEngine', () => {
  it('detects direct active-on-active clashes between Retinol and Glycolic Acid', () => {
    const evaluation = IngredientClashEngine.evaluateRegimen(
      ['retinol', 'glycolic_acid'],
      mockProfiles.balancedProfile,
      'Type III'
    );

    expect(evaluation.isSafeToApply).toBe(false);
    expect(evaluation.overallSafetyScore).toBeLessThan(70);
    const hasActiveClash = evaluation.alerts.some(a => a.severity === 'CRITICAL' && a.id.includes('clash-retinol'));
    expect(hasActiveClash).toBe(true);
  });

  it('triggers barrier breakdown warnings when barrier score is compromised', () => {
    const sensitiveScan = mockProfiles.melaninSensitive; // barrier score 54
    const evaluation = IngredientClashEngine.evaluateRegimen(
      ['retinol'], // requires 68
      sensitiveScan,
      'Type IV'
    );

    const barrierWarning = evaluation.alerts.find(a => a.id.includes('barrier-risk-retinol'));
    expect(barrierWarning).toBeDefined();
    expect(evaluation.recommendedSchedule.pausedActives).toContain('Retinol / Retinoids (0.3% - 1%)');
  });

  it('flags rebound PIH risk for rapid penetrating AHAs on Fitzpatrick IV melanin profiles', () => {
    const evaluation = IngredientClashEngine.evaluateRegimen(
      ['glycolic_acid'],
      mockProfiles.balancedProfile,
      'Type IV'
    );

    const pihAlert = evaluation.alerts.find(a => a.id.includes('pih-risk-glycolic_acid'));
    expect(pihAlert).toBeDefined();
    expect(pihAlert?.severity).toBe('WARNING');
    expect(pihAlert?.saferAlternative).toBe('lactic_acid');
  });

  it('evaluates completely safe barrier regimens with a high safety score', () => {
    const evaluation = IngredientClashEngine.evaluateRegimen(
      ['ceramides', 'centella_asiatica', 'hyaluronic_acid'],
      mockProfiles.melaninSensitive,
      'Type IV'
    );

    expect(evaluation.isSafeToApply).toBe(true);
    expect(evaluation.overallSafetyScore).toBe(100);
    expect(evaluation.alerts[0].severity).toBe('SAFE');
  });
});
