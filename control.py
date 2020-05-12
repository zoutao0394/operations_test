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




def run(script):

    t = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
    filename = t + script
    subprocess.Popen(
        'jmeter -n -t ./JmeterScript/WMS/%s -l ./report/%s.jtl -e -o ./report/%s' % (script, filename,filename),
        shell=True)
    # os.system(r'jmeter -n -t ./JmeterScript/WMS/%s -l ./report/%s.jtl -e -o D:/autoAPI/testreport/html/%s' % (script, filename,filename))
    return "执行成功"





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



def reportdetail():
    print(os.listdir("./report"))






if __name__ == '__main__':
    reportdetail()

