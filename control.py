# encoding:utf-8
import os
import subprocess
import time
import datetime
import config
import requests
from config import *
import math



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

    db = dboperation()
    db.cursor.execute(sql)

    # value = []
    data = db.cursor.fetchall()
    db.over()

    return data

def operationstar(script):
    t = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
    filename = t + script
    subprocess.Popen(
        'jmeter -n -t ./JmeterScript/operationstar/%s.jmx -l ./report/%s.jtl' % (script, filename),
        shell=True)
    # os.system(r'jmeter -n -t ./JmeterScript/WMS/%s -l ./report/%s.jtl -e -o D:/autoAPI/testreport/html/%s' % (script, filename,filename))
    return "执行成功"



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


def paginate(display=20,**kwargs):
    a = kwargs['num']
    b = kwargs['current_page']
    c = math.ceil(a / display)
    if b < c:
        d = ((b - 1) * display + 1, b * display)
    elif b == c:
        d = ((b - 1) * display + 1,a)

    else:
        return '最大页数%d页'%c

    return d,c




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
        self.casetitle = ''
        self.createby = ''
        self.detail = ''

    def createcase(self,**kwargs):
        if self.type=='':
            try:
                self.type = kwargs["data"]['type']
                self.system = kwargs["data"]['system']
                self.casetitle = kwargs["data"]['casetitle']
                self.createby = kwargs["data"]['createby']
                self.detail = kwargs["data"]['detail']
                print(type(self.type))
                sql = "insert into auto_testcase values(0,'%s','%s','%s','%s','%s',now(),0)" % (
                self.system, self.type, self.casetitle, self.detail, self.createby)
                print(sql)
                db = dboperation()
                db.cursor.execute(sql)
                db.connect.commit()
                db.over()
                return '创建成功'
            except BaseException:
                return '创建失败'

        else:
            return '用例已存在'

    def showcase(self,display=20,current_page=1,casetype=1,system='WMS'):
        count = "select count(1) from auto_testcase where `system`='%s' and type= '%s';"%(system,casetype)
        print(count)
        db = dboperation()
        db.cursor.execute(count)
        count = db.cursor.fetchall()
        print(type(count[0][0]))
        print(type(current_page))
        page = paginate(display=display, num=count[0][0], current_page=current_page)
        # print(type(count[0][0]))

        sql = """
                                         SELECT
                   	t1.caseid,
                   	t1.system,
                   	t2.casetype,
                   	t1.casetitle,
                   	t1.detail,
                   	t3.`user`,
                   	t1.createdate,
                   	t4.casestatus 
                   FROM
                   	auto_testcase t1
                   	LEFT JOIN auto_casetype t2 ON t1.type = t2.type
                   	LEFT JOIN auto_user t3 ON t1.createby = t3.userid
                   	LEFT JOIN auto_casestatus t4 ON t1.`status` = t4.`status`
                   WHERE
                   	t1.system = '%s'
                   	AND t1.type= %s
                   LIMIT
                       %d,%d

                                                  """ % (system, casetype, page[0][0], page[0][1])

        # print(sql)
        db.cursor.execute(sql)
        data = db.cursor.fetchall()
        db.over()
        table = ''
        for i in data:
            # count += 1
            table += '<tr>'
            table += '<td><input type="checkbox" name="selectcase" value=%s></td>' % i[0]
            for j in i:
                j = str(j)
                td = '<td>' + j + '</td>'
                table += td

            table += '</tr>'

        result = {"detail": table, "count": count[0][0], "maxpage": page[1]}

        return result







    def selectsystem(self):
        sql="select systemname from auto_system;"

        db = dboperation()
        db.cursor.execute(sql)

        data = db.cursor.fetchall()
        db.over()

        table = ''
        for i in data:
            table += '<option value="%s">%s</option>'%(i[0],i[0])

        return table

    def selectcasetype(self):
        sql="select * from auto_casetype;"

        db = dboperation()
        db.cursor.execute(sql)

        data = db.cursor.fetchall()
        db.over()

        table = ''
        for i in data:
            table += '<option value="%s">%s</option>'%(i[1],i[0])

        return table

    def deletecase(self,id):
        sql = 'delete from auto_testcase where caseid=%s'%id

        db=dboperation()
        db.cursor.execute(sql)
        db.connect.commit()
        db.over()
        return '删除成功'

    def testcase(self):
        sql = """
SELECT
    t1.caseid,
    t1.system,
    t2.casetype,
    t1.casetitle,
    t1.detail,
    t3.`user`,
    t1.createdate,
    t4.casestatus 
FROM
    auto_testcase t1
    LEFT JOIN auto_casetype t2 ON t1.type = t2.type
    LEFT JOIN auto_user t3 ON t1.createby = t3.userid
    LEFT JOIN auto_casestatus t4 ON t1.`status` = t4.`status`;

        """
        db = dboperation()
        db.cursor.execute(sql)
        data = db.cursor.fetchall()
        # db.over()
        col = db.cursor.description

        jsonArray =[]
        result = {}
        for i in data:
            json = {}
            index = 0
            for j in i:
                json[col[index][0]]=j
                index += 1

            jsonArray.append(json)
        # print(col)
        result["data"]=jsonArray
        # print(result)
        return result





        # return




def testdict(**kw):
    print(kw['data']['system'])
    print(kw)


if __name__ == '__main__':
    # a = configmanage()
    # a.changewarehouse('zoutao',27794,27795)

    # print(a.currentwarehouse[1]+"-")
    #
    a = casemanage()
    # # # a.selectcasetype()
    # # # testdict(data ={'system': 'WMS', 'type': '1', 'casetitle': 'sadf', 'casedetail': 'asdf'})
    b = a.showcase(display=20,current_page=1,system='TOMS')
    print(b)
    # a = paginate(90,num=87,current_page=1)
    # print(str(a))

