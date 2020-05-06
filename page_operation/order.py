# encoding:utf-8
from page_operation.basic import *



class WavesManage(Login):

    def select(self):
        self.iframe('in', 'iframe0')
        # form = self.driver.find_element_by_id('form1')
        # group = form.find_elements_by_class_name('form-group')
        #
        # for i in group:
        #     # print(i.text)
        #     #
        #     # i.click()
        #     # if i.text == '波次状态':
        #     #     i.find_element_by_id()
        #     #     i.submit()
        #     # # i.submit()
        #     # sleep(1)
        #     if i.text == '创建时间':
        #         # i.clear()
        #         i.send_keys('2019-04-23 00:00:00 ~ 2020-04-23 23:59:59')
        #         sleep(1)
        #         i.submit()

        # data = self.driver.find_element_by_xpath('//*[@id="date"]')
        # data.clear()
        # data.send_keys('2009-04-23 00:00:00 ~ 2020-04-23 23:59:59')
        # data.submit()


if __name__ == '__main__':

    test = WavesManage('zoutao','a123456','http://172.16.20.6:8090/Login/Index')
    test.login()
    test.system('仓储服务')
    test.index('波次管理')
    test.select()
    test.form('form1')
