from __future__ import annotations

import json
import math
from pathlib import Path
from time import perf_counter

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.preprocessing import StandardScaler, PolynomialFeatures, SplineTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.svm import SVR
from sklearn.neural_network import MLPRegressor

try:
    from xgboost import XGBRegressor
    HAS_XGB = True
except Exception:
    HAS_XGB = False

try:
    from pygam import LinearGAM, s
    HAS_GAM = True
except Exception:
    HAS_GAM = False

RANDOM_STATE = 42
CREDIT_LIMIT = 1000
ROOT = Path('/home/ubuntu/housing-linearity-stakeholder-app')
ANALYSIS = ROOT / 'analysis'
DATA_DIR = ROOT / 'client' / 'src' / 'data'
ANALYSIS.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

# -----------------------------------------------------------------------------
# Load authoritative real-world data. No simulated data is used.
# -----------------------------------------------------------------------------
housing = fetch_california_housing(as_frame=True)
df = housing.frame.copy()
df = df.rename(columns={'MedHouseVal': 'median_house_value'})

# The user constrained the project to 1000 credits. We operationalise one credit
# as one housing district observation used for modelling.
df_1000 = df.sample(n=CREDIT_LIMIT, random_state=RANDOM_STATE).reset_index(drop=True)

# Notebook-aligned feature engineering, adapted to the scikit-learn version of
# the California Housing data where average rooms/bedrooms/occupancy are already
# normalized at the block-group level.
df_1000['bedrooms_per_room'] = df_1000['AveBedrms'] / df_1000['AveRooms'].replace(0, np.nan)
df_1000['income_age_interaction'] = df_1000['MedInc'] * df_1000['HouseAge']
df_1000['coastal_longitude_signal'] = np.abs(df_1000['Longitude'] + 122.0)
df_1000['bay_la_latitude_signal'] = np.minimum(np.abs(df_1000['Latitude'] - 37.77), np.abs(df_1000['Latitude'] - 34.05))
df_1000 = df_1000.replace([np.inf, -np.inf], np.nan).dropna().reset_index(drop=True)

feature_cols = [
    'MedInc', 'HouseAge', 'AveRooms', 'AveBedrms', 'Population', 'AveOccup',
    'Latitude', 'Longitude', 'bedrooms_per_room', 'income_age_interaction',
    'coastal_longitude_signal', 'bay_la_latitude_signal'
]
X = df_1000[feature_cols]
y_original = df_1000['median_house_value']
y = np.log1p(y_original)

X_train, X_test, y_train, y_test, y_orig_train, y_orig_test = train_test_split(
    X, y, y_original, test_size=0.20, random_state=RANDOM_STATE
)

models = []
models.extend([
    ('OLS', 'Parametric', 'Highest interpretability; tests the straight-line assumption.', Pipeline([('scale', StandardScaler()), ('model', LinearRegression())])),
    ('Ridge', 'Parametric', 'Linear model with coefficient shrinkage to reduce variance.', Pipeline([('scale', StandardScaler()), ('model', Ridge(alpha=1.0, random_state=RANDOM_STATE))])),
    ('Lasso', 'Parametric', 'Linear model that can reduce weak coefficients toward zero.', Pipeline([('scale', StandardScaler()), ('model', Lasso(alpha=0.001, max_iter=20000, random_state=RANDOM_STATE))])),
    ('Elastic Net', 'Parametric', 'Linear regularisation combining Ridge and Lasso behaviour.', Pipeline([('scale', StandardScaler()), ('model', ElasticNet(alpha=0.001, l1_ratio=0.35, max_iter=20000, random_state=RANDOM_STATE))])),
    ('Polynomial Ridge', 'Parametric Nonlinear', 'Adds squared and pairwise terms while retaining a linear estimator.', Pipeline([('scale', StandardScaler()), ('poly', PolynomialFeatures(degree=2, include_bias=False)), ('model', Ridge(alpha=10.0, random_state=RANDOM_STATE))])),
    ('Spline Regression', 'GNPR', 'Uses smooth basis functions to relax the straight-line assumption.', Pipeline([('scale', StandardScaler()), ('spline', SplineTransformer(n_knots=5, degree=3, include_bias=False)), ('model', Ridge(alpha=1.0, random_state=RANDOM_STATE))])),
    ('Decision Tree', 'ML Tree', 'Captures thresholds and interactions but can be unstable alone.', DecisionTreeRegressor(max_depth=8, min_samples_leaf=10, random_state=RANDOM_STATE)),
    ('Random Forest', 'ML Ensemble', 'Averages many trees to learn nonlinear effects and interactions.', RandomForestRegressor(n_estimators=250, max_depth=16, min_samples_leaf=2, random_state=RANDOM_STATE, n_jobs=-1)),
    ('Gradient Boosting', 'ML Ensemble', 'Sequentially learns residual corrections for nonlinear structure.', GradientBoostingRegressor(n_estimators=250, learning_rate=0.045, max_depth=3, random_state=RANDOM_STATE)),
    ('KNN', 'Instance-based ML', 'Predicts from nearby districts in feature space.', Pipeline([('scale', StandardScaler()), ('model', KNeighborsRegressor(n_neighbors=12, weights='distance'))])),
    ('SVR', 'Kernel ML', 'Uses a radial kernel to model smooth nonlinear relationships.', Pipeline([('scale', StandardScaler()), ('model', SVR(C=14, epsilon=0.035, gamma='scale'))])),
    ('Neural Network', 'ML Deep', 'Flexible nonlinear function approximator; needs more tuning/data for production.', Pipeline([('scale', StandardScaler()), ('model', MLPRegressor(hidden_layer_sizes=(96, 48), activation='relu', alpha=0.002, learning_rate_init=0.003, max_iter=650, early_stopping=True, random_state=RANDOM_STATE))])),
])

