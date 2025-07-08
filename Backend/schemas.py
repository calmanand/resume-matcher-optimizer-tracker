from pydantic import BaseModel

class UserCreate(BaseModel):
    fullName: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    _id: str
    fullName: str
    email: str