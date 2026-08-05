from sqlalchemy import Column, ForeignKeyConstraint,Text, Integer,Float, String, DateTime, ForeignKey,Numeric,LargeBinary,Boolean, func
from sqlalchemy.orm import relationship
from database.db import Base

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key = True, index=True)
    username = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(255))
    role = Column(String(255))
    profile_image = Column(String(255))
    email_verified = Column(String(100))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    last_login = Column( DateTime, nullable=True)

    datasets = relationship("Dataset", back_populates="user")
    password_tokens = relationship("PasswordResetToken",
                                   back_populates="user",
                                   cascade="all, delete-orphan"
                                   )


class Dataset(Base):
    __tablename__ = "datasets"

    dataset_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    datasetname = Column(String(225))

    file_data = Column(LargeBinary, nullable=True)

    rows = Column(Integer)
    columns = Column(Integer)
    filesize_mb = Column(Numeric(10,2))
    upload_time = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="datasets")

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    token_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    password_token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)

    user = relationship("User",back_populates="password_tokens")



class Project(Base):
    __tablename__ = "projects"
    project_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    project_name = Column(String(255), nullable=False)
    description = Column(Text)
    project_type = Column(String(50))
    status = Column(String(30), default="ACtive")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    user = relationship("User")


class Preprocessing(Base):
    __tablename__ = "preprocessing"

    preprocessing_id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.project_id", ondelete="CASCADE"), nullable=False)
    dataset_id = Column(Integer, ForeignKey("datasets.dataset_id", ondelete="CASCADE"), nullable=False)
    missing_values = Column(Boolean, default=False)
    encoding = Column(String(100), nullable=False)
    feature_selection = Column(String(100), nullable=True)
    outlier_removal = Column(Boolean, default=False)
    status = Column(String(100), default=False)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    project = relationship("Project")
    dataset = relationship("Dataset")


class TrainedModel(Base):
    __tablename__ = "trained_models"

    model_id =Column(Integer, primary_key=True, index=True) 
    project_id = Column(Integer, ForeignKey("projects.project_id", ondelete="CASCADE"), nullable=False)
    model_name = Column(String(255), nullable=False)
    algorithm = Column(String(100), nullable=False)
    problem_type = Column(String(100), nullable=False)
    model_path = Column(Text)
    training_time = Column(Float)
    created_at = Column(DateTime, server_default=func.now())

    project = relationship("Project")

class TrainingRun(Base):
    __tablename__ = "training_runs"

    run_id = Column(Integer, primary_key=True, index=True)
    model_id = Column(Integer, ForeignKey("trained_models.model_id", ondelete="CASCADE"), nullable=False)
    accuracy = Column(Numeric(5,2))
    precision = Column(Numeric(5,2))
    recall = Column(Numeric(5,2))
    f1_score = Column(Numeric(5,2))
    roc_auc = Column(Numeric(5,2))

    train_size = Column(Integer)
    test_size = Column(Integer)

    status = Column(String(50), default="Completed")
    
    created_at = Column(DateTime, server_default=func.now())

    model = relationship("TrainedModel")


class FeatureImportance(Base):
    __tablename__ = "feature_importance"

    feature_id = Column(Integer, primary_key=True, index=True)
    model_id = Column(Integer, ForeignKey("trained_models.model_id", ondelete="CASCADE"), nullable=False)
    feature_name = Column(String(255), nullable=False)
    importance_score = Column(Float)
    ranking = Column(Integer)

    model = relationship("TrainedModel")


class Prediction(Base):
    __tablename__ = "predictions"
    
    prediction_id = Column(Integer, primary_key=True, index=True)
    model_id = Column(Integer, ForeignKey("trained_models.model_id", ondelete="CASCADE"), nullable=False) 
    dataset_id = Column(Integer, ForeignKey("datasets.dataset_id", ondelete="CASCADE"), nullable=False)
    prediction_count = Column(Integer)
    prediction_file = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    model = relationship("TrainedModel")
    dataset = relationship("Dataset")

class Visualization(Base):
    __tablename__ = "visualizations"

    visualization_id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.project_id", ondelete="CASCADE"), nullable=False)
    chart_name = Column(String(255))
    chart_type = Column(String(255))

    image_path = Column(Text)

    created_at = Column(DateTime, server_default=func.now())

    project = relationship("Project")


class Report(Base):
    __tablename__ = "reports"

    report_id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.project_id", ondelete="CASCADE"), nullable=False)
    report_name = Column(String(255))
    report_path = Column(Text)

    created_at = Column(DateTime, server_default=func.now())

    project = relationship("Project")

class Experiment(Base):
    __tablename__ = "experiments"

    experiment_id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.project_id", ondelete="CASCADE"), nullable=False)
    experiment_name = Column(String(255))
    algorithm = Column(String(100))
    accuracy = Column(Numeric(5,2))
    status = Column(String(50), default="Completed")
    created_at = Column(DateTime, server_default=func.now())

    project = relationship("Project")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    activity_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    activity_type = Column(String(100))
    description = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User")

