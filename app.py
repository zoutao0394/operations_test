# encoding:utf-8
from flask import Flask,request,render_template
import control,config


import time



app = Flask(__name__)


@app.route('/<site_name>')
def star_test(site_name):

    pass

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



@app.route('/createconfig',methods=['GET','POST'])
def create_config():
    if request.method == 'GET':

        return render_template('createconfig.html')

    else:
        username = "a"
        info = "b"
        try:
            control.createconfig(username, info)
            return '新增成功'

        except BaseException:

            return '新增失败'




if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0',port=50001)