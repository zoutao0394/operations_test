# encoding:utf-8
from flask import Flask,request,render_template,jsonify,json,send_from_directory,flash,redirect,url_for,make_response
import control
from page_operation.basic import *
import os
from werkzeug.utils import secure_filename

import time



app = Flask(__name__)

# root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "report")




















@app.route('/home')
@app.route('/')
def home():
    return render_template('home.html')



# 基础配置的视图函数
@app.route('/configmanage',methods=['GET'])
def configmanage():
    a = control.configmanage()
    values = a.showwarehouse()

    return render_template('configmanage.html',values = values)


@app.route('/changeconfig', methods=['POST'])
def changeconfig():

    detail = request.form.get("value")
    detail = detail.split(';')
    print(detail)
    change = control.configmanage()
    result = change.changewarehouse('zoutao',detail[0],detail[1])
    return result

@app.route('/createwarehouse',methods=['POST'])
def createwarehouse():
    data = request.form.to_dict()
    a = control.configmanage()
    result = a.insertconfig(data)

    return result

@app.route('/currentwarehouse',methods=['get'])
def currentwarehouse():
    a = control.configmanage()
    data = a.currentwarehouse[1]+'-'+a.currentwarehouse[3]
    return "当前仓库："+data

@app.route('/currentuser',methods=['get'])
def currentuser():
    # a = control.currentwarehouse()
    return "当前用户：zoutao"

@app.route('/star_test',methods=['GET','POST'])
def star_test():
    script = request.form.to_dict()['detail ']
    control.run(script)
    return '开始测试'


# 测试用例管理的视图函数
@app.route('/casemanage',methods=['GET','POST'])
def casemanage():
    caselist = control.scriptlist()
    return render_template('casemanage.html',values = caselist)

@app.route('/showcase',methods=['GET','POST'])
def showcase():
    if request.method == 'POST':
        d = request.form.to_dict()
        print(d)
        system = d['system']
        casetype = d['casetype']
        current_page = d['current_page']
        case = control.casemanage()
        if system == '' or casetype == '':
            data = case.showcase()
            return data
        # process = d['process']
        # d = str(d)

        else:
            data = case.showcase(system=system, casetype=casetype, current_page=int(current_page))
            return data


@app.route('/selectsyetem',methods=['GET','POST'])
def selectsyetem():
    # caselist = control.scriptlist()
    system = control.casemanage()
    data = system.selectsystem()
    return data

@app.route('/selectcasetype',methods=['GET','POST'])
def selectcasetype():
    casetype = control.casemanage()
    data = casetype.selectcasetype()
    return data


@app.route('/createcase',methods=['GET','POST'])
def createcase():
    data = request.form.to_dict()
    case = control.casemanage()
    result = case.createcase(data =data)
    # print(d)
    return result


@app.route('/deletecase',methods=['GET','POST'])
def deletecase():
    data = request.form.get('caseid')
    idlist = data.split(';')
    case = control.casemanage()
    for i in idlist:
        print(i)
        case.deletecase(i)

    return "编号：%s 的用例删除成功"%data


@app.route('/upload', methods = ['POST'])
def upload():
    # print(request.files)
    file = request.files['file_data']
    # print(file)
    # print(file.filename)
    # filename = file.filename.split('.')[0]
    filetype = file.filename.split('.')[1]

    if filetype != 'jmx':
        app.config['UPLOAD_FOLDER'] = 'D:\\operations_test\\static\\testcase\\casetemplate'
        a = control.casemanage()
        result = a.caseintegrate(file.filename)
        if result == True:
            file.save(os.path.join(app.config['UPLOAD_FOLDER'],file.filename))
            return jsonify({'result':'用例导入成功'})
        else:
            return jsonify({'result':'没有找到匹配的用例'})
    else:
        app.config['UPLOAD_FOLDER'] = 'D:\\operations_test\\JmeterScript\\testcase'
        a = control.casemanage()
        result = a.caseintegrate(file.filename)
        if result == True:
            file.save(os.path.join(app.config['UPLOAD_FOLDER'],file.filename))
            return jsonify({'result':'用例导入成功'})
        else:
            return jsonify({'result':'没有找到匹配的用例'})



@app.route("/downloadcase", methods=['GET'])
def downloadcase():
    caseid = request.args.get("caseid")
    # print(caseid)
    # caseid = 193
    a = control.casemanage()
    b = a.casepath(caseid)
    filename = b[0]
    path = b[1]
    # print(b)

    response = make_response(
		send_from_directory(path, filename.encode('utf-8').decode('utf-8'), as_attachment=True))
    response.headers["Content-Disposition"] = "attachment; filename={}".format(filename.encode().decode('latin-1'))
    return response






# 测试任务模块的视图函数
@app.route('/taskconfig',methods=['GET','POST'])
def taskconfig():
    return render_template('taskconfig.html')


@app.route('/showtask',methods=['GET','POST'])
def showtask():
    a = control.taskmanage()
    result = a.show(a.selecttask)
    return jsonify(result)


@app.route('/starttask',methods=['POST'])
def starttask():
    taskid = request.form.get('taskid')
    a = control.taskmanage()
    # b = a.taskscript(taskid)
    a.starttask(taskid)

    return '任务已启动'


@app.route('/taskcasedetail',methods=['GET'])
def taskcasedetail():
    # taskname = request.form.get('taskname')
    a = control.taskmanage()
    b = a.show(a.taskcasedetail)
    return b


@app.route('/createtask',methods=['POST'])
def createtask():
    task = request.form.to_dict()
    a = control.taskmanage()
    print(task)
    b = a.createtask(task['taskname'],task['startmode'],task['caseids'])
    # b = a.showcase()
    return b


@app.route('/taskcase',methods=['POST'])
def taskcase():
    taskid = request.form.to_dict()
    a = control.taskmanage()
    b = a.show(a.taskcase,taskid=taskid['taskid'])
    return b







#测试报告模块

@app.route('/reportmanage',methods=['GET','POST'])
def reportmanage():
    report = os.listdir("./report")
    print(report)

    return render_template('reportmanage.html',values=report)



@app.route('/showreport',methods=['GET','POST'])
def showreport():
    taskid = request.form.to_dict()['taskid']
    # print(taskid)
    a = control.report(taskid)
    try:
        b = a.reporthtml()

        return b
    except BaseException:
        return "当前任务未执行完毕"


@app.route('/uploadreport', methods = ['POST'])
def uploadreport():
    # print(request.files)
    file = request.files['file_data']
    # print(file)
    # print(file.filename)
    # filename = file.filename.split('.')[0]
    filetype = file.filename.split('.')[1]

    if filetype != 'jmx':
        app.config['UPLOAD_FOLDER'] = 'D:\\operations_test\\static\\report\\testreport'
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
        return jsonify({'result': '用例导入成功'})


    else:
        pass
























@app.route('/develop',methods=['GET','POST'])
def develop():
    data = control.oplist()
    return render_template('develop.html',data=data)


@app.route('/operationstar',methods=['POST'])
def operationstar():
    data = request.form.to_dict()['operation']
    control.operationstar(data)

    return "执行成功"





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