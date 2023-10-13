from django.db.models import Q

from accounts.models import User
from sesactalk.mixins import SessionDecoderMixin
from user.models import UserRelationship
from user.serializers import FollowerSerializer, FollowSerializer

class UserRelationshipDataHandlerMixin(SessionDecoderMixin):
    def get_response_data(self, frontend_session_key, relationship_type, profile_user_id):
        login_user_id = self.extract_user_id_from_session(frontend_session_key)
        id_list = self.get_user_id_list(relationship_type, profile_user_id)
        serializerObj = self.get_serializer_obj(login_user_id, relationship_type, id_list)

        return serializerObj.data

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

    def get_serializer_obj(self, login_user_id, relationship_type, id_list):
        user = User.objects.filter(id__in=id_list)
        serializerObj = None
        if relationship_type == 'follow':
            serializerObj = FollowSerializer(user, many = True, context={'login_user_id' : login_user_id})
        elif relationship_type == 'follower':
            serializerObj = FollowerSerializer(user, many = True, context={'login_user_id' : login_user_id})

        return serializerObj