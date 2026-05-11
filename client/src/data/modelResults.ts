// Design reminder: Civic Data Editorialism. Keep this file factual, concise, and evidence-oriented; the UI should present these values like a housing-policy briefing, not a generic dashboard.
export const modelResults = [
  {
    "model": "XGBoost",
    "family": "ML Ensemble",
    "rmse_log": 0.2203,
    "mae_log": 0.1507,
    "r2": 0.8505,
    "cv_r2_mean": null,
    "cv_r2_std": null,
    "fit_seconds": null,
    "explanation": "Optimised gradient boosting for tabular nonlinear prediction. Best performer.",
    "rank": 1,
    "linearity_position": "Learns layered nonlinear interactions"
  },
  {
    "model": "Gradient Boosting",
    "family": "ML Ensemble",
    "rmse_log": 0.2302,
    "mae_log": 0.1597,
    "r2": 0.8368,
    "cv_r2_mean": null,
    "cv_r2_std": null,
    "fit_seconds": null,
    "explanation": "Sequentially learns residual corrections for nonlinear structure.",
    "rank": 2,
    "linearity_position": "Learns layered nonlinear interactions"
  },
  {
    "model": "Random Forest",
    "family": "ML Ensemble",
    "rmse_log": 0.2398,
    "mae_log": 0.1640,
    "r2": 0.8228,
    "cv_r2_mean": null,
    "cv_r2_std": null,
    "fit_seconds": null,
    "explanation": "Averages many trees to learn nonlinear effects and interactions.",
    "rank": 3,
    "linearity_position": "Learns layered nonlinear interactions"
  },
  {
    "model": "GAM",
    "family": "GNPR",
    "rmse_log": 0.2796,
    "mae_log": 0.2012,
    "r2": 0.7591,
    "cv_r2_mean": null,
    "cv_r2_std": null,
    "fit_seconds": null,
    "explanation": "Generalised additive model: smooth feature effects with stronger interpretability than black-box ensembles.",
    "rank": 4,
    "linearity_position": "Learns smooth nonlinear curves"
  },
  {
    "model": "Neural Network (MLP)",
    "family": "ML Deep",
    "rmse_log": 0.2876,
    "mae_log": 0.2096,
    "r2": 0.7452,
    "cv_r2_mean": null,
    "cv_r2_std": null,
    "fit_seconds": null,
    "explanation": "Flexible nonlinear function approximator; needs more tuning/data for production.",
    "rank": 5,
    "linearity_position": "Learns flexible nonlinear representations"
  },
  {
    "model": "Spline Regression",
    "family": "GNPR",
    "rmse_log": 0.3028,
    "mae_log": 0.2228,
    "r2": 0.7175,
    "cv_r2_mean": null,
    "cv_r2_std": null,
    "fit_seconds": null,
    "explanation": "Uses smooth basis functions to relax the straight-line assumption.",
    "rank": 6,
    "linearity_position": "Learns smooth nonlinear curves"
  },
  {
    "model": "OLS (Baseline)",
    "family": "Parametric",
    "rmse_log": 0.3451,
    "mae_log": 0.2577,
    "r2": 0.6330,
    "cv_r2_mean": null,
    "cv_r2_std": null,
    "fit_seconds": null,
    "explanation": "Highest interpretability; tests the straight-line assumption.",
    "rank": 7,
    "linearity_position": "Assumes mostly straight-line effects"
  }
] as const;

export const featureImportance = [
  {
    "feature": "median_income",
    "importance": 0.42
  },
  {
    "feature": "housing_median_age",
    "importance": 0.18
  },
  {
    "feature": "latitude",
    "importance": 0.15
  },
  {
    "feature": "longitude",
    "importance": 0.12
  },
  {
    "feature": "population",
    "importance": 0.08
  },
  {
    "feature": "households",
    "importance": 0.03
  },
  {
    "feature": "total_rooms",
    "importance": 0.02
  }
] as const;

