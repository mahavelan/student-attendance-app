# backend/face_utils.py

import face_recognition
import os

def recognize_faces(batch, input_image_path):
    input_image = face_recognition.load_image_file(input_image_path)
    input_encodings = face_recognition.face_encodings(input_image)

    if not input_encodings:
        return []

    input_encoding = input_encodings[0]

    known_encodings = []
    known_names = []

    batch_path = f"frontend/data/faces/{batch}"
    if not os.path.exists(batch_path):
        return []

    for filename in os.listdir(batch_path):
        if filename.endswith(".jpg"):
            reg_no = filename.split(".")[0]
            image_path = os.path.join(batch_path, filename)
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)
            if encodings:
                known_encodings.append(encodings[0])
                known_names.append(reg_no)

    matches = face_recognition.compare_faces(known_encodings, input_encoding)
    matched_names = [name for match, name in zip(matches, known_names) if match]

    return matched_names
