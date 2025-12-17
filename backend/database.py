import sqlite3


conn = sqlite3.connect('album.db', check_same_thread=False)
cursor = conn.cursor()


cursor.execute('''
CREATE TABLE IF NOT EXISTS memories (
id INTEGER PRIMARY KEY AUTOINCREMENT,
date TEXT,
note TEXT,
photo_id TEXT
)
''')
conn.commit()