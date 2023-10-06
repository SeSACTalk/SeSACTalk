from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from profiles.models import Profile
from accounts.models import Campus, Course, User
from profiles.serializers import ProfileSerializer, EditProfileSerializer
from accounts.serializers import CampusSerializer, CourseSerializer
from sesactalk.mixins import SessionDecoderMixin


class ProfileView(APIView, SessionDecoderMixin):
    def get(self, request:HttpRequest, username: str) -> Response:
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        
        data = None

        # user_id와 username 값 비교(True == 내 프로필)
        if (username == User.objects.get(id = user_id).username):
            profile = Profile.objects.get(user=user_id)

            profileSerializer=ProfileSerializer(profile)
            data=profileSerializer.data
            data['isProfileMine'] = 'True'
        else: 
            try: # 경로로 넘어온 username의 조회 결과가 None일 때 exception
                user_id = User.objects.get(username = username).id
                profile = Profile.objects.get(user = user_id)

                profileSerializer=ProfileSerializer(profile)
                data=profileSerializer.data
                data['isProfileMine'] = 'False'
            except Exception:
                print(Exception)
                return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
            
        return Response(data = data, status=status.HTTP_200_OK)


class EditProfileView(APIView, SessionDecoderMixin):
    def get(self, request:HttpRequest, username: str) -> Response:
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        
        # user_id와 username 값 비교(True == 내 프로필)
        if (username == User.objects.get(id = user_id).username):
            try:
                # User, Profile, Course, and Campus 모델을 조인하여 필요한 필드들을 조회
                profile_queryset = Profile.objects.select_related('user').filter(user__username = username).first()
                profileSerializers = EditProfileSerializer(profile_queryset)

                # 프로필 수정 폼의 캠퍼스 셀렉트 옵션을 보낸다.
                campuses = Campus.objects.all()
                campusSerializer = CampusSerializer(campuses, many = True)

                response_data = {
                    'profile' : profileSerializers.data,
                    'campus': campusSerializer.data,
                }

                # 과정 axios 요청
                campus_id = request.query_params.get('campus_id')

                if campus_id:
                    courses_on_campus = Course.objects.filter(campus_id = campus_id)
                    courseSerializer = CourseSerializer(courses_on_campus, many = True)
                    response_data['course'] = courseSerializer.data


            except Exception:
                print(Exception)
                return Response({'error': 'EditProfile not found'}, status=status.HTTP_404_NOT_FOUND)
        
            return Response(data = response_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'EditProfile not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request:HttpRequest, username: str) -> Response:
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        userObj = User.objects.get(id = user_id)
        profileObj = Profile.objects.get(user = user_id)

        # 역직렬화
        editProfileUserData = request.data
        userObj.birthdate = editProfileUserData['birthdate']
        userObj.phone_number = editProfileUserData['phone_number']
        userObj.email = editProfileUserData['email']
        if editProfileUserData['password'] != '*****':
            userObj.password = editProfileUserData['password']

        profileObj.img_path = editProfileUserData['profile_img_path']
        profileObj.content = editProfileUserData['profile_content']
        profileObj.link = editProfileUserData['profile_link']
        profileObj.course_status = editProfileUserData['profile_course_status']
        if profileObj.course_status.lower() == 'true':
            profileObj.course_status = True
        else:
            profileObj.course_status = False

        second_course = editProfileUserData['second_course__name']
        if second_course:
            second_course_id = int(second_course)
            userObj.second_course = Course.objects.get(id = second_course_id)

        userObj.save()
        profileObj.save()

        return Response({'message': 'Data updated successfully'}, status=status.HTTP_200_OK)