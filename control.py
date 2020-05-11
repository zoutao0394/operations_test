# encoding:utf-8
import os
import subprocess
import time
import datetime
import config
import requests
from config import *



# cursor = con.cursor()
#
# sql = "select operations from auto_testcase"
# cursor.execute(sql)
#
# result = cursor.fetchall()
# for i in result:
#     print(i[0])
#     j=i[0].split(',')
#     print(j)
#     for u in j:
#         print(u)
# print(result)


def run(path):
    reportlist = []
    tasklist = os.listdir('./JmeterScript/%s'%path)
    for i in tasklist:
        t = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
        filename = t + i
        # subprocess.Popen(
        #     'jmeter -n -t ./JmeterScript/WMS/%s -l ./report/%s.jtl -e -o D:/autoAPI/testreport/html/%s' % (i, filename,filename),
        #     shell=True)
        os.system(r'jmeter -n -t ./JmeterScript/WMS/%s -l ./report/%s.jtl -e -o D:/autoAPI/testreport/html/%s' % (i, filename,filename))
        reportlist.append(filename)
    return reportlist

def select_environment(environment):
    if environment == 'test':
        sqlscript('test')
        return '环境切换成功'
    elif environment == 'uat':
        sqlscript('uat')
        return '环境切换成功'
    elif environment == 'prd':
        sqlscript('prd')
        return '环境切换成功'
    else:
        return '可选环境（test，uat，prd）'


date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def sqlscript(env):

    cursor = conn.cursor()
    sql1 = """
    update test_commodity set status=0 where environment="%s";
    """%env
    sql2 = """
       update test_pageurl set status=0 where environment="%s";
       """ % env
    sql3 = """
       update test_url set status=0 where environment="%s";
       """ % env
    sql4 = """
       update test_config set status=0 where environment="%s";
       """ % env
    sql5 = """
       update test_commodity set status=1 where environment<>"%s";
       """ % env
    sql6 = """
       update test_pageurl set status=1 where environment<>"%s";
       """ % env
    sql7 = """
       update test_url set status=1 where environment<>"%s";
       """ % env
    sql8 = """
       update test_config set status=1 where environment<>"%s";
       """ % env
    try:
        cursor.execute(sql1)
        cursor.execute(sql2)
        cursor.execute(sql3)
        cursor.execute(sql4)
        cursor.execute(sql5)
        cursor.execute(sql6)
        cursor.execute(sql7)
        cursor.execute(sql8)
    except Exception as e:
        conn.rollback()  # 事务回滚
        print('%s环境切换失败'%env)
    else:
        conn.commit()  # 事务提交
        print('%s环境切换成功'%env)

    cursor.close()
    conn.close()

def create_operation(system,site,operation):

    sql = "insert into auto_operation values(0,\"%s\",\"%s\",\"%s\",\"%s\");"%(system,site,operation,date)
    return sql


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



def createconfig(data={}):
    # infolist = info.split(',')
    # print(infolist)
    # print(infolist[0],infolist[1],infolist[2],infolist[3],infolist[4],infolist[5])

    if len(data)>5:
        warehouseID = data['warehouseID']
        warehousename = data['warehousename']
        memberID = data['memberID']
        membername = data['membername']
        memberno = data['memberno']
        sex = data['sex']
        user = data['user']

        sql1 = " insert into auto_warehouemember values (%s,'%s',%s,'%s','%s',(select environmentid from auto_environment where environmentname = '%s' ),0)" % (
        warehouseID, warehousename, memberID, membername, memberno, sex)

        cursor = con.cursor()
        cursor.execute(sql1)

        con.commit()

        sql2 = "insert into auto_control VALUES((select id from auto_warehouemember where warehouseID=%s limit 1),1,0,(select userid from auto_user where user = '%s'))" % (
        warehouseID, user)
        # print(sql2)

        cursor.execute(sql2)
        con.commit()

        return print('新增成功')


def showwarehouse():

    sql = 'select * from auto_warehouemember'
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
        value.append(i[:-1])

    return value









if __name__ == '__main__':

    # changeconfig('zoutao','新百伦测试仓1004')

    # createconfig('zoutao','25277,测试仓库0001,25278,测试会员0001,0010000211,测试环境')

    # changeconfig('zoutao','自动化测试专用仓')


    # createconfig('zoutao','25277,测试仓库0001,25278,测试会员0001,0010000211,测试环境')

<<<<<<< HEAD


    run('WMS')

=======
    # run('WMS')
    showwarehouse()
>>>>>>> 9c5762859901d1287fdebc30a98e5c310ff0ff8c
