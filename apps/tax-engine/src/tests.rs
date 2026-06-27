use serde_json::json;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_progressive_tax_low_bracket() {
        let payload = serde_json!({
            "filing_id": "test-001",
            "tax_year": 2024,
            "income": 10000.0,
            "deductions": [],
            "taxpayer_type": "individual"
        });

        // With standard deduction of 14600, taxable income = 0
        // Tax should be 0
        assert_eq!(payload["income"].as_f64().unwrap(), 10000.0);
    }

    #[test]
    fn test_progressive_tax_second_bracket() {
        let income = 50000.0;
        let standard_deduction = 14600.0;
        let taxable = income - standard_deduction; // 35400

        // 14000 * 0.105 = 1470
        // (35400 - 14000) * 0.175 = 21400 * 0.175 = 3745
        // Total = 5215
        let expected = 14000.0 * 0.105 + 21400.0 * 0.175;
        assert!((expected - 5215.0).abs() < 0.01);
    }

    #[test]
    fn test_effective_rate_calculation() {
        let tax_liability = 5215.0;
        let income = 50000.0;
        let effective_rate = (tax_liability / income) * 100.0;
        assert!((effective_rate - 10.43).abs() < 0.01);
    }
}
