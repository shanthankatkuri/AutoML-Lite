# from sklearn.pipeline import Pipeline
# from sklearn.model_selection import train_test_split, RandomizedSearchCV
# from sklearn.preprocessing import LabelEncoder
# from sklearn.preprocessing import StandardScaler, OneHotEncoder
# from sklearn.compose import ColumnTransformer
# from sklearn.impute import SimpleImputer
# from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
# from sklearn.linear_model import LogisticRegression, LinearRegression
# from sklearn.svm import SVC, SVR
# import numpy as np

# def run_automl(df, task):
#     X = df.iloc[:, :-1]
#     y = df.iloc[:, -1]

#     # Encoding categorical target column
#     if y.dtype == 'object':  # Check if target is categorical
#         le = LabelEncoder()
#         y = le.fit_transform(y)

#     num_cols = X.select_dtypes(include=['int', 'float']).columns
#     cat_cols = X.select_dtypes(include=['object']).columns

#     numeric_transformer = Pipeline(steps=[
#         ("imputer", SimpleImputer(strategy="mean")),
#         ("scaler", StandardScaler())
#     ])

#     categorical_transformer = Pipeline(steps=[
#         ("imputer", SimpleImputer(strategy="most_frequent")),
#         ("encoder", OneHotEncoder(handle_unknown="ignore"))
#     ])

#     preprocessor = ColumnTransformer(transformers=[
#         ("num", numeric_transformer, num_cols),
#         ("cat", categorical_transformer, cat_cols)
#     ])

#     if task.strip().lower() == "classification":
#         models = {
#             "LogisticRegression": LogisticRegression(),
#             "RandomForest": RandomForestClassifier(),
#             "SVM": SVC()
#         }
#     else:
#         models = {
#             "LinearRegression": LinearRegression(),
#             "RandomForestRegressor": RandomForestRegressor(),
#             "SVR": SVR()
#         }

#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

#     best_score = -np.inf
#     best_model = None
#     best_model_name = ""

#     for name, model in models.items():
#         pipe = Pipeline(steps=[("preprocessor", preprocessor), ("model", model)])
#         pipe.fit(X_train, y_train)
#         score = pipe.score(X_test, y_test)

#         if score > best_score:
#             best_score = score
#             best_model = pipe
#             best_model_name = name

#     return best_model, best_score, best_model_name

#------------------------------------------------------

from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, cross_val_score, RandomizedSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.svm import SVC, SVR
from sklearn.metrics import accuracy_score, r2_score
import numpy as np

def run_automl(df, task):
    X = df.iloc[:, :-1]
    y = df.iloc[:, -1]

    if y.dtype == 'object':
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
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])

    preprocessor = ColumnTransformer(transformers=[
        ("num", numeric_transformer, num_cols),
        ("cat", categorical_transformer, cat_cols)
    ])

    task = task.strip().lower()
    if task == "classification":
        models = {
            "LogisticRegression": (LogisticRegression(max_iter=1000), None),
            "RandomForest": (RandomForestClassifier(), {
                "model__n_estimators": [100],
                "model__max_depth": [None, 10]
            }),
            "SVM": (SVC(), {
                "model__C": [1],
                "model__kernel": ["rbf"]
            })
        }
        scoring = "accuracy"
        splitter_args = {"stratify": y}
    else:
        models = {
            "LinearRegression": (LinearRegression(), None),
            "RandomForestRegressor": (RandomForestRegressor(), {
                "model__n_estimators": [100],
                "model__max_depth": [None, 10]
            }),
            "SVR": (SVR(), {
                "model__C": [1],
                "model__kernel": ["rbf"]
            })
        }
        scoring = "r2"
        splitter_args = {}

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, **splitter_args)

    best_score = -np.inf
    best_model = None
    best_model_name = ""

    for name, (model, param_grid) in models.items():
        pipe = Pipeline(steps=[("preprocessor", preprocessor), ("model", model)])

        if param_grid:
            search = RandomizedSearchCV(pipe, param_distributions=param_grid, cv=3, n_iter=3, scoring=scoring, random_state=42, n_jobs=-1)
            search.fit(X_train, y_train)
            val_score = search.best_score_
            final_model = search.best_estimator_
        else:
            scores = cross_val_score(pipe, X_train, y_train, cv=3, scoring=scoring, n_jobs=-1)
            val_score = scores.mean()
            final_model = pipe.fit(X_train, y_train)

        y_pred = final_model.predict(X_test)
        test_score = accuracy_score(y_test, y_pred) if task == "classification" else r2_score(y_test, y_pred)

        print(f"{name}: CV Score = {val_score:.4f}, Test Score = {test_score:.4f}")

        if val_score > best_score:
            best_score = val_score
            best_model = final_model
            best_model_name = name

    return best_model, best_score, best_model_name

