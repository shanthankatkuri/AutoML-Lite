from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.svm import SVC, SVR
import numpy as np

def run_automl(df, task):
    X = df.iloc[:, :-1]
    y = df.iloc[:, -1]

    # Encoding categorical target column
    if y.dtype == 'object':  # Check if target is categorical
        le = LabelEncoder()
        y = le.fit_transform(y)

    num_cols = X.select_dtypes(include=['int', 'float']).columns
    cat_cols = X.select_dtypes(include=['object']).columns

    numeric_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="mean")),
        ("scaler", StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore"))
    ])

    preprocessor = ColumnTransformer(transformers=[
        ("num", numeric_transformer, num_cols),
        ("cat", categorical_transformer, cat_cols)
    ])

    if task == "Classification":
        models = {
            "LogisticRegression": LogisticRegression(),
            "RandomForest": RandomForestClassifier(),
            "SVM": SVC()
        }
    else:
        models = {
            "LinearRegression": LinearRegression(),
            "RandomForestRegressor": RandomForestRegressor(),
            "SVR": SVR()
        }

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    best_score = -np.inf
    best_model = None
    best_model_name = ""

    for name, model in models.items():
        pipe = Pipeline(steps=[("preprocessor", preprocessor), ("model", model)])
        pipe.fit(X_train, y_train)
        score = pipe.score(X_test, y_test)

        if score > best_score:
            best_score = score
            best_model = pipe
            best_model_name = name

    return best_model, best_score, best_model_name
