# Stakeholder Modelling Summary

This analysis maps the notebook **Beyond Linearity** onto a stakeholder-facing housing problem: estimating median house value while explaining why the straight-line assumption can fail in spatial housing markets. The modelling run used exactly **1000 real observations**, treating one observation as one modelling credit.

The best model in this 1000-credit experiment is **XGBoost** with **R² = 0.7374** and **RMSE = 0.1928** on the log-transformed target. The OLS linear baseline achieves **R² = 0.6907** and **RMSE = 0.2093**. This means the beyond-linear approach improves R² by **0.0467** and reduces log-RMSE by **7.9%** relative to the baseline.

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

Linearity, in this housing context, means assuming that each predictor has a constant slope: an increase in income or age adds the same expected amount everywhere. The notebook shows why this is too restrictive. Housing values respond to geography, coastal access, local income, density, and their interactions. The stakeholder app therefore presents OLS as a transparent baseline, then shows how splines, GAM, ensembles, kernels, and neural methods move beyond the straight line.
