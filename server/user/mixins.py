from django.db.models import Q

from accounts.models import User
from sesactalk.mixins import SessionDecoderMixin
from user.models import UserRelationship
from user.serializers import FollowerSerializer, FollowSerializer

class UserRelationshipDataHandlerMixin(SessionDecoderMixin):
    def get_response_data(self, frontend_session_key, relationship_type, profile_user_id, is_profile_mine):
        response_data = []
        id_list = self.get_user_id_list(relationship_type, profile_user_id)

        if is_profile_mine:
            serializerObj = self.get_serializer_obj(relationship_type, is_profile_mine, id_list)
            response_data = serializerObj.data
        else:
            response_data = self.get_follow_status_info(frontend_session_key, relationship_type, id_list)

        return response_data

    def get_user_id_list(self, relationship_type, profile_user_id):
        query = None
        field_name = ''

        if relationship_type == 'follow' :
            query = Q(user_follower = profile_user_id)
            field_name = 'user_follow'
        elif relationship_type == 'follower':
            query = Q(user_follow = profile_user_id)
            field_name = 'user_follower'

        return UserRelationship.objects.filter(query).values_list(field_name)

    def get_serializer_obj(self, relationship_type, is_profile_mine, id_list):
        user = User.objects.filter(id__in=id_list)
        if not is_profile_mine :
            user = user.first()
        serializerObj = None
        if relationship_type == 'follow':
            serializerObj = FollowSerializer(user, many = is_profile_mine)
        elif relationship_type == 'follower':
            serializerObj = FollowerSerializer(user, many = is_profile_mine)

        return serializerObj

    def get_follow_status_info(self, frontend_session_key: str, relationship_type, id_list) -> list:
        login_user_id = self.extract_user_id_from_session(frontend_session_key)
        result_data = []

        for i, taget_id in enumerate(id_list):
            taget_id = int(taget_id[0])

            serializerObj = self.get_serializer_obj(relationship_type, False, id_list)
            condition = UserRelationship.objects.filter(
                                                    Q(user_follow_id=taget_id) & Q(user_follower_id=login_user_id))\
                                                .exists()
            is_current_user = (taget_id == int(login_user_id))

            result_data.append({i: {
                'user_info': serializerObj.data,
                'follow_status': condition,
                'is_current_user': is_current_user
            }})

        return result_data