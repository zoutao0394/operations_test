import pymysql
from control import *

class TestTask():
    def __init__(self,name,caselist=[]):

        cursor = con.cursor()
        self.name = name
        self.caselist = caselist
        self.id = cursor.execute('select id from  ')











class TaskManage():
    pass