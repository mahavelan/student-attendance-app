# backend/face_utils.py

import face_recognition
import os

def recognize_faces(batch, uploaded_path):
    known_encodings = []
    known_names = []

    folder = f"faces/{batch}"
    if not os.path.exists(folder):
        return []

    for img_file in os.listdir(folder):
        path = os.path.join(folder, img_file)
        img = face_recognition.load_image_file(path)
        enc = face_recognition.face_encodings(img)
        if enc:
            known_encodings.append(enc[0])
            known_names.append(img_file.replace(".jpg", ""))

    uploaded_img = face_recognition.load_image_file(uploaded_path)
    upload_encodings = face_recognition.face_encodings(uploaded_img)

    recognized = set()
    for enc in upload_encodings:
        matches = face_recognition.compare_faces(known_encodings, enc, tolerance=0.5)
        if True in matches:
            idx = matches.index(True)
            recognized.add(known_names[idx])
    return list(recognized)
