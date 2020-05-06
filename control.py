# encoding:utf-8
import os
import subprocess
import time
import datetime
import config
import requests
import pymysql

con = pymysql.connect(
    host='172.16.20.5',
    port=33306,
    user='testuser',
    password='123456',
    database='autotest'

)

conn = pymysql.connect(
    host='172.16.20.27',
    port=3316,
    user='WMS_Write',
    password='UnipsWW@5771.com',
    database='imlrequest'

)
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

def ana_report(filename):
    report = open('./static/%s.jtl'%filename,'r' ,encoding='UTF-8')

    n = 0
    for rpt in report:
        if 'false'  in rpt:
            n += 1
    if n > 0 :
        # payload = {'websiteName': 'wi', 'acrionType': '0'}
        # requests.post('http://211.95.87.221:1500/RelaseCommand',params = payload)
        return '{%s:测试失败}'%filename

    else:
        # requests.post('http://211.95.87.221:1500/RelaseCommand', data={'key': 'value'})
        return '{%s:测试成功}'%filename

def run(environment):
    reportlist = []
    for i in eval('config.%s'%environment):
        t = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
        filename = t + i
        sub = subprocess.Popen(
            'jmeter -Jpara1=1 -Jpara2=1 -n -t ./JmeterScript/%s.jmx -l ./report/%s.jtl -e -o ./report/%s' % (i, filename,filename),
            shell=True)
        reportlist.append(filename)
    return print(reportlist)

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

def changeconfig(username,warehousename):
    sql1 = 'update auto_control set status=1 where userid = (select userid from auto_user where user = "%s" )'%username
    sql2 = 'update auto_control set status=0 where warehousememberid = (select id from auto_warehouemember where warehousename = "%s" )'%warehousename

    cursor = con.cursor()
    cursor.execute(sql1)

    con.commit()
    cursor.execute(sql2)

    con.commit()
    cursor.close()



def createconfig(user,info):
    infolist = info.split(',')
    # print(infolist)
    # print(infolist[0],infolist[1],infolist[2],infolist[3],infolist[4],infolist[5])

    sql1 = " insert into auto_warehouemember values (%s,'%s',%s,'%s','%s',(select environmentid from auto_environment where environmentname = '%s' ),0)"%(infolist[0],infolist[1],infolist[2],infolist[3],infolist[4],infolist[5])

    cursor = con.cursor()
    cursor.execute(sql1)

    con.commit()

    sql2 = "insert into auto_control VALUES((select id from auto_warehouemember where warehouseID=%s limit 1),1,0,(select userid from auto_user where user = '%s'))"%(infolist[0],user)
    # print(sql2)


    cursor.execute(sql2)
    con.commit()

    return print('新增成功')








if __name__ == '__main__':
    # changeconfig('zoutao','新百伦测试仓1004')

    createconfig('25297,测试仓库1003,25307,测试会员1003,0010000217,测试环境')
    # cursor = con.cursor()
    # for i in a:
    #     for o in b:
    #         for p in c:
    #             sql = create_operation(i, o, p)
    #             cursor.execute(sql)
    # con.commit()
    # cursor.close()
    # con.close()



    # run('wi')
#     # # ana_report()
#
#     payload = {'websiteName': 'wi', 'acrionType': '0'}
#     requests.get('http://211.95.87.221:1500/RelaseCommand', params=payload)