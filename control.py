# encoding:utf-8
import os
import subprocess
import time
import datetime
import config
import requests
from config import *


def scriptlist(path="WMS"):
    scriptlist = os.listdir('./JmeterScript/%s'%path)
    return scriptlist


def run(script,path="WMS"):

    t = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
    filename = t + script
    subprocess.Popen(
        'jmeter -n -t ./JmeterScript/%s/%s.jmx -l ./report/%s.jtl' % (path,script, filename),
        shell=True)
    # subprocess.Popen(
    #     'jmeter -n -t ./JmeterScript/%s/%s -l ./report/%s.jtl -e -o ./report/%s' % (path, script, filename, filename),
    #     shell=True)
    # os.system(r'jmeter -n -t ./JmeterScript/%s/%s.jmx -l ./report/%s.jtl'% (path,script, filename))
    return "执行成功"

def scriptrun(script):
    sl = scriptlist('operationstar')
    for i in sl:
        print(i)
        print(script+".jmx")
        if script+".jmx" == i:
            run(script,'operationstar')
            print(i)
            return print('测试启动')


def create_testcase():
    pass

def create_task():
    pass

def changeconfig(username,warehouseID,memberID):
    sql1 = 'update auto_control set status=1 where userid = (select userid from auto_user where user = "%s")'%username
    sql2 = 'update auto_control set status=0 where warehousememberid = (select id from auto_warehouemember where warehouseID = %s and memberID=%s  limit 1)'%(warehouseID,memberID)

    cursor = con.cursor()
    cursor.execute(sql1)

    con.commit()
    cursor.execute(sql2)

    con.commit()
    cursor.close()



def createwarehouse(data={}):

    if len(data)>5:
        warehouseID = data['warehouseID']
        warehousename = data['warehousename']
        memberID = data['memberID']
        membername = data['membername']
        memberno = data['memberno']
        environment = data['environment']
        user = data['username']

        sql1 = " insert into auto_warehouemember values (%s,'%s',%s,'%s','%s',(select environmentid from auto_environment where environmentname = '%s' ),0)" % (
        warehouseID, warehousename, memberID, membername, memberno, environment)

        cursor = con.cursor()
        cursor.execute(sql1)

        con.commit()

        sql2 = "insert into auto_control VALUES((select id from auto_warehouemember where warehouseID=%s limit 1),1,0,(select userid from auto_user where user = '%s'))" % (
        warehouseID, user)
        # print(sql2)

        cursor.execute(sql2)
        con.commit()

        return '新增成功'
    else:
        return '数据不合法'


def showwarehouse():

    sql = """
    SELECT
	t.* 
FROM
	auto_warehouemember t
	JOIN auto_control t1 ON t.id = t1.warehousememberid
	JOIN auto_user t2 ON t1.userid = t2.userid 
WHERE
	t2.`user` = 'zoutao';
    """
    cursor = con.cursor()
    cursor.execute(sql)

    value = []
    data = cursor.fetchall()

    for i in data:
        sql1 = 'select environmentname from auto_environment where environmentid = %d'%i[5]
        cursor.execute(sql1)
        environmentname = cursor.fetchall()
        # print(environmentname[0][0])
        i = list(i)
        i[5] = environmentname[0][0]
        i[6] = 'zoutao'
        value.append(i)

    cursor.close()

    return value


def jtl():
    t = open('D:\\operations_test\\report\\20200512112720B2B入库.jmx.jtl','r',encoding='UTF-8')
    file = t.read()
    print(type(file))
    file = file.split('\n')
    key = file[0].split(',')
    del file[0]
    del file[-1]
    for i in range(len(file)):
        print(i)

    # a = []
    # for f in file:
    #     f = f.split(',')
    #     a.append(f)
    print(key,file)


def oplist():
    sql = "select * from auto_operation"
    cursor = con.cursor()
    cursor.execute(sql)

    value = []
    data = cursor.fetchall()
    cursor.close()

    return data

def operationstar(script):
    t = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
    filename = t + script
    subprocess.Popen(
        'jmeter -n -t ./JmeterScript/operationstar/%s.jmx -l ./report/%s.jtl' % (script, filename),
        shell=True)
    # os.system(r'jmeter -n -t ./JmeterScript/WMS/%s -l ./report/%s.jtl -e -o D:/autoAPI/testreport/html/%s' % (script, filename,filename))
    return "执行成功"

def currentwarehouse():
    sql = """
    SELECT
	t1.* 
FROM
	auto_warehouemember t1
	JOIN auto_control t2 ON t1.id = t2.warehousememberid 
WHERE
	t2.`status` = 0 limit 1;
    """
    cursor = con.cursor()
    cursor.execute(sql)


    data = cursor.fetchall()
    cursor.close()

    return data[0][1]+"-"+data[0][3]


def configlist():
    sql = """
        SELECT
    	* 
    FROM
    	auto_warehouemember ;
        """
    cursor = con.cursor()
    cursor.execute(sql)

    data = cursor.fetchall()
    cursor.close()
    value = ["warehouseID","warehousename","memberID","membername","memberno"]
    va = []
    for i in data:
        v = zip(value,i[:4])
        va.append(dict(v))

    dic = {'data':va}

    return dic


