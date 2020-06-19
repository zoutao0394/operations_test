# encoding:utf-8
import os
import subprocess
import time
import datetime
import json
import csv
from config import *
import math
# from win32com.client import Dispatch, constants, gencache, DispatchEx
import xlrd



# import win32com
import win32com.client









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
    return "开始执行"

def scriptrun(script):
    sl = scriptlist('operationstar')
    for i in sl:
        # print(i)
        # print(script+".jmx")
        if script+".jmx" == i:
            run(script,'operationstar')
            print(i)
            return print('测试启动')


def changeconfig(username,warehouseID,memberID):
    sql1 = 'update auto_control set status=1 where userid = (select userid from auto_user where user = "%s")'%username
    sql2 = 'update auto_control set status=0 where warehousememberid = (select id from auto_warehouemember where warehouseID = %s and memberID=%s  limit 1)'%(warehouseID,memberID)

    cursor = con.cursor()
    cursor.execute(sql1)

    con.commit()
    cursor.execute(sql2)

    con.commit()
    cursor.close()



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
        d = ((b - 1) * display, display)
    elif b == c:
        d = ((b - 1) * display,a)

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
            # i[6] = 'zoutao'
            value.append(i)

        db.over()

        return value


class casemanage():

    def __init__(self):
        self.type = ''
        self.system = ''
        self.casetitle = ''
        self.createby = ''
        # self.detail = ''
        self.process = ''

    # def downloadcase(self):
    #     return "D:\\operations_test\\static\\testcase\\casetemplate\\测试用例模板.xls"



    def createcase(self,**kwargs):
        if self.type=='':
            try:
                self.type = kwargs["data"]['type']
                self.system = kwargs["data"]['system']
                self.casetitle = kwargs["data"]['casetitle']
                self.createby = kwargs["data"]['createby']
                # self.detail = kwargs["data"]['detail']
                self.process = kwargs["data"]['process']
                # print(type(self.type))
                sql = "insert into auto_testcase(caseid,`system`,type,casetitle,process,createby,createdate,`status`) values(0,'%s','%s','%s','%s','%s',now(),0)" % (
                self.system, self.type, self.casetitle, self.process, self.createby)
                # print(sql)
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
        count = "select count(1) from auto_testcase where `system`='%s' and type= '%s';" % (system, casetype)
        db = dboperation()
        db.cursor.execute(count)
        count = db.cursor.fetchall()
        if count[0][0]>=1:
            page = paginate(display=display, num=count[0][0], current_page=current_page)

# print(type(count[0][0]))

            sql = """
                                                                SELECT
                                            t1.caseid,
                                            t1.system,
                                            t2.casetype,
                                            t1.casetitle,
                                            t1.process,
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

                                                                         """ % (
            system, casetype, page[0][0], page[0][1])

            # print(sql)
            db.cursor.execute(sql)
            data = db.cursor.fetchall()
            db.over()
            table = ''
            for i in data:
            # count += 1
                table += '<tr onclick="checkTr(this);">'
                table += '<td><input type="checkbox" name="selectcase" value=%s onclick="checkInput(this);"></td>' % i[0]
                for j in i:
                    j = str(j)
                    td = '<td>' + j + '</td>'
                    table += td

                table += '</tr>'

            result = {"detail": table, "count": count[0][0], "maxpage": page[1]}
        else:
            return {"detail":'<h1>没有数据</h1>'}

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
        db.over()
        # print(result)
        return result

    def caseintegrate(self,file):
        filename = file.split('.')
        sql = 'select count(1) from auto_testcase where casetitle="%s"'%filename[0]
        db = dboperation()
        db.cursor.execute(sql)
        data = db.cursor.fetchall()
        if data[0][0] == 0:
            db.over()
            return False
        else:
            sql = 'select `status`,caseid,type from auto_testcase where casetitle="%s"'%filename[0]
            # print(sql)
            db = dboperation()
            db.cursor.execute(sql)
            case = db.cursor.fetchall()

            if case[0][0] == "1":
                db.over()
                return True
            else:
                if case[0][2] == "1":
                    path = './JmeterScript/testcase'
                else:
                    path = './static/testcase/casetemplate'
                sql1 = 'update auto_testcase set `status` = 1 where casetitle="%s"'%filename[0]
                sql2 = 'insert into auto_casefile(caseid,filename,path) value(%s,"%s","%s")' % (case[0][1],file,path)

                gettaskid = """
                        select taskid from auto_taskprocess where process = (select process from auto_testcase where caseid = %s)
                    and systemname = (select `system` from auto_testcase where caseid= %s)
                """%(case[0][1],case[0][1])
                db.cursor.execute(gettaskid)

                taskids = db.cursor.fetchall()

                for taskid in taskids:
                    insert = """
                        insert into auto_taskcase(taskid,caseid,status) values(%s,%s,0)
                    """%(taskid[0],case[0][1])
                    print(insert)
                    db.cursor.execute(insert)
                    db.connect.commit()


                # db = dboperation()
                db.cursor.execute(sql1)
                db.cursor.execute(sql2)
                db.connect.commit()
                db.over()

                return True


    def casepath(self,caseid):
        db = dboperation()
        sql = "select `status` from auto_testcase where caseid = %s"%caseid
        db.cursor.execute(sql)
        status = db.cursor.fetchall()
        # print(sql)


        if status[0][0]=="0":

            return '用例没有集成'
        else:
            sql = "select filename,path from auto_casefile where caseid=%s" % caseid

            db.cursor.execute(sql)
            data = db.cursor.fetchall()
            # print(data[0])
            return data[0]



    # def