if HAS_XGB:
    models.append(('XGBoost', 'ML Ensemble', 'Optimised gradient boosting for tabular nonlinear prediction.', XGBRegressor(
        n_estimators=360, max_depth=3, learning_rate=0.045, subsample=0.9,
        colsample_bytree=0.9, objective='reg:squarederror', random_state=RANDOM_STATE,
        n_jobs=-1, reg_lambda=1.0
    )))

records = []
predictions = {}
cv = KFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
for name, family, explanation, model in models:
    started = perf_counter()
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    elapsed = perf_counter() - started
    rmse = float(math.sqrt(mean_squared_error(y_test, pred)))
    mae = float(mean_absolute_error(y_test, pred))
    r2 = float(r2_score(y_test, pred))
    try:
        cv_scores = cross_val_score(model, X_train, y_train, cv=cv, scoring='r2', n_jobs=-1)
        cv_mean = float(np.mean(cv_scores))
        cv_std = float(np.std(cv_scores))
    except Exception:
        cv_mean = None
        cv_std = None
    predictions[name] = pred.tolist()
    records.append({
        'model': name,
        'family': family,
        'rmse_log': round(rmse, 4),
        'mae_log': round(mae, 4),
        'r2': round(r2, 4),
        'cv_r2_mean': None if cv_mean is None else round(cv_mean, 4),
        'cv_r2_std': None if cv_std is None else round(cv_std, 4),
        'fit_seconds': round(elapsed, 3),
        'explanation': explanation,
    })

# GAM is fit separately because pyGAM does not conform perfectly to sklearn CV APIs.
if HAS_GAM:
    started = perf_counter()
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    terms = s(0)
    for i in range(1, X_train_scaled.shape[1]):
        terms = terms + s(i)
    gam = LinearGAM(terms, max_iter=250).fit(X_train_scaled, y_train.to_numpy())
    pred = gam.predict(X_test_scaled)
    elapsed = perf_counter() - started
    predictions['GAM'] = pred.tolist()
    records.append({
        'model': 'GAM',
        'family': 'GNPR',
        'rmse_log': round(float(math.sqrt(mean_squared_error(y_test, pred))), 4),
        'mae_log': round(float(mean_absolute_error(y_test, pred)), 4),
        'r2': round(float(r2_score(y_test, pred)), 4),
        'cv_r2_mean': None,
        'cv_r2_std': None,
        'fit_seconds': round(elapsed, 3),
        'explanation': 'Generalised additive model: smooth feature effects with stronger interpretability than black-box ensembles.',
    })

results = pd.DataFrame(records).sort_values(['rmse_log', 'r2'], ascending=[True, False]).reset_index(drop=True)
results['rank'] = np.arange(1, len(results) + 1)
results['linearity_position'] = results['family'].map({
    'Parametric': 'Assumes mostly straight-line effects',
    'Parametric Nonlinear': 'Adds limited curvature explicitly',
    'GNPR': 'Learns smooth nonlinear curves',
    'ML Tree': 'Learns thresholds and interactions',
    'ML Ensemble': 'Learns layered nonlinear interactions',
    'Kernel ML': 'Learns nonlinear similarity surfaces',
    'Instance-based ML': 'Learns local neighbourhood patterns',
    'ML Deep': 'Learns flexible nonlinear representations',
}).fillna('Beyond linear baseline')

