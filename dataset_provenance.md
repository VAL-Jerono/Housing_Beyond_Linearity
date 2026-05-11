# Dataset provenance notes

The stakeholder app uses the California Housing regression dataset as described by scikit-learn. The authoritative documentation states that `fetch_california_housing` loads the California housing dataset for regression; the returned data matrix has shape `(20640, 8)`, and the target array has shape `(20640,)`. Each target value corresponds to median house value in units of 100,000 dollars. The page also notes that the dataset consists of 20,640 samples and 9 features when including the target.

Source: https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_california_housing.html
