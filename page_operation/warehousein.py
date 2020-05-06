# encoding:utf-8

from page_operation.basic import *

class Accept(Login):


    def insert(self):
        pass





    def select(self):
        self.iframe('in','iframe0')
        elem = self.driver.find_element_by_xpath('//*[@id="form1"]/div[2]/div/div/button[1]')
        print(elem.text)
        elem.click()
        sleep(2)
        warehouse = self.driver.find_element_by_id('Warehouse-MemberCtl')
        warehouse.click()
        sleep(2)
        table = self.driver.find_element_by_xpath('//*[@id="tab-join-box1"]/div/div[2]/div[1]/div[2]/div[2]/table')
        tr = table.find_elements_by_tag_name('tr')
        th = table.find_elements_by_tag_name('th')
        print(tr)
        print(th)

        for t1 in tr:
            print(t1.text)
            td = t1.find_elements_by_tag_name('td')
            for td1 in td:
                print(td1.text)
                td1.click()
                break





        # for t2 in th:
        #     print(t2.text)


    def update(self):
        pass


if __name__ == '__main__':

    test = Accept('zoutao','a123456','http://172.16.20.6:8090/Login/Index')
    test.login()
    test.system('仓储服务')
    test.index('入库受理')
    test.select()

    # test.close()