class taskmanage():
    def __init__(self):
        self.task = {}



    # 创建测试接口自动化测试任务
    def createtask(self,taskname,startmode,taskgroup,caseids=[],groupname=''):
        en = taskname.split('-')
        if 'UAT'in en[0]:
            environmentid = 2
            configid = 3
        elif 'PRD'in en[0]:
            environmentid = 3
            configid = 2
        else:
            environmentid = 1
            configid = 1

        systemname = en[1]
        if systemname not in ['WMS','OMS','ERP','TMS','IMES']:
            return '任务名不合法：格式 环境-系统-任务名'

        if taskgroup == '1':
            caseids = json.loads(caseids)
            if caseids == []:
                return '请关联测试用例'
            else:
                sql1 = "select count(1) from auto_task where taskname='%s' and startmode='%s'" % (taskname, startmode)
                db = dboperation()
                db.cursor.execute(sql1)
                data = db.cursor.fetchall()

                if data[0][0] == 0:
                    sql2 = "insert into auto_task(taskid,taskname,startmode,status,createdate,createby,environmentid,configid,taskgroup) values(0,'%s','%s',0,now(),1,%s,%s,1)" % (
                    taskname, startmode, environmentid, configid)
                    # print(sql2)

                    db.cursor.execute(sql2)
                    db.connect.commit()
                    # time.sleep(0.1)
                    for i in caseids:
                        # print(taskname)
                        sql3 = "insert into auto_taskcase(taskid,caseid,status) value((select taskid from auto_task where taskname = '%s'),%s,0)" % (
                        taskname, i)
                        # print(sql3)
                        db.cursor.execute(sql3)
                        db.connect.commit()
                    db.over()
                    return '创建成功'
                else:
                    db.over()
                    return '任务已存在'

        elif taskgroup == '2':
            groupname = groupname.split(';')

            db = dboperation()
            for i in groupname:
                sql = 'select count(1) from auto_testcase where process="%s"'%i
                db.cursor.execute(sql)
                c = db.cursor.fetchall()
                if c[0][0] == 0:
                    db.over()
                    return '没有%s流程'%i

            sql1 = "select count(1) from auto_task where taskname='%s' and startmode='%s'" % (taskname, startmode)
            # db = dboperation()
            db.cursor.execute(sql1)
            data = db.cursor.fetchall()

            if data[0][0] == 0:
                sql2 = "insert into auto_task(taskid,taskname,startmode,status,createdate,createby,environmentid,configid,taskgroup) values(0,'%s','%s',0,now(),1,%s,%s,2)" % (
                    taskname, startmode, environmentid, configid)
                # print(sql2)

                db.cursor.execute(sql2)
                db.connect.commit()
                # time.sleep(0.1)
                for process in groupname:
                    print(process)
                    sql3 = "insert into auto_taskprocess(taskid,process,systemname) value((select taskid from auto_task where taskname = '%s'),'%s','%s')" % (
                        taskname,process,systemname)
                    print(sql3)
                    db.cursor.execute(sql3)
                    db.connect.commit()

                    getcaseid = """
                        select caseid from auto_testcase where `system` = '%s' and process = '%s' and type='1' and status='1'
                    """%(systemname,process)
                    print(getcaseid)
                    db.cursor.execute(getcaseid)
                    caseid = db.cursor.fetchall()
                    for case in caseid:
                        createprocess = """
                            insert into auto_taskcase(taskid,caseid,status) values((select taskid from auto_task where taskname = '%s'),%s,0)
                        """%(taskname,case[0])
                        print(createprocess)
                        db.cursor.execute(createprocess)
                        db.connect.commit()

                db.over()
                return '创建成功'
            else:
                db.over()
                return '任务已存在'








        else:
            return '功能开发中'




    # 展示任务列表
    def selecttask(self):
        sql1 = 'select count(1) from auto_task'
        db = dboperation()
        db.cursor.execute(sql1)
        data = db.cursor.fetchall()
        if data[0][0]>0:
            sql2 = "select t1.taskid,taskname,startmode,t2.`name`,t1.runtime from auto_task t1 JOIN auto_taskstatus t2 on t1.`status`=t2.`status`"
            db = dboperation()
            db.cursor.execute(sql2)
            value = db.cursor.fetchall()
            col = db.cursor.description
            key = []
            for i in col:
                key.append(i[0])
            db.over()
            # print(value)
            return value,key
        else:
            db.over()
            return '没有数据'



    # 创建任务的用例列表
    def taskcasedetail(self):

        sql1 = 'select count(1) from auto_testcase where type=1 and status=1'
        db = dboperation()
        db.cursor.execute(sql1)
        data = db.cursor.fetchall()
        if data[0][0] > 0:
            sql2 = 'select caseid,`system`,process,casetitle from auto_testcase where type=1 and status=1'
            db = dboperation()
            db.cursor.execute(sql2)
            value = db.cursor.fetchall()
            col = db.cursor.description
            key = []
            for i in col:
                key.append(i[0])
            db.over()
            return value, key
        else:
            db.over()
            return '没有数据'


    # 测试任务详情关联的测试用例
    def taskcase(self,taskid=''):
        sql = """
                SELECT
        	caseid,
        	`system`,
        	process,
        	casetitle 
        FROM
        	auto_testcase 
        WHERE
        	caseid IN ( SELECT caseid FROM auto_taskcase WHERE taskid = %s)
            """%taskid

        db = dboperation()
        db.cursor.execute(sql)
        value = db.cursor.fetchall()
        col = db.cursor.description
        key = []
        for i in col:
            key.append(i[0])
        db.over()
        return value, key

    # 拼装数据返回给浏览器
    def show(self,function,*args,**kwargs):
        value = function(*args,**kwargs)
        if value != '没有数据':
            key = value[1]
            jsonArray = []

            for i in value[0]:
                n = 0
                json = {}
                for j in i:
                    j = str(j)
                    json[key[n]] = j
                    n += 1

                jsonArray.append(json)

            return {'data': jsonArray}

    # 获取待执行的脚本列表，标记任务状态
    def taskscript(self,taskid):
        db = dboperation()
        taskstatus = """
            select status from auto_task where taskid=%s
        """%taskid
        db.cursor.execute(taskstatus)
        taskstatus = db.cursor.fetchall()
        # print(taskid)
        if taskstatus[0][0]!= 1:


            sql = """
                                    SELECT
                                casetitle ,
                                caseid
                            FROM
                                auto_testcase 
                            WHERE
                                caseid IN ( SELECT caseid FROM auto_taskcase WHERE taskid = %s )
                                """ % taskid  # 获取脚本和用例ID
            sql1 = """
                            update auto_taskcase set `status`=0 where taskid= %s
                    """ % taskid  # 初始化脚本状态
            sql2 = """
                                    update auto_task set `status`=1 ,runtime= now() where taskid = %s
                            """ % taskid  # 初始化任务状态
            sql0 = """
                                        update auto_taskreport set status=1 where taskid=%s
                                    """ % (taskid)  # 变更以前的任务执行报告

            db.cursor.execute(sql)
            value = db.cursor.fetchall()
            db.cursor.execute(sql0)
            db.cursor.execute(sql1)
            db.cursor.execute(sql2)
            db.connect.commit()
            scriptlist = []

            for i in value:
                scriptlist.append(i)

            db.over()
            return scriptlist
            # elif taskgroup[0][0]==2:
            #     sql = """
            #                                             SELECT
            #                                         casetitle ,
            #                                             caseid
            #                                     FROM
            #                                         auto_testcase
            #                                     WHERE
            #                                         caseid in (select caseid from auto_taskprocesscase where taskid = %s)
            #                                         """ % taskid  # 获取脚本和用例ID
            #     sql1 = """
            #                                     update auto_taskprocesscase set `status`=0 where taskid= %s
            #                             """ % taskid  # 初始化脚本状态
            #     sql2 = """
            #                                             update auto_task set `status`=1 ,runtime= now() where taskid = %s
            #                                     """ % taskid  # 初始化任务状态
            #     sql0 = """
            #                                                 update auto_taskreport set status=1 where taskid=%s
            #                                             """ % (taskid)  # 变更以前的任务执行报告
            #
            #     db.cursor.execute(sql)
            #     value = db.cursor.fetchall()
            #     db.cursor.execute(sql0)
            #     db.cursor.execute(sql1)
            #     db.cursor.execute(sql2)
            #     db.connect.commit()
            #     scriptlist = []
            #
            #     for i in value:
            #         scriptlist.append(i)
            #
            #     db.over()
            #     return scriptlist

        else:
            db.over()
            return '当前任务执行中'


    def getconfig(self,taskid):
        sql = "select environmentid,configid from auto_task where taskid=%s"%taskid
        # print(sql)
        db = dboperation()
        db.cursor.execute(sql)
        value = db.cursor.fetchall()
        db.over()
        return value[0]



    # 运行任务内的脚本
    def starttask(self,taskid):
        scriptlist = self.taskscript(taskid)
        if scriptlist == '当前任务执行中':
            return '当前任务执行中'
        else:
            try:
                if len(scriptlist) >= 1:
                    db = dboperation()
                    config = self.getconfig(taskid)

                    # print(scriptlist, taskid)
                    startcount ="""
                        select count(caseid) from auto_taskcase where taskid=%s and status=1;
                    """%taskid
                    # print(startcount)
                    for script in scriptlist:
                        db.cursor.execute(startcount)
                        count = db.cursor.fetchall()

                        while count[0][0] > 1:
                            time.sleep(2)
                            db.cursor.execute(startcount)
                            count = db.cursor.fetchall()
                            db.connect.commit()


                        t = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
                        filename = t + script[0]
                        subprocess.Popen(
                            'jmeter -Jtaskid=%s -Jcaseid=%s -Jenvironmentid=%s -Jconfig=%s -n -t ./JmeterScript/testcase/%s.jmx -l ./static/report/%s.jtl' % (
                            taskid, script[1], config[0], config[1], script[0], filename),
                            shell=True)
                        # time.sleep(1)

                        start = """
                            update auto_taskcase set `status`=1 where taskid=%s and caseid=%s;
                        """%(taskid, script[1])

                        # time.sleep(5)
                        sql = """
                            insert into auto_report(reportname,url) VALUES('%s','./static/report/%s.csv')
                        """ % (filename, filename)

                        sql1 = """
                            insert into auto_taskreport(taskid,reportid,status) VALUES(%s,(select reportid from auto_report where reportname='%s' limit 1),0)
                        """ % (taskid, filename)



                        db.cursor.execute(sql)
                        db.cursor.execute(start)
                        db.connect.commit()
                        db.cursor.execute(sql1)
                        db.connect.commit()
                        db.cursor.execute(startcount)
                        count = db.cursor.fetchall()

                    db.over()

                    return "开始执行"
                else:
                    return '没有待执行脚本，请检查任务详情！'
            except BaseException:
                sql = """
                                        update auto_task set `status`=1 ,runtime= now() where taskid = %s
                                """ % taskid  # 标记任务执行失败
                db = dboperation()
                db.cursor.execute(sql)
                db.connect.commit()
                db.over()
                return '任务执行失败'