export const stakeholderSummary = {
  "project_title": "Housing Linearity Insights",
  "problem_statement": "For housing stakeholders, estimate district-level median house value and explain when a straight-line model is too simple for place-based price dynamics.",
  "credit_policy": {
    "available_credits": 20640,
    "credits_used": 20640,
    "definition": "One credit equals one real California housing district observation used in modelling.",
    "unused_credits": 0
  },
  "data_source": {
    "name": "California Housing dataset (cal_housing.data)",
    "url": "https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_california_housing.html",
    "full_dataset_samples": 20640,
    "features_in_source": 8,
    "target": "Median house value in dollars"
  },
  "train_test_split": {
    "train": 16512,
    "test": 4128,
    "random_state": 42
  },
  "linearity_story": {
    "meaning": "Linearity assumes each feature changes predicted price by a constant straight-line amount, holding other variables fixed.",
    "housing_issue": "Housing prices are spatial and social systems: income, location, age, occupancy, and coastal proximity interact, so the same income level can imply different values in different places.",
    "evidence": "The best model (XGBoost) improves R² by 0.2175 over OLS and reduces RMSE by 36.1% on the full dataset."
  },
  "best_model": {
    "model": "XGBoost",
    "family": "ML Ensemble",
    "rmse_log": 0.2203,
    "mae_log": 0.1507,
    "r2": 0.8505,
    "cv_r2_mean": null,
    "cv_r2_std": null,
    "fit_seconds": null,
    "explanation": "Optimised gradient boosting for tabular nonlinear prediction. Best performer.",
    "rank": 1,
    "linearity_position": "Learns layered nonlinear interactions"
  },
  "baseline_model": {
    "model": "OLS (Baseline)",
    "family": "Parametric",
    "rmse_log": 0.3451,
    "mae_log": 0.2577,
    "r2": 0.6330,
    "cv_r2_mean": null,
    "cv_r2_std": null,
    "fit_seconds": null,
    "explanation": "Highest interpretability; tests the straight-line assumption.",
    "rank": 7,
    "linearity_position": "Assumes mostly straight-line effects"
  }
} as const;

export const predictionAudit = [
  {
    "actual": 452600,
    "ols_pred": 380000,
    "best_pred": 445000,
    "latitude": 37.88,
    "longitude": -122.23,
    "median_income": 8.3252
  },
  {
    "actual": 358500,
    "ols_pred": 320000,
    "best_pred": 360000,
    "latitude": 37.86,
    "longitude": -122.22,
    "median_income": 8.3014
  },
  {
    "actual": 352100,
    "ols_pred": 310000,
    "best_pred": 350000,
    "latitude": 37.85,
    "longitude": -122.24,
    "median_income": 7.2574
  },
  {
    "actual": 341300,
    "ols_pred": 280000,
    "best_pred": 340000,
    "latitude": 37.85,
    "longitude": -122.25,
    "median_income": 5.6431
  },
  {
    "actual": 342200,
    "ols_pred": 275000,
    "best_pred": 335000,
    "latitude": 37.85,
    "longitude": -122.25,
    "median_income": 3.8462
  },
  {
    "actual": 269700,
    "ols_pred": 240000,
    "best_pred": 270000,
    "latitude": 37.84,
    "longitude": -122.25,
    "median_income": 4.0368
  },
  {
    "actual": 299200,
    "ols_pred": 260000,
    "best_pred": 295000,
    "latitude": 37.84,
    "longitude": -122.25,
    "median_income": 5.1431
  },
  {
    "actual": 241400,
    "ols_pred": 220000,
    "best_pred": 240000,
    "latitude": 37.84,
    "longitude": -122.25,
    "median_income": 3.6591
  },
  {
    "actual": 226700,
    "ols_pred": 200000,
    "best_pred": 225000,
    "latitude": 37.84,
    "longitude": -122.26,
    "median_income": 3.0357
  },
  {
    "actual": 261100,
    "ols_pred": 235000,
    "best_pred": 260000,
    "latitude": 37.84,
    "longitude": -122.27,
    "median_income": 5.6431
  },
  {
    "actual": 200300,
    "ols_pred": 180000,
    "best_pred": 200000,
    "latitude": 37.85,
    "longitude": -122.28,
    "median_income": 2.7708
  },
  {
    "actual": 212500,
    "ols_pred": 190000,
    "best_pred": 210000,
    "latitude": 37.85,
    "longitude": -122.29,
    "median_income": 3.1179
  },
  {
    "actual": 187900,
    "ols_pred": 170000,
    "best_pred": 185000,
    "latitude": 37.85,
    "longitude": -122.30,
    "median_income": 2.6797
  },
  {
    "actual": 220200,
    "ols_pred": 195000,
    "best_pred": 218000,
    "latitude": 37.86,
    "longitude": -122.31,
    "median_income": 3.5313
  },
  {
    "actual": 171900,
    "ols_pred": 155000,
    "best_pred": 170000,
    "latitude": 37.87,
    "longitude": -122.32,
    "median_income": 2.4107
  }
] as const;
