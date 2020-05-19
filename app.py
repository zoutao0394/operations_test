# encoding:utf-8
from flask import Flask,request,render_template,jsonify,json,send_from_directory
import control
from page_operation.basic import *


import time



app = Flask(__name__)

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "report")

@app.route('/star_test',methods=['GET','POST'])
def star_test():
    script = request.form.to_dict()['detail ']
    control.run(script)
    return '开始测试'




@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/configmanage',methods=['GET'])
def configmanage():
    # if request.method == 'GET':
    values = control.showwarehouse()
    # value = str(a)
    return render_template('configmanage.html',values = values)


@app.route('/changeconfig', methods=['POST'])
def changeconfig():

    detail = request.form.get("value")
    detail = detail.split(';')
    control.changeconfig('zoutao',detail[0],detail[1])
    return '切换成功'



@app.route('/createwarehouse',methods=['POST'])
def createwarehouse():
    # data = request.form.to_dict()
    # result = control.createwarehouse(data)

    return "新增成功"


@app.route('/casemanage',methods=['GET','POST'])
def casemanage():
    caselist = control.scriptlist()
    return render_template('casemanage.html',values = caselist)



@app.route('/reportmanage',methods=['GET','POST'])
def reportmanage():
    report = os.listdir("./report")
    print(report)

    return render_template('reportmanage.html',values=report)




@app.route('/taskconfig',methods=['GET','POST'])
def taskconfig():
    return render_template('taskconfig.html')


@app.route('/develop',methods=['GET','POST'])
def develop():
    data = control.oplist()
    return render_template('develop.html',data=data)


@app.route('/operationstar',methods=['POST'])
def operationstar():
    data = request.form.to_dict()['operation']
    control.operationstar(data)

    return "执行成功"



@app.route('/configdetail',methods=['GET','POST'])
def configdetail():
    return render_template('configdetail.html')


# dirpath = os.path.join(app.root_path,'report')
#
# @app.route('/report',methods=['GET','POST'])
# def report():
#     return send_from_directory(dirpath,"./20200512112720B2B入库.jmx",as_attachment=True)

@app.route('/currentwarehouse',methods=['get'])
def currentwarehouse():
    a = control.currentwarehouse()
    return "当前仓库："+a

@app.route('/currentuser',methods=['get'])
def currentuser():
    # a = control.currentwarehouse()
    return "当前用户：zoutao"




# @app.route('/configlist',methods=['get'])
# def configlist():
#     a = control.configlist()
#     return jsonify(a)
#

@app.route('/scriptrun',methods=['post'])
def scriptrun():
    data = request.form.get('name')
    print(data)
    control.scriptrun(data)
    return "%s启动"%data

@app.route('/saveorder',methods=['post'])
def saveorder():
    order = request.form.get('orders')
    scriptname = request.form.get('scriptname')
    # print(data)
    control.order(scriptname,order)
    return "保存成功"


@app.route('/selectrun',methods=['post'])
def selectrun():
    data = request.form.get('script')
    # print(data)
    control.selectrun(data)
    return "%s启动"%data




if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0',port=5000)