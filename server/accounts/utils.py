from datetime import datetime

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.template.loader import render_to_string

def send_email_to_send_temporary_password(username : str, receiver : str, temp_password : str) -> None :
    current_time = datetime.now().strftime("%Y년 %m월 %d일 %H:%M:%S")
    subject = render_to_string("accounts/send_temporary_password_subject.txt", {'username' : username})
    content = render_to_string("accounts/email_template.html", {'current_time' : current_time, 'temp_password' : temp_password})
    sender_email = settings.DEFAULT_FROM_EMAIL

    try: # 메일의 유효성을 검사
        validate_email(receiver)
    except ValidationError as e:
        print(e.message)

    send_mail(
        subject,
        content,
        sender_email,
        [receiver],
        fail_silently=False,
        html_message = content
    )