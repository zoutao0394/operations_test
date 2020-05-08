# encoding=utf-8

from selenium import webdriver
import functools
from time import sleep,time
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common import exceptions as ex
from selenium.webdriver.support.select import Select
from selenium.webdriver.chrome.options import Options
import datetime




def log(func):
    @functools.wraps(func)
    def wrapper(*args,**kw):
        day1 = datetime.datetime.now()
        now_day = str(day1)[:10]
        time1 = time()
        result = func(*args,**kw)
        time2 = time()
        time3 = time2-time1
        with open('./log/%s.log'%now_day, 'a', encoding='utf-8') as loging:
            day = datetime.datetime.now()
            new_time = str(day)[:19]
            loging.write('%s 开始执行%s:总用时%d 秒。\n运行结果：\n%s \n' % (new_time, func.__name__,time3,result))
        return result
    return wrapper






class Login():


    def __init__(self,user,password,url):
        # chrome_options = Options()
        # chrome_options.add_experimental_option('excludeSwitches', ['enable - automation'])
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()

        self.user = user
        self.password = password
        self.url = url
        self.driver.get(self.url)
        sleep(1)


    @log
    def login(self):

        self.driver.find_element_by_id('LoginNo').send_keys(self.user)
        sleep(1)
        self.driver.find_element_by_name('LoginPassword').send_keys(self.password)
        sleep(1)
        self.driver.find_element_by_id('CaptchaValidator').send_keys('ztcs')
        sleep(1)
        self.driver.find_element_by_css_selector('[type="submit"]').click()
        sleep(1)
        # print(driver.page_source.replace(u'\xa0', u''))


        if self.driver.title == '首页':
            return "登录成功"
        else:
            return "登录失败"


    # def index(self,module,modulelist = [],error = []):   #不切换页面进行页面检查
    #
    #     n = 0
    #     control = True
    #
    #     xpaths = self.driver.find_elements_by_css_selector('[class="btn-group my-animation-line"]')
    #     for x in xpaths:
    #         if control == True:
    #
    #             ActionChains(self.driver).move_to_element(x).perform()  # 检查一级模块内是否有目标模块
    #
    #
    #
    #             # x.double_click()
    #             y = x.find_elements_by_css_selector('[class="my-menu-item"]')
    #             for z in y:
    #                 if control == True:
    #                     z1 = z.find_elements_by_css_selector('[class="my-menu-item-detial-item"]')
    #
    #                     for z2 in z1:
    #
    #                         if z2.text == module:
    #                             # ActionChains(driver).move_to_element(x).perform()
    #                             # z3 = z2.find_element_by_css_selector('[class="glyphicon glyphicon-edit"]')  #新窗口打开
    #                             z2.click()  # 进入目标模块
    #                             n += 1
    #
    #                             control = False
    #
    #                             break
    #
    #                         elif module == '所有模块':
    #                             n += 1
    #
    #                             if z2.text not in modulelist:
    #                                 modulelist.append(z2.text)
    #                                 z2.click()
    #                                 self.driver.back()
    #                                 # ActionChains(driver).move_to_element(x).perform()
    #                                 try:
    #                                     ActionChains(self.driver).move_to_element(x).perform()
    #
    #                                 except ex.StaleElementReferenceException:
    #                                     error.append(z2.text)
    #                                     self.index('所有模块',modulelist,error)
    #
    #
    #
    #
    #
    #
    #
    #
    #     if n == 0:
    #         return '当前登录用户没有%s模块'%module
    #
    #     elif len(error)>=1:
    #         return error
    #
    #     else:
    #         return '测试通过'


    def a_module(self,elelist=[]):
        xpaths = self.driver.find_elements_by_css_selector('[class="btn-group my-animation-line"]')

        for xpath in xpaths:
            if xpath.text != '':
                elelist.append(xpath)
            # elename.append(xpath.text)

        return elelist


    def module(self,element,ele,elelist=[]):


        xpaths = element.find_elements_by_css_selector(ele)
        for xpath in xpaths:
            if xpath.text != '':
                elelist.append(xpath)
            # elename.append(xpath.text)


        return elelist





    def index(self,clickmodule=[]):
        a = self.a_module()

        for eles in a:
        #
            ActionChains(self.driver).move_to_element(eles).perform()
            sleep(0.5)
            c = self.module(eles, '[class="my-menu-item-detial-item"]')
            for i in c:
                if len(i.text)>1:
                    print('模块名：%s' % i.text)
                    clickmodule.append([eles,i,i.text])

        return clickmodule



    #
    #
    @log
    def clickmodule(self,addlist=[],error=""):
        print(addlist)
        if len(addlist)>0:
            for element in addlist:
                try:
                    ActionChains(self.driver).move_to_element(element[0]).perform()

                    title = element[1].text
                    element[1].find_element_by_css_selector('[class="glyphicon glyphicon-edit"]').click()
                    sleep(1)
                    handles = self.driver.window_handles
                    self.driver.switch_to.window(handles[-1])
                    sleep(1)
                    # if title != self.driver.title:
                    #     error += '%s-打开失败\n' % element[1].text
                    self.driver.close()
                    self.driver.switch_to.window(handles[0])
                except BaseException:
                    error += '%s 页面导致元素丢失'% element[1].text
                    return error

        if len(error)>1:
            return error
        else:
            return '测试通过'



    def system(self,systemname,systemlist=[]):
        n = 0
        syselement = self.driver.find_element_by_id('SelSystemName')
        ActionChains(self.driver).move_to_element(syselement).perform()

        s = self.driver.find_elements_by_css_selector('[class="system-name"]')

        if systemname == '所有系统':
            n += 1
            for x in s:
                if x.text not in systemlist:
                    systemlist.append(x.text)
                    x.click()
                    sleep(2)
                    self.system(systemname, systemlist)
                    break

        else:
            for x in s:
                if x.text == systemname:
                    n+=1
                    x.click()
                    sleep(2)
                    break
        if n ==0:
            return print('没有%s系统'%systemname)

    def iframe(self,*args):
        if args[0] == 'in':
            self.driver.switch_to.frame(args[1])

        elif args[0] == 'out':
            if args[1] == 0:
                self.driver.switch_to.default_content()
            elif args[1] == 1:
                self.driver.switch_to.parent_frame()
            else:
                print('0代表回到顶层，1代表回到上一层')

        else:
            print('in代表进入iframe,out代表退出iframe')

    # def handle(self):
    #     now_handle = self.driver.current_window_handle # 获取当前句柄
    #     all_handles = self.driver.window_handles # 获取所有句柄
    #
    #     for handle in all_handles:
    #         if handle != now_handle:
    #             self.driver.switch_to.window(handle)


    def form(self,formid,*args,**kwargs):
        form = self.driver.find_element_by_id(formid)
        group = form.find_elements_by_css_selector('[class="form-group"]')
        for i in group:
            try:
                name = i.find_element_by_css_selector('[class="control-label"]')
                if name.text == '仓库-会员：':
                    i.click()
                    tab = self.driver.find_element_by_id('tab-join-box1')
                    wm = tab.find_elements_by_css_selector('[data-toggle="tab"]')

                    for w in wm:
                        w.click()
                        tbody = tab.find_element_by_tag_name('tbody')
                        trs = tbody.find_elements_by_tag_name('tr')
                        for tr in trs:
                            print(w.text)
                            print(tr.text)
                            print(type(tr.text))
                            sleep(1)
                            if w.text == '仓库':
                                if '测试仓库1002' in tr.text:
                                    print('Y')
                                    tr.click()
                                    break

                        for tr in trs:
                            print(w.text)
                            print(tr.text)
                            print(type(tr.text))
                            sleep(1)
                            if w.text == '会员':
                                if '测试仓库1002' in tr.text:
                                    print('Y')
                                    tr.click()
                                    break





                # print(name.text)
                # i.click()
                # i.find_element_by_tag_name('input').send_keys('123')
                # i.click()
                #
                # sleep(1)
            except ex.NoSuchElementException:
                i.click()
                sleep(1)

            except ex.ElementNotInteractableException:
                continue






    def close(self):
        self.driver.close()





if __name__ == '__main__':
    test = Login('Test5001','a123456','http://cloud.basic.fineex.net/Login')

    test.login()
    test.system('仓储服务')
    a = test.index()

    test.clickmodule(a)
    # test.indexdetail(test.index())
    # s0 = test.a_module()
    # s1 = test.b_module(s0[0][0])
    # s2 = test.c_module(s1[0][0])
    # print(s2)


    test.close()
    # testlog()


