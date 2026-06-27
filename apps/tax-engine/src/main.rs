use axum::{
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

#[derive(Debug, Serialize, Deserialize)]
pub struct TaxInput {
    pub filing_id: String,
    pub tax_year: i32,
    pub income: f64,
    pub deductions: Vec<Deduction>,
    pub taxpayer_type: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Deduction {
    pub code: String,
    pub amount: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TaxOutput {
    pub filing_id: String,
    pub taxable_income: f64,
    pub tax_liability: f64,
    pub effective_rate: f64,
    pub warnings: Vec<String>,
    pub breakdowns: Vec<TaxBreakdown>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TaxBreakdown {
    pub label: String,
    pub amount: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ValidationInput {
    pub filing_id: String,
    pub fields: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ValidationResult {
    pub filing_id: String,
    pub valid: bool,
    pub issues: Vec<ValidationIssue>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ValidationIssue {
    pub field: String,
    pub code: String,
    pub message: String,
    pub severity: String,
}

async fn health() -> &'static str {
    "TaxCode Rust Engine OK"
}

async fn calculate(Json(payload): Json<TaxInput>) -> Json<TaxOutput> {
    // TODO: implement real tax calculation
    Json(TaxOutput {
        filing_id: payload.filing_id,
        taxable_income: payload.income * 0.8,
        tax_liability: payload.income * 0.15,
        effective_rate: 0.15,
        warnings: vec![],
        breakdowns: vec![
            TaxBreakdown {
                label: "Gross Income".to_string(),
                amount: payload.income,
            },
            TaxBreakdown {
                label: "Taxable Income".to_string(),
                amount: payload.income * 0.8,
            },
            TaxBreakdown {
                label: "Estimated Tax".to_string(),
                amount: payload.income * 0.15,
            },
        ],
    })
}

async fn validate(Json(payload): Json<ValidationInput>) -> Json<ValidationResult> {
    // TODO: implement real validation
    Json(ValidationResult {
        filing_id: payload.filing_id,
        valid: true,
        issues: vec![],
    })
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/", get(health))
        .route("/calculate", post(calculate))
        .route("/validate", post(validate));

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("TaxCode Rust Engine listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
