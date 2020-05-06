# encoding:utf-8

from config import *

class TestTask():
    def __init__(self,name):
        self.cursor = con.cursor()
        self.name = name

    def select(self):
        pass

    def create(self):
        try:
            sql = "insert into auto_testtask VALUES (0,'%s',0,NOW(),1)" % (self.name)
            self.cursor.execute(sql)
            con.commit()
        except BaseException:
            return print('不能重复创建')


    def updatetask(self):
        pass

    def deletetask(self):
        pass

    def run(self):
        pass

    def taskover(self):
        self.cursor.close()


class TestCase():

    def __init__(self,name):
        self.cursor = con.cursor()
        self.name = name

    def create(self):
        try:
            sql = "insert into auto_testtask VALUES (0,'%s',0,NOW(),1)" % (self.name)
            self.cursor.execute(sql)
            con.commit()
        except BaseException:
            return print('不能重复创建')

    def delete(self):
        pass

    def update(self):
        pass

    def select(self):
        pass


class Script():

    def __init__(self,system,name):
        self.cursor = con.cursor()
        self.name = name
        self.system = system

    def create(self):
        try:
            sql = "insert into auto_script VALUES (0,'%s',(select systemid from auto_system where systemname = '%s' ))" % (self.name,self.system)
            self.cursor.execute(sql)
            con.commit()
        except BaseException:
            return print('不能重复创建')

    def delete(self):
        pass

    def update(self):
        pass

    def select(self):
        pass










if __name__ == '__main__':

    testtask = TestTask('入库流程检查')
    testtask.create()
    testtask.taskover()