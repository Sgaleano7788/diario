import os
import pickle
import requests
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

SCOPES = ["https://www.googleapis.com/auth/photoslibrary.appendonly"]

def get_credentials():
    creds = None

    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=0)

        with open("token.pickle", "wb") as token:
            pickle.dump(creds, token)

    return creds


def upload_photo(file_path):
    creds = get_credentials()

    # 1️⃣ Subir bytes
    with open(file_path, "rb") as f:
        upload_token = requests.post(
            "https://photoslibrary.googleapis.com/v1/uploads",
            headers={
                "Authorization": f"Bearer {creds.token}",
                "Content-Type": "application/octet-stream",
                "X-Goog-Upload-Protocol": "raw",
                "X-Goog-Upload-File-Name": os.path.basename(file_path),
            },
            data=f.read(),
        ).text

    # 2️⃣ Crear media item
    create_resp = requests.post(
        "https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate",
        headers={
            "Authorization": f"Bearer {creds.token}",
            "Content-Type": "application/json",
        },
        json={
            "newMediaItems": [
                {
                    "simpleMediaItem": {
                        "uploadToken": upload_token
                    }
                }
            ]
        },
    )

    if create_resp.status_code != 200:
        raise Exception(create_resp.text)

    data = create_resp.json()
    media_id = data["newMediaItemResults"][0]["mediaItem"]["id"]

    return media_id
