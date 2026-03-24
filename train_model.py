import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import random

random.seed(42)

def r(lo, hi):
    return round(random.uniform(lo, hi), 1)

positions_config = {
    'Goalkeeper': dict(
        height=(185,200), weight=(78,95), speed=(40,62),  stamina=(52,70),
        strength=(72,90), passing=(42,65), dribbling=(20,42),
        vision=(58,75),   shooting=(15,35), defending=(82,96)),
    'Defender': dict(
        height=(180,195), weight=(74,90), speed=(55,75),  stamina=(68,85),
        strength=(74,90), passing=(58,76), dribbling=(48,68),
        vision=(58,75),   shooting=(32,55), defending=(76,92)),
    'Midfielder': dict(
        height=(172,184), weight=(68,80), speed=(68,84),  stamina=(80,94),
        strength=(64,80), passing=(78,93), dribbling=(68,84),
        vision=(74,90),   shooting=(58,76), defending=(58,74)),
    'Winger': dict(
        height=(168,180), weight=(64,76), speed=(83,97),  stamina=(74,89),
        strength=(60,76), passing=(68,84), dribbling=(82,96),
        vision=(72,87),   shooting=(74,90), defending=(28,48)),
    'Striker': dict(
        height=(174,190), weight=(72,86), speed=(78,94),  stamina=(72,88),
        strength=(72,86), passing=(62,78), dribbling=(76,92),
        vision=(68,84),   shooting=(84,97), defending=(22,42)),
}

rows = []
for _ in range(2000):
    pos = random.choice(list(positions_config.keys()))
    cfg = positions_config[pos]
    rows.append({
        **{k: r(*v) for k, v in cfg.items()},
        'position': pos
    })

df = pd.DataFrame(rows)

FEATURES = [
    'height', 'weight', 'speed', 'stamina', 'strength',
    'passing', 'dribbling', 'vision', 'shooting', 'defending'
]

X = df[FEATURES]
y = df['position']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print("Classes:", list(model.classes_))

joblib.dump(model, 'football_position_model.pkl')
print("Model saved successfully!")