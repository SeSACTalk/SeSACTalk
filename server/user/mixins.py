from django.db.models import Q

from accounts.models import User
from sesactalk.mixins import SessionDecoderMixin
from user.models import UserRelationship

class FollowInformationHandlerMixin(SessionDecoderMixin):
    def get_follow_status_info(self, session_key: str, userRelationship_id_list: list, serializerObj) -> list:
        login_user_id = self.extract_user_id_from_session(session_key)
        result_data = []

        for i, userRelationship_id in enumerate(userRelationship_id_list):
            userRelationship_id = int(userRelationship_id[0])
            user = User.objects.get(id=userRelationship_id)
            condition = UserRelationship.objects.filter(
                Q(user_follow_id=userRelationship_id) & Q(user_follower_id=login_user_id)).exists()

            result_data.append({i: {
                'user_info': serializerObj(user).data,
                'follow_status': condition,
                'is_current_user': (userRelationship_id == login_user_id)
            }})
        return result_data