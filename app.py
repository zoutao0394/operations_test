# encoding:utf-8
from flask import Flask,request,render_template,jsonify,json
import control,config
from page_operation.basic import *


import time



app = Flask(__name__)


@app.route('/star_test/<site_name>')
def star_test(site_name):
    control.run(site_name)
    return '测试开始'


@app.route('/ui_test/<sys_name>')
def ui_test(sys_name):
    test = Login('Test5001','a123456','http://cloud.basic.fineex.net/Login')

    test.login()
    test.system(sys_name)
    a = test.index()
    b = test.clickmodule(a)
    test.close()
    return b


@app.route('/home')
def change_environment():
    return render_template('index.html')


@app.route('/change_config',methods=['GET','POST'])
def change_config():
    if request.method == 'GET':
        a = control.showwarehouse()
        # value = str(a)
        return render_template('changeconfig.html',a = a)

    else:
        warehousename = request.form.to_dict()['warehousename']
        control.changeconfig('zoutao',warehousename)
        return '变更成功'



@app.route('/createconfig',methods=['GET','POST'])
def create_config():
    if request.method == 'GET':


        return render_template('createconfig.html')

    else:
        # data = request.json  # 获取 JSON 数据

        data = request.form.to_dict()
        # data = pd.DataFrame(data["obj"])
        control.createconfig(data)
        return '新增成功'




if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0',port=50001)