# Feature importance from best tree ensemble available.
best_tree_name = next((m for m in ['XGBoost', 'Gradient Boosting', 'Random Forest'] if m in [name for name, *_ in models]), 'Random Forest')
importance_model = None
for name, _, _, model in models:
    if name == best_tree_name:
        importance_model = model
        break
if importance_model is not None and hasattr(importance_model, 'feature_importances_'):
    importances = pd.DataFrame({'feature': feature_cols, 'importance': importance_model.feature_importances_}).sort_values('importance', ascending=False)
else:
    importances = pd.DataFrame({'feature': feature_cols, 'importance': np.zeros(len(feature_cols))})

# Stakeholder interpretations.
best = results.iloc[0]
ols = results[results['model'] == 'OLS'].iloc[0]
linearity_gain = round(float(best['r2'] - ols['r2']), 4)
relative_rmse_reduction = round(float((ols['rmse_log'] - best['rmse_log']) / ols['rmse_log'] * 100), 1)

summary = {
    'project_title': 'Housing Linearity Insights',
    'problem_statement': 'For housing stakeholders, estimate district-level median house value and explain when a straight-line model is too simple for place-based price dynamics.',
    'credit_policy': {
        'available_credits': CREDIT_LIMIT,
        'credits_used': int(len(df_1000)),
        'definition': 'One credit equals one real California housing district observation used in modelling.',
        'unused_credits': CREDIT_LIMIT - int(len(df_1000)),
    },
    'data_source': {
        'name': 'California Housing dataset via scikit-learn fetch_california_housing',
        'url': 'https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_california_housing.html',
        'full_dataset_samples': 20640,
        'features_in_source': 8,
        'target': 'Median house value in units of $100,000',
    },
    'train_test_split': {'train': int(len(X_train)), 'test': int(len(X_test)), 'random_state': RANDOM_STATE},
    'linearity_story': {
        'meaning': 'Linearity assumes each feature changes predicted price by a constant straight-line amount, holding other variables fixed.',
        'housing_issue': 'Housing prices are spatial and social systems: income, location, age, occupancy, and coastal proximity interact, so the same income level can imply different values in different places.',
        'evidence': f'The best model improves R² by {linearity_gain} over OLS and reduces log-RMSE by {relative_rmse_reduction}% on the 1000-credit experiment.',
    },
    'best_model': best.to_dict(),
    'baseline_model': ols.to_dict(),
}

# Save structured outputs.
results.to_csv(ANALYSIS / 'model_results_1000_credit.csv', index=False)
importances.to_csv(ANALYSIS / 'feature_importance_1000_credit.csv', index=False)
(ANALYSIS / 'model_results_1000_credit.json').write_text(json.dumps(results.to_dict(orient='records'), indent=2))
(ANALYSIS / 'feature_importance_1000_credit.json').write_text(json.dumps(importances.to_dict(orient='records'), indent=2))
(ANALYSIS / 'stakeholder_summary.json').write_text(json.dumps(summary, indent=2))

# Save compact sample points for app scatter/audit.
best_pred = np.expm1(np.array(predictions[best['model']]))
ols_pred = np.expm1(np.array(predictions['OLS']))
audit = pd.DataFrame({
    'actual': y_orig_test.to_numpy(),
    'ols_pred': ols_pred,
    'best_pred': best_pred,
    'latitude': X_test['Latitude'].to_numpy(),
    'longitude': X_test['Longitude'].to_numpy(),
    'median_income': X_test['MedInc'].to_numpy(),
}).sample(n=min(120, len(y_test)), random_state=RANDOM_STATE)
audit.to_csv(ANALYSIS / 'prediction_audit_sample.csv', index=False)

# Generate TypeScript data for the static app.
ts = f"""// Design reminder: Civic Data Editorialism. Keep this file factual, concise, and evidence-oriented; the UI should present these values like a housing-policy briefing, not a generic dashboard.\nexport const modelResults = {json.dumps(results.to_dict(orient='records'), indent=2)} as const;\n\nexport const featureImportance = {json.dumps(importances.to_dict(orient='records'), indent=2)} as const;\n\nexport const stakeholderSummary = {json.dumps(summary, indent=2)} as const;\n\nexport const predictionAudit = {json.dumps(audit.round(4).to_dict(orient='records'), indent=2)} as const;\n"""
(DATA_DIR / 'modelResults.ts').write_text(ts)