#

#
# from apscheduler.schedulers.blocking import BlockingScheduler
# def testcase():
#     print(time.time())

class report():
    def __init__(self,taskid=0,systemname='WMS'):
        self.taskid = taskid
        self.systemname = systemname


    def formatfile(self):
        files = os.listdir('./static/report/')
        reportlist = self.taskreportdetail()
        # print(files)
        for filename in files:
            # if filename in reportlist:
            portion = os.path.splitext(filename)  # 分离文件名与扩展名
            name = portion[0] + '.csv'
            # 如果后缀是jpg
            if portion[1] == '.jtl' and name in reportlist:
                # 重新组合文件名和后缀名
                newname = name
                os.rename('./static/report/%s'%filename, './static/report/%s'%newname)
            # if portion[0][]

        filelist = reportlist
        return filelist

    def taskreportdetail(self):
        sql = """
            select reportname from auto_report where reportid in (select reportid from auto_taskreport where taskid=%s and status=0)
        """%self.taskid
        db = dboperation()
        db.cursor.execute(sql)
        value = db.cursor.fetchall()
        filelist = []
        for file in value:
            filelist.append(file[0]+'.csv')
        return filelist


    def report(self):
        filelist = self.formatfile()
        # filelist = self.taskreportdetail()
        rows = []
        # print(set(reportlist)>set(filelist))
        # if set(reportlist)>set(filelist):
        for filename in filelist:
            with open(r'./static/report/%s'%filename, 'r',encoding='UTF-8') as f:
                data = csv.reader(f)
                a = next(data)

                for i in data:
                    n=0
                    json = {}
                    for j in i:
                        json[a[n]] = j
                        n += 1
                    json['true']=0
                    json['false'] = 0
                    json['samples']=0
                    if json['URL']=='null':
                        continue
                        # pass
                    elif json['success']=='true':
                        json['true'] +=1
                        json['samples']+=1
                    else:
                        json['false'] += 1
                        json['samples']+=1

                    m = 0
                    for k in rows:
                        if json['label'] == k['label'] and json['threadName'] == k['threadName']:
                            k['false'] += json['false']
                            k['true'] += json['true']
                            k['samples'] += json['samples']
                            if json['failureMessage'] not in k['failureMessage']:
                                k['failureMessage'] += json['failureMessage']
                            m = 1
                            continue

                    if m == 1:
                        continue

                    # print(len(rows))
                    # print(m)
                    rows.append(json)

        return rows

    def reporthtml(self):
        rows = self.report()
        html = ''
        for data in rows:
            tr = ''
            if data['false']>0:
                tr += "<tr bgcolor='red'>"
                tr += "<td>" + data['threadName'] + "</td>"
                tr += "<td>" + data['label'] + "</td>"
                tr += "<td>" + str(data['samples']) + "</td>"
                tr += "<td>" + str(data['true']) + "</td>"
                tr += "<td>" + str(data['false']) + "</td>"
                tr += "<td>" + data['URL'] + "</td>"
                tr += "<td>" + data['failureMessage'] + "</td>"
                tr += "</tr>"
            else:
                tr += "<tr>"
                tr += "<td>" + data['threadName'] + "</td>"
                tr += "<td>" + data['label'] + "</td>"
                tr += "<td>" + str(data['samples']) + "</td>"
                tr += "<td>" + str(data['true']) + "</td>"
                tr += "<td>" + str(data['false']) + "</td>"
                tr += "<td>" + data['URL'] + "</td>"
                tr += "<td>" + data['failureMessage'] + "</td>"
                tr += "</tr>"

            # print(tr)
            html += tr
        return html


    def show(self, function, *args, **kwargs):
        value = function(*args, **kwargs)
        if value != '没有数据':
            key = value[1]
            jsonArray = []

            for i in value[0]:
                n = 0
                json = {}
                for j in i:
                    # print(j)
                    j = str(j)
                    json[key[n]] = j
                    n += 1

                jsonArray.append(json)

            return {'data': jsonArray}


    def savereport(self,reportname):
        db = dboperation()
        detail = reportname.split('-')
        if len(detail)<2 or len(detail)>2:
            return False
        system = detail[0]
        name = detail[1]
        name = name.split('.')[0]
        sql0 = "select count(1) from auto_report where url='./static/report/testreport/%s'"%reportname
        db.cursor.execute(sql0)
        count = db.cursor.fetchall()

        if count[0][0]<1:
            sql = "insert into auto_report(reportname,url,systemname,createdate) values('%s','./static/report/testreport/%s','%s',now())"%(name,reportname,system)

            db.cursor.execute(sql)
            db.connect.commit()
        db.over()

        return True

    def reportlist(self):
        # sql = "select * from auto_report where systemname='%s';"%self.systemname
        sql1 = "select count(1) from auto_report where systemname='%s';"%self.systemname
        db = dboperation()
        db.cursor.execute(sql1)
        data = db.cursor.fetchall()
        if data[0][0]>0:
            sql2 = "select reportid,reportname,systemname,createdate from auto_report where systemname='%s';"%self.systemname
            db = dboperation()
            db.cursor.execute(sql2)
            value = db.cursor.fetchall()
            col = db.cursor.description
            key = []
            for i in col:
                key.append(i[0])
            db.over()
            # print(value)
            return value,key
        else:
            db.over()
            return '没有数据'


    def reportpath(self,reportid):
        db = dboperation()
        sql = "select url from auto_report where reportid=%s" % reportid
        db.cursor.execute(sql)
        data = db.cursor.fetchall()[0][0]
        reportname = data[27:]
        # print(data[0])
        return reportname


    def deletereport(self,reportid):
        sql = 'delete from auto_report where reportid=%s'%reportid

        db=dboperation()
        db.cursor.execute(sql)
        db.connect.commit()
        db.over()
        return '删除成功'









if __name__ == '__main__':
    a = configmanage()
    b = a.showwarehouse()
    # b = a.show(a.reportlist)
    print(b)