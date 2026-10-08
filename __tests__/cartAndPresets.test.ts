import { ROUTINE_PRESETS, IngredientClashEngine } from '../src/api/clashEngine/engine';
import { PRODUCT_CATALOG, CURATED_BUNDLES } from '../src/api/clashEngine/recommendations';
import { mockProfiles } from '../src/api/youcam/mockData';

describe('DermisIQ Regimens, Presets & eCommerce Catalog', () => {
  it('validates that dangerous acid stack triggers critical clash alert', () => {
    const dangerousPreset = ROUTINE_PRESETS.find(p => p.id === 'dangerous-stack');
    expect(dangerousPreset).toBeDefined();

    const evaluation = IngredientClashEngine.evaluateRegimen(
      dangerousPreset!.actives,
      mockProfiles.melaninSensitive,
      'Type IV'
    );

    expect(evaluation.isSafeToApply).toBe(false);
    expect(evaluation.overallSafetyScore).toBeLessThan(60);
    const criticalClashes = evaluation.alerts.filter(a => a.severity === 'CRITICAL');
    expect(criticalClashes.length).toBeGreaterThanOrEqual(1);
  });

  it('validates that ceramide barrier rescue preset evaluates with 100/100 score', () => {
    const recoveryPreset = ROUTINE_PRESETS.find(p => p.id === 'barrier-repair');
    expect(recoveryPreset).toBeDefined();

    const evaluation = IngredientClashEngine.evaluateRegimen(
      recoveryPreset!.actives,
      mockProfiles.melaninSensitive,
      'Type IV'
    );

    expect(evaluation.isSafeToApply).toBe(true);
    expect(evaluation.overallSafetyScore).toBe(100);
    expect(evaluation.alerts[0].severity).toBe('SAFE');
  });

  it('verifies product catalog contains shade matched VTO item with <2% return rate risk', () => {
    const vtoItem = PRODUCT_CATALOG.find(p => p.category === 'Tinted VTO');
    expect(vtoItem).toBeDefined();
    expect(vtoItem?.shadeHex).toBe('#A26E4F');
    expect(vtoItem?.returnRateRisk).toBe('Ultra Low (<2%)');
  });

  it('verifies curated bundles calculate a minimum 20% discount against original price', () => {
    CURATED_BUNDLES.forEach(bundle => {
      const sum = bundle.products.reduce((acc, p) => acc + p.price, 0);
      expect(bundle.originalPrice).toBeGreaterThanOrEqual(sum - 2); // small tolerance
      expect(bundle.bundlePrice).toBeLessThan(bundle.originalPrice);
      expect(bundle.discountPercentage).toBeGreaterThanOrEqual(20);
    });
  });
});
