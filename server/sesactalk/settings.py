"""
Django settings for server project.

Generated by 'django-admin startproject' using Django 4.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from environ import Env
import mysql.connector.django
import os
import firebase_admin
from firebase_admin import credentials

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

MEDIA_URL = '/media/'

env = Env() # env 객체 생성
env_path = BASE_DIR / '.env' # env파일 경로 설정
if env_path.exists():
    with env_path.open('rt', encoding='UTF8') as f:
        env.read_env(f, overwrite = True)

service_account_key = {
    "type": env("TYPE"),
    "project_id": env("PROJECT_ID"),
    "private_key_id": env("PRIVATE_KEY_ID"),
    "private_key": env("PRIVATE_KEY").replace(r'\n', '\n'),
    "client_email": env("CLIENT_EMAIL"),
    "client_id": env("CLIENT_ID"),
    "auth_uri": env("AUTH_URI"),
    "token_uri": env("TOKEN_URI"),
    "auth_provider_x509_cert_url": env("AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": env("CLIENT_X509_CERT_URL"),
}

cred = credentials.Certificate(service_account_key) 
firebase_admin.initialize_app(cred)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-e)-7+_=po5ay-j4y4i!8z#d6u4d0az-0w+t8jdy&pn5v-9ww*$'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'debug_toolbar', # 디버그 툴바 추가
    'corsheaders', # CORS 추가
    'rest_framework',
    'rest_framework.authtoken',
    'accounts',
    'user.apps.UserConfig',
    'post',
    'chat',
    'explore',
    'reply',
    'profiles',
    'master',
]

ASGI_APPLICATION = 'sesactalk.asgi.application'

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # CORS 추가
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware', # 디버그 툴바 추가
]

INTERNAL_IPS = ['127.0.0.1'] # 디버깅할 ip 기재

# CORS 추가
CORS_ORIGIN_WHITELIST = (
    env.str('BACK_BASE_URL'), env.str('FRONT_BASE_URL')
)
COLS_ALLOW_CREDENTIALS = True

ROOT_URLCONF = 'sesactalk.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'sesactalk.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'sesac',
        'USER': 'bibigo',
        'PASSWORD': env.str('SQL_HOST_PASSWORD'),
        'HOST': '127.0.0.1',
        'PORT': '3306'
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators
AUTH_USER_MODEL = 'accounts.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'ko-KR'

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'
# STATIC_ROOT = BASE_DIR / 'static'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGIN_REDIRECT_URL = '/'

# 세션 관련 설정
SESSION_ENGINE = 'django.contrib.sessions.backends.db'  # DB 기반 세션
SESSION_COOKIE_NAME = 'my_session_cookie'  # 세션에 사용할 쿠키 이름
SESSION_COOKIE_SECURE = False  # HTTPS 연결에서만 쿠키 사용 (보안 강화를 위해)
SESSION_EXPIRE_AT_BROWSER_CLOSE = False  # 브라우저 종료 시 세션 만료 여부
SESSION_COOKIE_HTTPONLY = True  # JavaScript에서 쿠키 접근 방지 (보안 강화를 위해)
SESSION_COOKIE_SAMESITE = 'Lax'  # SameSite 설정 (CSRF 보호를 위해)

# 이메일 관련 설정
# smtp 설정
EMAIL_HOST = env.str("EMAIL_HOST")
EMAIL_PORT = env.int("EMAIL_PORT")
EMAIL_USE_SSL = env.str("EMAIL_USE_SSL")
EMAIL_HOST_USER = env.str("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env.str("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = f"{EMAIL_HOST_USER}@naver.com"