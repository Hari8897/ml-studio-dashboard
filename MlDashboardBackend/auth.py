from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database.db import get_db
from database.user_model import User

router = APIRouter()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


@router.post("/register")
def register(
    data: dict,
    db: Session = Depends(get_db)
):

    try:
        required_fields = ("username", "email", "password")
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return {
                "error": f"Missing required field(s): {', '.join(missing_fields)}"
            }

        existing_user = db.query(User).filter(
            User.email == data["email"]
        ).first()

        if existing_user:

            return {
                "error": "Email already exists"
            }

        hashed_password = pwd_context.hash(
            data["password"]
        )

        new_user = User(
            username=data["username"],
            email=data["email"],
            password=hashed_password
        )

        db.add(new_user)

        db.commit()

        db.refresh(new_user)
        
        print("Registered user:", new_user.username)

        return {
            "message": "Registered Successfully"
        }

    except Exception as e:

        print("REGISTER ERROR:", str(e))

        return {
            "error": str(e)
        }



@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data["email"]).first()
    if not user or not pwd_context.verify(data["password"], user.password):
        return {"error": "Invalid email or password"}
    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
        }