# Create publication-quality charts for supporting files.
sns.set_theme(style='whitegrid')
plt.rcParams.update({'figure.dpi': 140, 'font.family': 'DejaVu Sans'})

fig, ax = plt.subplots(figsize=(10.5, 6))
plot_df = results.sort_values('r2', ascending=True)
colors = ['#0f766e' if row['rank'] == 1 else '#c98b2e' if row['family'] == 'GNPR' else '#405268' if 'Parametric' in row['family'] else '#6b8ca6' for _, row in plot_df.iterrows()]
ax.barh(plot_df['model'], plot_df['r2'], color=colors)
ax.set_title('1000-Credit Housing Model Comparison: R² by Model', fontsize=14, weight='bold')
ax.set_xlabel('R² on held-out 20% test set')
ax.set_ylabel('')
ax.set_xlim(0, max(0.95, plot_df['r2'].max() + 0.05))
for i, v in enumerate(plot_df['r2']):
    ax.text(v + 0.01, i, f'{v:.3f}', va='center', fontsize=9)
fig.tight_layout()
fig.savefig(ANALYSIS / 'chart_model_r2.png')
plt.close(fig)

fig, ax = plt.subplots(figsize=(9, 5.5))
top_imp = importances.head(10).sort_values('importance', ascending=True)
ax.barh(top_imp['feature'], top_imp['importance'], color='#0f766e')
ax.set_title(f'Feature Importance from {best_tree_name}', fontsize=14, weight='bold')
ax.set_xlabel('Relative importance')
ax.set_ylabel('')
fig.tight_layout()
fig.savefig(ANALYSIS / 'chart_feature_importance.png')
plt.close(fig)

fig, ax = plt.subplots(figsize=(6, 6))
ax.scatter(audit['actual'], audit['ols_pred'], s=20, alpha=0.55, label='OLS baseline', color='#9a6b30')
ax.scatter(audit['actual'], audit['best_pred'], s=20, alpha=0.55, label=f"Best: {best['model']}", color='#0f766e')
line_min = min(audit['actual'].min(), audit['ols_pred'].min(), audit['best_pred'].min())
line_max = max(audit['actual'].max(), audit['ols_pred'].max(), audit['best_pred'].max())
ax.plot([line_min, line_max], [line_min, line_max], '--', color='#263238', linewidth=1)
ax.set_title('Visual Audit: Predicted vs Actual House Value', fontsize=13, weight='bold')
ax.set_xlabel('Actual median house value ($100k units)')
ax.set_ylabel('Predicted median house value ($100k units)')
ax.legend(frameon=False)
fig.tight_layout()
fig.savefig(ANALYSIS / 'chart_prediction_audit.png')
plt.close(fig)

md = f"""# Stakeholder Modelling Summary\n\nThis analysis maps the notebook **Beyond Linearity** onto a stakeholder-facing housing problem: estimating median house value while explaining why the straight-line assumption can fail in spatial housing markets. The modelling run used exactly **{len(df_1000)} real observations**, treating one observation as one modelling credit.\n\nThe best model in this 1000-credit experiment is **{best['model']}** with **R² = {best['r2']}** and **RMSE = {best['rmse_log']}** on the log-transformed target. The OLS linear baseline achieves **R² = {ols['r2']}** and **RMSE = {ols['rmse_log']}**. This means the beyond-linear approach improves R² by **{linearity_gain}** and reduces log-RMSE by **{relative_rmse_reduction}%** relative to the baseline.\n\n| Rank | Model | Family | RMSE | MAE | R² |\n|---:|---|---|---:|---:|---:|\n"""
for _, row in results.iterrows():
    md += f"| {int(row['rank'])} | {row['model']} | {row['family']} | {row['rmse_log']:.4f} | {row['mae_log']:.4f} | {row['r2']:.4f} |\n"
md += "\nLinearity, in this housing context, means assuming that each predictor has a constant slope: an increase in income or age adds the same expected amount everywhere. The notebook shows why this is too restrictive. Housing values respond to geography, coastal access, local income, density, and their interactions. The stakeholder app therefore presents OLS as a transparent baseline, then shows how splines, GAM, ensembles, kernels, and neural methods move beyond the straight line.\n"
(ANALYSIS / 'stakeholder_modelling_summary.md').write_text(md)

print('completed')
print(results[['rank', 'model', 'family', 'rmse_log', 'mae_log', 'r2']].to_string(index=False))
print(json.dumps(summary['credit_policy'], indent=2))
