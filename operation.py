# coding=utf-8


import pandas as pd
import codecs
xd = pd.ExcelFile('./static/testcase/casetemplate/迭代测试用例模板.xlsx')
df = xd.parse()
with codecs.open('./static/testcase/casetemplate/迭代测试用例模板.html','w','utf-8') as html_file:
    html_file.write(df.to_html(header = True,index = False))







