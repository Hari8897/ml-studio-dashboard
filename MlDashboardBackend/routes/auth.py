from datetime import datetime, timedelta
import secrets
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from database.db_models import User, PasswordResetToken

from utils.security import hash_password
from pydantic import BaseModel, EmailStr

router = APIRouter()

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
        
        #print("Registered user:", new_user.username)

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


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == request.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email not found"
        )

    token = str(uuid4())

    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=1)
    )

    db.add(reset_token)
    db.commit()
    db.refresh(reset_token)

    return {
        "message": "Password reset token generated",
        "token": token
    }


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == request.token
    ).first()

    if not reset_token:
        raise HTTPException(
            status_code=400,
            detail="Invalid token"
        )

    if reset_token.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Token expired"
        )

    user = db.query(User).filter(
        User.id == reset_token.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.password = hash_password(
        request.new_password
    )

    db.delete(reset_token)

    db.commit()

    return {
        "message": "Password reset successful"
    }
