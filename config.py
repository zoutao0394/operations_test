# encoding:utf-8
import pymysql
# import os



con = pymysql.connect(
    host='172.16.20.5',
    port=33306,
    user='testuser',
    password='123456',
    database='autotest'

)


# testmaster = pymysql.connect(
#     host='172.16.20.27',
#     port=3306,
#     user='WMS_Write',
#     password='UnipsWW@5771.com',
#     database='master_test'
#
# )
#
# uatmaster = pymysql.connect(
#     host='172.16.20.33',
#     port=3317,
#     user='WMS_Write',
#     password='Albo!@11.cM',
#     database='cmaster'
#
# )

# prdmaster = pymysql.connect(
#     host='192.168.4.100',
#     port=33066,
#     user='WMS_Read',
#     password='PS)*WR@62.cN',
#     database='fc_master'
#
# )


# route = ['分拣复核','包装称重','单SKU确认','团购确认','二次分拨','人工称重','F封箱质检','团购复核称重','B2B分拨']
#
# dblist = [testmaster,uatmaster,prdmaster]
# warehouseid = ['26519','23361','26769']
#
# systemname = ['WMS','PDA','BASIC','OMS','CMP','ERP','TMSV2','IMES','TOMS','IMES_STG']

# def geturl(dblist):
#     delete = "delete from auto_pageurl"
#     c = con.cursor()
#     c.execute(delete)
#     con.commit()
#     for sys in systemname:
#
#         sql = """
#            select CONCAT(t2.SiteUrl,t1.Url) as str ,t1.ModuleName from tm_master_sysmodule t1 JOIN tm_master_appinfo t2 on t1.APPID=t2.AppID where t1.SystemType='%s' and t1.Url IS NOT NULL AND `Level`=3;
#         """%sys
#
#         environmentid = 1
#         for db in dblist:
#
#
#             a = db.cursor()
#             a.execute(sql)
#             b = a.fetchall()
#             print(b)
#
#
#             for i in b:
#                 url = i[0]+'?systemCode=wms&moduleTitle='+i[1]
#                 print(url)
#                 if i[1] in route:
#                     url = i[0] + '?systemCode=wms&moduleTitle=' + i[1]+'&WarehouseID=%s'%warehouseid[environmentid-1]
#                 sql1 = "insert into auto_pageurl(url,environmentid,assert,systemname) values('%s',%s,'%s','%s')"%(url,environmentid,i[1],sys)
#
#                 c.execute(sql1)
#                 con.commit()
#             environmentid += 1
#
#         # con.close()
#         # testmaster.close()
#
#
#
# if __name__ == "__main__":
#     geturl(dblist)

