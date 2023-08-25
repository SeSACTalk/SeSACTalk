from django.contrib.sessions.models import Session
from typing import Union

from accounts.models import User

class OwnerPermissionMixin:
    """
        POST에 접근 하는 주체를 검사 하는 Mixin 클래스
        R을 제외한 C, U, D의 시도를 차단 하려는 목적에서 생성.
    """

    def get_post_owner_id(self, frontend_session_key: str) -> int:
        session = Session.objects.get(session_key=frontend_session_key)
        user_id = session.get_decoded().get('_auth_user_id')

        return user_id

    def get_post_owner(self, frontend_session_key: str)-> User:
        user = User.objects.get(id = self.get_post_owner_id(frontend_session_key))

        return user

    def check_post_owner(self, frontend_session_key: str, username: str, option: str = None)-> Union[bool, tuple]:
        # get owner
        user_post_owner = self.get_post_owner(frontend_session_key)

        # check : owner == 경로 username
        condition = (username == user_post_owner.username)

        if option == 'get_owner':
            # user_post_owner condition 둘 다 반환
            return user_post_owner, condition

        return condition

def get_profile_img_mixin(img):
    if img != '""':
        return img
    return '/media/profile/default_profile.png'