import auth
import conf
import pickle
import requests
from bs4 import BeautifulSoup
from time import sleep
from selenium import webdriver

chrome_options = webdriver.ChromeOptions()
chrome_options.binary_location = conf.brave_path
driver = webdriver.Chrome(executable_path=conf.driver_path, options=chrome_options)

def get_page():
    page = requests.get(conf.groovin_url)    
    soup = BeautifulSoup(page.content, 'html.parser')
    para = soup.find_all('select', attrs = {'name': 'lQuantity0'})
    print(para)

def moshtix_login():
    driver.get(conf.login_url)
    sleep(5)
    fill_input('username', auth.username)
    fill_input('password', auth.password)
    click_button('user-login-button')
    sleep(2)
    cookies = driver.get_cookies()
    f = open('cookies.txt', 'wb')
    pickle.dump(cookies, f)
    f.close()

def splendy_buyer():
    driver.get(conf.splendour_url)
    cookies = pickle.load(open("cookies.txt", "rb"))
    for cookie in cookies:
        if 'expiry' in cookie:
            del cookie['expiry']
        driver.add_cookie(cookie)
    driver.get(conf.splendour_url)
    sleep(3)
    fill_dropdown('lQuantity8', '1')
    click_button('event-buy-tickets')
    sleep(2)
    fill_dropdown('dob-day', auth.dob_day)
    fill_dropdown('dob-month', auth.dob_month)
    fill_dropdown('dob-year', auth.dob_year)

def fill_input(name, desired_value):
    driver.find_element_by_xpath('//input[@name=\"{0}\"]'.format(name)).send_keys(desired_value)

def fill_dropdown(name, desired_value):
    dropdown = driver.find_element_by_xpath('//select[@name=\"{0}\"]'.format(name))
    for option in dropdown.find_elements_by_tag_name('option'):
        if option.text == desired_value:
            option.click()
            break

def click_button(name):
    driver.find_element_by_xpath('//input[@id=\"{0}\"]'.format(name)).click()

def click_link(url):
    driver.find_element_by_xpath('//a[@href=\"{0}\"]'.format(url)).click()

def check_cookies():
    print('Check Cookies')

splendy_buyer()