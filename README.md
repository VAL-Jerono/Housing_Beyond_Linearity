# Housing Linearity Insights

**Housing Linearity Insights** is a Vercel-ready stakeholder application built from the uploaded notebook, **Beyond_Linearity.ipynb**. The notebook’s modelling lesson has been reframed as a housing valuation problem: stakeholders need to understand when a transparent straight-line model is enough, and when housing prices require nonlinear curves, thresholds, and interactions.

The project uses the real **California Housing** dataset from scikit-learn and intentionally limits modelling to exactly **1000 observations**, treating one observation as one modelling credit. This satisfies the requested constraint that the project uses the available **1000 credits** without exceeding them.

## What the app does

The app presents a polished public-policy style briefing for housing stakeholders. It explains **linearity**, compares all model families from the notebook, highlights the best-performing model, shows feature importance, and translates the results into practical guidance for policy teams, planning offices, developers, and lenders.

| Requirement | Implementation |
|---|---|
| Read the notebook well | Extracted the modelling structure, the Beyond Linearity narrative, and the parametric/GNPR/nonlinear comparison logic. |
| Match it to a housing problem | Reframed the work as district-level median house value prediction for stakeholder decisions. |
| Compare all models | Compared OLS, Ridge, Lasso, Elastic Net, Polynomial Ridge, Spline Regression, GAM, Decision Tree, Random Forest, Gradient Boosting, XGBoost, KNN, SVR, and Neural Network. |
| Use 1000 credits | Used exactly 1000 real California housing observations; one row equals one credit. |
| Bring in linearity | The app explains that linearity means one constant slope, then shows where nonlinear models improve fit. |
| Simple but effective | Single-page React app with evidence cards, charts, model ledger, interpretive sections, and Vercel config. |

## Key modelling result

The best model in this reproducible 1000-credit experiment was **XGBoost**, achieving **R² = 0.7374** and **log-RMSE = 0.1928** on the held-out test set. The linear OLS baseline achieved **R² = 0.6907** and **log-RMSE = 0.2093**. Moving beyond the straight-line baseline improved R² by **0.0467** and reduced log-RMSE by **7.9%**.

## Model ranking

| Rank | Model | Family | RMSE | MAE | R² |
|---:|---|---|---:|---:|---:|
| 1 | XGBoost | ML Ensemble | 0.1928 | 0.1350 | 0.7374 |
| 2 | Neural Network | ML Deep | 0.1946 | 0.1410 | 0.7324 |
| 3 | Gradient Boosting | ML Ensemble | 0.1981 | 0.1428 | 0.7228 |
| 4 | Random Forest | ML Ensemble | 0.2015 | 0.1447 | 0.7131 |
| 5 | Spline Regression | GNPR | 0.2044 | 0.1452 | 0.7048 |
| 6 | OLS | Parametric | 0.2093 | 0.1527 | 0.6907 |
| 7 | Ridge | Parametric | 0.2093 | 0.1526 | 0.6906 |
| 8 | Elastic Net | Parametric | 0.2093 | 0.1527 | 0.6906 |
| 9 | Lasso | Parametric | 0.2094 | 0.1528 | 0.6902 |
| 10 | SVR | Kernel ML | 0.2100 | 0.1478 | 0.6883 |
| 11 | KNN | Instance-based ML | 0.2132 | 0.1616 | 0.6787 |
| 12 | GAM | GNPR | 0.2141 | 0.1475 | 0.6761 |
| 13 | Polynomial Ridge | Parametric Nonlinear | 0.2175 | 0.1477 | 0.6657 |
| 14 | Decision Tree | ML Tree | 0.2185 | 0.1603 | 0.6628 |

## Local development

```bash
pnpm install
pnpm build
pnpm preview
```

The Vercel configuration is included in `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist/public",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Important files

| File | Purpose |
|---|---|
| `client/src/pages/Home.tsx` | Main stakeholder application interface. |
| `client/src/data/modelResults.ts` | Static model comparison data exported from the reproducible analysis. |
| `client/src/index.css` | Civic Data Editorialism visual system and responsive styling. |
| `analysis/model_results_1000_credit.csv` | Reproducible model comparison table. |
| `analysis/stakeholder_modelling_summary.md` | Short modelling interpretation for non-technical audiences. |
| `run_housing_models.py` | Reproducible modelling script, included at the project root for auditability. |
| `vercel.json` | Vercel deployment configuration. |

## Design direction

The selected design direction is **Civic Data Editorialism**. It uses warm paper textures, deep ink typography, restrained teal and amber accents, editorial asymmetry, and data-first charts. The goal is to make the app feel like a credible housing policy briefing rather than a generic dashboard.
