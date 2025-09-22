from authenticator import User, Base
from models import engine, SessionLocal

# Crie as tabelas (se ainda não existem)
Base.metadata.create_all(bind=engine)

# Inicie uma sessão
db = SessionLocal()

# Crie um novo usuário
new_user = User(
    username="joao",
    email="joaopege@gmail.com",
    full_name="Joao Paulo",
    hashed_password="fakehashedjoao10",  # Use o mesmo hash do seu sistema
    disabled=False
)

# Adicione e salve no banco
db.add(new_user)
db.commit()
db.close()