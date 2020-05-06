# encoding:utf-8
from page_operation.basic import Login

print('请输入登录用户名')
user = input()
print('请输入登录密码')
password = input()
print('请输入url地址')
url = input()
print('请输入系统名')
systemname = input()
print('请输入模块名')
modulename = input()
print('开始测试')

test = Login(user, password, url)

test.login()
test.system(systemname)
test.index(modulename)
# test.indexdetail(test.index())
test.close()