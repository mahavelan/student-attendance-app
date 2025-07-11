# backend/models.py

import pandas as pd
import os
from datetime import datetime

def save_attendance(batch, present_list):
    folder = f"logs/{batch}"
    os.makedirs(folder, exist_ok=True)

    today = datetime.now().strftime("%Y-%m-%d")
    path = f"{folder}/{today}.csv"

    df = pd.DataFrame({
        "Register No": present_list,
        "Status": ["Present"] * len(present_list)
    })
    
    df.to_csv(path, index=False)
    print(f"✅ Attendance saved to {path} with {len(present_list)} students.")
    return {"status": "success", "saved_file": path, "count": len(present_list)}
