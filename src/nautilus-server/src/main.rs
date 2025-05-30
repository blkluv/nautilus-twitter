// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

use anyhow::Result;
use axum::{routing::get, routing::post, Router};
use fastcrypto::{ed25519::Ed25519KeyPair, traits::KeyPair};
use nautilus_server::app::process_data;
use nautilus_server::common::{get_attestation, health_check};
use nautilus_server::logging::configure_logging;
use nautilus_server::metrics::start_basic_prometheus_server;
use nautilus_server::metrics::Metrics;
use nautilus_server::AppState;
use std::io::Write;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tracing::info;
use tracing_subscriber::filter::LevelFilter;
#[tokio::main]
async fn main() -> Result<()> {
    // Set up panic handler to log panics
    let default_panic_handler = std::panic::take_hook();
    std::panic::set_hook(Box::new(move |panic| {
        // If the panic has a source location, record it as structured fields.
        if let Some(location) = panic.location() {
            // On nightly Rust, where the `PanicInfo` type also exposes a
            // `message()` method returning just the message, we could record
            // just the message instead of the entire `fmt::Display`
            // implementation, avoiding the duplicated location
            tracing::error!(
                message = %panic,
                panic.file = location.file(),
                panic.line = location.line(),
                panic.column = location.column(),
            );
        } else {
            tracing::error!(message = %panic);
        }

        default_panic_handler(panic);

        // We're panicking so we can't do anything about the flush failing
        let _ = std::io::stderr().flush();
        let _ = std::io::stdout().flush();
    }));

    // This guard must be held for the duration of the program.
    let _guard = configure_logging(LevelFilter::INFO).await;
    let eph_kp = Ed25519KeyPair::generate(&mut rand::thread_rng());

    // Start the metrics server
    let registry_service = start_basic_prometheus_server();
    let metrics = Metrics::new(&registry_service.default_registry());

    // This is the twitter bearer token you stored with secret manager.
    let api_key = std::env::var("API_KEY").expect("API_KEY must be set");

    let state = Arc::new(AppState {
        eph_kp,
        api_key,
        metrics,
    });

    // Define your own restricted CORS policy here if needed.
    let cors = CorsLayer::new().allow_methods(Any).allow_headers(Any);

    let app = Router::new()
        .route("/", get(ping))
        .route("/get_attestation", get(get_attestation))
        .route("/process_data", post(process_data))
        .route("/health_check", get(health_check))
        .with_state(state)
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    info!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app.into_make_service())
        .await
        .map_err(|e| anyhow::anyhow!("Server error: {}", e))
}

async fn ping() -> &'static str {
    "Pong!"
}