def saveorder(ordercode,scriptname,warehousememberid):
    try:
        sql = "insert into auto_ordermanage value(0,'%s','%s',%s,0)" % (ordercode, scriptname, warehousememberid)
        print(sql)
        cursor = con.cursor()
        cursor.execute(sql)
        con.commit()
        return print('新增成功')
    except BaseException:
        return print('新增失败')


def order(scriptname,orders):
    orderlist = orders.split(';')

    sql = """
        SELECT
    	t1.* 
    FROM
    	auto_warehouemember t1
    	JOIN auto_control t2 ON t1.id = t2.warehousememberid 
    WHERE
    	t2.`status` = 0 limit 1;
        """
    cursor = con.cursor()
    cursor.execute(sql)

    data = cursor.fetchall()
    cursor.close()
    warehousememberid = data[0][6]

    for i in orderlist:
        saveorder(i,scriptname,warehousememberid)

    return "单据新增成功"

def selectrun(script):
    sl = scriptlist('selectorder')
    for i in sl:
        print(i)
        print(script+".jmx")
        if script+".jmx" == i:
            run(script,'selectorder')
            print(i)
            return print('测试启动')


class dboperation():

    def __init__(self):
        self.connect = pymysql.connect(
            host='172.16.20.5',
            port=33306,
            user='testuser',
            password='123456',
            database='autotest'
        )

        self.cursor = self.connect.cursor()

    def over(self):
        self.cursor.close()
        self.connect.close()

class configmanage():

    def __init__(self):
        sql = """
            SELECT
        	t1.* 
        FROM
        	auto_warehouemember t1
        	JOIN auto_control t2 ON t1.id = t2.warehousememberid 
        WHERE
        	t2.`status` = 0 limit 1;
            """
        db = dboperation()
        db.cursor.execute(sql)
        data = db.cursor.fetchall()
        db.over()
        self.username= "zoutao"
        self.currentwarehouse = data[0]

    def insertconfig(self,data={}):
        if len(data) > 5:
            try:
                warehouseID = data['warehouseID']
                warehousename = data['warehousename']
                memberID = data['memberID']
                membername = data['membername']
                memberno = data['memberno']
                environment = data['environment']
                user = data['username']

                sql1 = " insert into auto_warehouemember values (%s,'%s',%s,'%s','%s',(select environmentid from auto_environment where environmentname = '%s' ),0)" % (
                    warehouseID, warehousename, memberID, membername, memberno, environment)
                db = dboperation()
                db.cursor.execute(sql1)
                db.connect.commit()

                sql2 = "insert into auto_control VALUES((select id from auto_warehouemember where warehouseID=%s and memberID=%s limit 1),1,0,(select userid from auto_user where user = '%s'))" % (
                    warehouseID,memberID, user)
                # print(sql2)

                db.cursor.execute(sql2)
                db.connect.commit()
                db.over()

                return '新增成功'

            except BaseException:

                return '请检查数据'
        else:
            return '数据不合法'

    def selectuser(self):
        pass

    def addpower(self):
        pass

    def changewarehouse(self,username,warehouseID, memberID):
        sql1 = 'update auto_control set status=1 where userid = (select userid from auto_user where user = "%s")' % username
        sql2 = 'update auto_control set status=0 where warehousememberid = (select id from auto_warehouemember where warehouseID = %s and memberID=%s  limit 1)' % (
        warehouseID, memberID)
        db = dboperation()
        db.cursor.execute(sql1)

        db.connect.commit()
        db.cursor.execute(sql2)

        db.connect.commit()
        db.over()
        return '切换成功'

    def showwarehouse(self):
        sql = """
            SELECT
        	t.* 
        FROM
        	auto_warehouemember t
        	JOIN auto_control t1 ON t.id = t1.warehousememberid
        	JOIN auto_user t2 ON t1.userid = t2.userid 
        WHERE
        	t2.`user` = 'zoutao';
            """

        db = dboperation()
        db.cursor.execute(sql)

        value = []
        data = db.cursor.fetchall()

        for i in data:
            sql1 = 'select environmentname from auto_environment where environmentid = %d' % i[5]
            db.cursor.execute(sql1)
            environmentname = db.cursor.fetchall()
            # print(environmentname[0][0])
            i = list(i)
            i[5] = environmentname[0][0]
            i[6] = 'zoutao'
            value.append(i)

        db.over()

        return value


class casemanage():
    def __init__(self):
        self.type = ''
        self.system = ''
        self.name = ''
        self.createby = ''
        self.detail = ''

    def createcase(self,**kwargs):
        self.type = kwargs['type']
        self.system = kwargs['system']
        self.name = kwargs['name']
        self.createby = kwargs['name']
        self.detail = kwargs['name']






if __name__ == '__main__':
    a = configmanage()
    # a.changewarehouse('zoutao',27794,27795)

    print(a.currentwarehouse[1]+"-")