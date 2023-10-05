from sesactalk.mixins import SessionDecoderMixin

from accounts.models import User

class AccessRestrictionMixin(SessionDecoderMixin):
      def check_admin_by_pk(self, frontend_session_key: str) -> bool:
        staff_user = User.objects.filter(is_staff = True).only('is_staff').get(id = self.extract_user_id_from_session(frontend_session_key))
        
        return staff_user.is_staff