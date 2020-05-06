#encoding:utf-8
from flask_sqlalchemy import SQLAlchemy

class Config(object):
    SQLALCHEMY_DATABASE_URI = 'mysql://testuser:a123456@172.16.20.5:33306/toutiao'
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # 在Flask中是否追踪数据修改
    SQLALCHEMY_ECHO = False  # 显示生成的sql语句