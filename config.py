# encoding:utf-8
import pymysql
import os



con = pymysql.connect(
    host='172.16.20.5',
    port=33306,
    user='testuser',
    password='123456',
    database='autotest'

)

#
# conn = pymysql.connect(
#     host='172.16.20.27',
#     port=3316,
#     user='WMS_Write',
#     password='UnipsWW@5771.com',
#     database='imlrequest'
#
# )


setting = ['WMS','ERP','TMS','WES','MES']


