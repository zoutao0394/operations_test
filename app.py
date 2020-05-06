# encoding:utf-8
from flask import Flask
import control,config
import time



app = Flask(__name__)


@app.route('/<site_name>')
def star_test(site_name):

    if site_name in config.setting:
        rpl=control.run(site_name)
        # time.sleep(150)
        # for rp in rpl:
        #     rst= control.ana_report(rp)
        #     result=result+rst

        return "测试已启动"

    else:
        return '站点不存在'


@app.route('/select_environment/<select_environment>')
def change_environment(select_environment):
    environment = control.select_environment(select_environment)
    return environment


@app.route('/<username>/<warehousename>')
def change_config(username,warehousename):
    try:
        control.changeconfig(username, warehousename)
        return '修改成功'

    except BaseException:

        return '修改失败'



@app.route('/create/<username>/<info>')
def create_config(username,info):
    try:
        control.createconfig(username,info)
        return '新增成功'

    except BaseException:

        return '新增失败'



if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0',port=50001)