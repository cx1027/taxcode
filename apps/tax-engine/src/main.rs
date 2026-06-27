use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// ─── Request / Response Types ─────────────────────────────────────────────────

#[derive(Debug, Deserialize)]
pub struct FilingPayload {
    pub filing_id: String,
    pub tax_year: u32,
    pub income: f64,
    pub deductions: Vec<DeductionItem>,
    pub taxpayer_type: String, // "individual" | "business"
}

#[derive(Debug, Deserialize)]
pub struct DeductionItem {
    pub code: String,
    pub description: Option<String>,
    pub amount: f64,
}

#[derive(Debug, Serialize)]
pub struct TaxResult {
    pub filing_id: String,
    pub taxable_income: f64,
    pub tax_liability: f64,
    pub effective_rate: f64,
    pub warnings: Vec<String>,
    pub breakdowns: Vec<TaxBreakdown>,
}

#[derive(Debug, Serialize)]
pub struct TaxBreakdown {
    pub label: String,
    pub amount: f64,
}

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: String,
    pub version: String,
}

// ─── Tax Rules (NZ IRD simplified 2024) ───────────────────────────────────────

fn get_brackets(tax_year: u32) -> Vec<(f64, f64, f64)> {
    match tax_year {
        2024 => vec![
            (0.0, 14000.0, 0.105),
            (14000.0, 48000.0, 0.175),
            (48000.0, 70000.0, 0.30),
            (70000.0, 180000.0, 0.33),
            (180000.0, f64::MAX, 0.39),
        ],
        2023 => vec![
            (0.0, 14000.0, 0.105),
            (14000.0, 48000.0, 0.175),
            (48000.0, 70000.0, 0.30),
            (70000.0, 180000.0, 0.33),
            (180000.0, f64::MAX, 0.39),
        ],
        _ => vec![
            (0.0, 14000.0, 0.105),
            (14000.0, 48000.0, 0.175),
            (48000.0, 70000.0, 0.30),
            (70000.0, 180000.0, 0.33),
            (180000.0, f64::MAX, 0.39),
        ],
    }
}

fn get_standard_deduction(tax_year: u32, taxpayer_type: &str) -> f64 {
    match (tax_year, taxpayer_type) {
        (2024, "individual") => 14600.0,
        (2024, "business") => 0.0,
        _ => 14600.0,
    }
}

// ─── Calculation Engine ───────────────────────────────────────────────────────

fn calculate_tax(payload: FilingPayload) -> TaxResult {
    let brackets = get_brackets(payload.tax_year);

    // Calculate total deductions
    let total_deductions: f64 = payload.deductions.iter().map(|d| d.amount).sum();
    let standard_deduction = get_standard_deduction(payload.tax_year, &payload.taxpayer_type);

    let applied_deductions = if total_deductions > standard_deduction {
        total_deductions
    } else {
        standard_deduction
    };

    let taxable_income = (payload.income - applied_deductions).max(0.0);

    // Progressive tax calculation
    let mut tax_liability = 0.0;
    let mut breakdowns = Vec::new();

    breakdowns.push(TaxBreakdown {
        label: "Total Income".to_string(),
        amount: payload.income,
    });
    breakdowns.push(TaxBreakdown {
        label: "Deductions".to_string(),
        amount: -applied_deductions,
    });
    breakdowns.push(TaxBreakdown {
        label: "Taxable Income".to_string(),
        amount: taxable_income,
    });

    let mut remaining = taxable_income;
    for (min, max, rate) in &brackets {
        if remaining <= 0.0 {
            break;
        }
        let bracket_width = max - min;
        let taxable_in_bracket = remaining.min(bracket_width);
        let bracket_tax = taxable_in_bracket * rate;
        tax_liability += bracket_tax;
        remaining -= taxable_in_bracket;
    }

    tax_liability = (tax_liability * 100.0).round() / 100.0;
    let effective_rate = if payload.income > 0.0 {
        ((tax_liability / payload.income) * 100.0 * 100.0).round() / 100.0
    } else {
        0.0
    };

    breakdowns.push(TaxBreakdown {
        label: "Tax Liability".to_string(),
        amount: tax_liability,
    });

    // Generate warnings
    let mut warnings = Vec::new();
    if payload.income > 0.0 && effective_rate > 20.0 {
        warnings.push("Effective tax rate exceeds 20%. Consider consulting a tax professional.".to_string());
    }

    TaxResult {
        filing_id: payload.filing_id,
        taxable_income: (taxable_income * 100.0).round() / 100.0,
        tax_liability,
        effective_rate,
        warnings,
        breakdowns,
    }
}

// ─── HTTP Handlers ─────────────────────────────────────────────────────────────

async fn health() -> impl Responder {
    HttpResponse::Ok().json(HealthResponse {
        status: "ok".to_string(),
        version: "0.1.0".to_string(),
    })
}

async fn calculate(payload: web::Json<FilingPayload>) -> impl Responder {
    let result = calculate_tax(payload.into_inner());
    HttpResponse::Ok().json(result)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Tax Engine starting on 0.0.0.0:8080");

    HttpServer::new(|| {
        App::new()
            .route("/health", web::get().to(health))
            .route("/calculate", web::post().to(calculate))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
