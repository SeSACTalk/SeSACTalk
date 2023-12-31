from django.contrib.sessions.models import Session
from rest_framework import exceptions

from accounts.models import User

class SessionDecoderMixin:
    def extract_user_id_from_session(self, frontend_session_key: str) -> int:
        try:
            session = Session.objects.get(session_key = frontend_session_key)
            user_id = session.get_decoded().get('_auth_user_id')

            return int(user_id)
        except:
            raise exceptions.AuthenticationFailed

    def get_user_by_pk(self, frontend_session_key: str) -> User:
        user = User.objects.get(id = self.extract_user_id_from_session(frontend_session_key))

        return user