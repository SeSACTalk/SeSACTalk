from typing import Union

from sesactalk.mixins import SessionDecoderMixin

class OwnerPermissionMixin(SessionDecoderMixin):
    """
        POST에 접근 하는 주체를 검사 하는 Mixin 클래스
        R을 제외한 C, U, D의 시도를 차단 하려는 목적에서 생성.
    """
    def check_post_owner(self, frontend_session_key: str, username: str, option: str = None)-> Union[bool, tuple]:
        # get owner
        user_post_owner = self.get_user_by_pk(frontend_session_key)

        # check : owner == 경로 username
        condition = (username == user_post_owner.username)

        if option == 'get_owner':
            # user_post_owner condition 둘 다 반환
            return user_post_owner, condition

        return condition